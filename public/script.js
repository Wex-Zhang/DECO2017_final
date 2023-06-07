// the following code use loaclstorage to store user's data
let swimData = JSON.parse(localStorage.getItem('swimData')) || [];
let userInfo = JSON.parse(localStorage.getItem('userInfo')) || {
    // set weight to null initially, to check if user entered the weight value
    weight: null,
};

function showInputBox(inputId) {
    // check if user has input the weight when add swim record, if not show alert and stop add swim record
    if(inputId == 'addSwimRecord'){
        if (userInfo.weight == null) {
            alert("Please enter your weight");
            // show weight input box to use, let them input weight
            showInputBox('WeightInputBox');
            return;
        }
    }

    let inputBox = document.getElementById(inputId);
    // make the input box display
    inputBox.style.display = 'block';
}

function closeInputBox(inputId) {
    let inputBox = document.getElementById(inputId);
    // make the input box hide
    inputBox.style.display = 'none';
}

function calculateTimePer100m(duration, distance) {
    // this function calculate the time in seconds for each 100 meters
    let timePer100mInSeconds = (duration * 60 / distance) * 100;

    // Convert the time to minutes and seconds
    let minutes = Math.floor(timePer100mInSeconds / 60);
    let seconds = Math.round(timePer100mInSeconds % 60);

    // Format the time as a string
    return minutes + "&apos;" + seconds + "&quot;/100m";
}

function formatDuration(durationInMinutes) {
    // this function change the duration from minuts to HH:MM format
    let hours = Math.floor(durationInMinutes / 60);
    let minutes = durationInMinutes % 60;
    if(hours < 10) hours = '0' + hours;
    if(minutes < 10) minutes = '0' + minutes;
    //out put HH:MM date format
    return hours + ":" + minutes;
}

function addSwim() {
    // this function add swim data into local storage and call other functions 
    // to display the stored swim data in swim card and display total distance
    // the following variable get values form user input data 
    let duration = parseInt(document.getElementById('duration').value);
    let distance = parseInt(document.getElementById('distance').value);
    let met = parseFloat(document.getElementById('intensity').value);
    let date = document.getElementById('date').value;
    let calories = calculateCalories(userInfo.weight, met, duration);
    let swimstyle = null;
    let timePer100m = calculateTimePer100m(duration, distance);
    let formattedDuration = formatDuration(duration);

    // convert met value back to swim style string for display
    if(met == 6){
        swimstyle = 'Freestyle'
    }else if (met == 8.3) {
        swimstyle = 'Backstroke';
    } else if (met == 9.8) {
        swimstyle = 'Breaststroke';
    } else if (met == 13.8) {
        swimstyle = 'Butterfly stroke';
    } 

    // check if user entered all value
    if (duration === "" || distance === "" || met === "" || date === "") {
        alert("please enter all value");
        return;
    }
    // check if user entered positive value
    if (parseInt(duration) <= 0 || parseInt(distance) <= 0) {
        alert("Swim duration and distance should be positive value");
        return;
    }    
    // check if user entered positive value
    if (parseInt(duration) >= 800 || parseInt(distance) >= 9999) {
        alert("Please enter your regular single swim data, regular swim duration should be smaller than 800 mins, distance should be smaller than 9999m,");
        return;
    }    

    //the following code stores user's input data into JSON
    let swimEntry = {
        duration: duration,
        distance: distance,
        calories: calories,
        date: date,
        swimstyle: swimstyle,
        timePer100m: timePer100m,
        formattedDuration: formattedDuration
    };

    swimData.push(swimEntry);
    localStorage.setItem('swimData', JSON.stringify(swimData));
    // display the stored data onto swim record card
    displaySwimEntry(swimEntry, swimData.length - 1);
    // close the input box
    closeInputBox('addSwimRecord'); 
    // after user record new swim data, update the total distance
    displayTotalDistance(); 
}


function displaySwimEntry(entry, index) {
    // this function displays the swim data user entered to swim card
    let cardContainer = document.getElementById('swimCardContainer');
    let card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <div class="dataBoxOne">
            <img src="calorieIcon.png" class="dataIcon" alt="calorieIcon">
            <h1 class="cardDataOne">${entry.calories}</h1>
            <h4 class="cardUnitOne">kcal</h4>
        </div>    
        <div class="dataBoxOne">
            <img src="distanceIcon.png" class="dataIcon" alt="distanceIcon">
            <h1 class="cardDataOne">${entry.distance}</h1>
            <h4 class="cardUnitOne">m</h4>
        </div>
        <div class = "cardVerticalDivider"></div>

        <div class="dataBoxTwo">
            <div>
                <h1 class="cardDataTwo">${entry.swimstyle}</h1>
                <h4 class="cardUnitTwo">Swim style</h4>
            </div>
            <div class="dataBoxTwoInner">
                <h1 class="cardDataTwo">${entry.timePer100m}</h1>
                <h4 class="cardUnitTwo">Avg. pace</h4>
            </div>
            <div>
                <h1 class="cardDataTwo">${entry.formattedDuration}</h1>
                <h4 class="cardUnitTwo">Time</h4>
            </div>
        </div>

        <div class="dateAndDeleteBox">
            <h4>${entry.date}</h4>
            <button class="deleteButton" onclick="deleteSwim(${index})">Delete</button>
        </div>       
        
    `;
    cardContainer.appendChild(card);
}

window.onload = function() {
    //this function display all swim data onto swim card after 
    //the page finish loading, it make sure user's info still display
    //after page refresh/reopen
    for(let i = 0; i < swimData.length; i++) {
        displaySwimEntry(swimData[i], i);
    }
    //load totoal distance when page finish loading
    displayTotalDistance(); 
}

function deleteSwim(index) {
    // the fllowing code delete the swim data when the deteleButton is clicked
    swimData.splice(index, 1);
    localStorage.setItem('swimData', JSON.stringify(swimData));
    document.getElementById('swimCardContainer').innerHTML = '';
    for(let i = 0; i < swimData.length; i++) {
        displaySwimEntry(swimData[i], i);
    }
    displayTotalDistance(); 
    
}

function displayTotalDistance() {
    // the following code add all distances together and display it
    let totalDistance = 0;
    for(let i = 0; i < swimData.length; i++) {
        totalDistance += swimData[i].distance;
    }
    let card = document.getElementById('totalDistanceDisplay');
    card.innerHTML = `
        <h4>Total swim distance: </h4>
        <h1>${totalDistance} m</h1>
    `;
}

function saveWeight() {
    // the following code get user's weight input and store it locally into JSON
    let weight = parseInt(document.getElementById('weight').value);

    // check if user entered positive value
    if (parseInt(weight) <= 0) {
        alert("Your weight should be positive a value");
        return;
    }    

    userInfo.weight = weight;
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    closeInputBox('WeightInputBox')
}


function calculateCalories(weight, met, duration) {
    // the following code calculate the calories
    return parseInt((weight * met * duration * 3.5) / 200);
    
}