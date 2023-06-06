let swimData = JSON.parse(localStorage.getItem('swimData')) || [];
let userInfo = JSON.parse(localStorage.getItem('userInfo')) || {
    weight: null,
};

function showInputBox(inputId) {
    // check if user has input the weight
    if(inputId == 'addSwimRecord'){
        if (userInfo.weight == null) {
            alert("Please enter your weight");
            showInputBox('WeightInputBox');
            return;
        }
    }

    let inputBox = document.getElementById(inputId);
    inputBox.style.display = 'block';
}

function closeInputBox(inputId) {
    let inputBox = document.getElementById(inputId);
    inputBox.style.display = 'none';
}

function calculateTimePer100m(duration, distance) {
    // Calculate the time in seconds for each 100 meters
    let timePer100mInSeconds = (duration * 60 / distance) * 100;

    // Convert the time to minutes and seconds
    let minutes = Math.floor(timePer100mInSeconds / 60);
    let seconds = Math.round(timePer100mInSeconds % 60);

    // Format the time as a string
    return minutes + "&apos;" + seconds + "&quot;/100m";
}

function formatDuration(durationInMinutes) {
    // change the duration to hours and minutes
    let hours = Math.floor(durationInMinutes / 60);
    let minutes = durationInMinutes % 60;
    if(hours < 10) hours = '0' + hours;
    if(minutes < 10) minutes = '0' + minutes;

    return hours + ":" + minutes;
}

function addSwim() {


    let duration = parseInt(document.getElementById('duration').value);
    let distance = parseInt(document.getElementById('distance').value);
    let met = parseFloat(document.getElementById('intensity').value);
    let date = document.getElementById('date').value;
    let calories = calculateCalories(userInfo.weight, met, duration);
    let swimstyle = null;
    let timePer100m = calculateTimePer100m(duration, distance);
    let formattedDuration = formatDuration(duration);

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
    displaySwimEntry(swimEntry, swimData.length - 1);
    closeInputBox('addSwimRecord'); 
    displayTotalDistance(); 
}


function displaySwimEntry(entry, index) {
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
    for(let i = 0; i < swimData.length; i++) {
        displaySwimEntry(swimData[i], i);
    }
    //load totoal distance when page loading
    displayTotalDistance(); 
}

function deleteSwim(index) {
    swimData.splice(index, 1);
    localStorage.setItem('swimData', JSON.stringify(swimData));
    document.getElementById('swimCardContainer').innerHTML = '';
    for(let i = 0; i < swimData.length; i++) {
        displaySwimEntry(swimData[i], i);
    }
    displayTotalDistance(); 
    
}

function displayTotalDistance() {
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
    return parseInt((weight * met * duration * 3.5) / 200);
    
}