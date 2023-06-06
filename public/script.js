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


function addSwim() {


    let duration = parseInt(document.getElementById('duration').value);
    let distance = parseInt(document.getElementById('distance').value);
    let met = parseFloat(document.getElementById('intensity').value);
    let date = document.getElementById('date').value;
    let calories = calculateCalories(userInfo.weight, met, duration);

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

    let swimEntry = {
        duration: duration,
        distance: distance,
        calories: calories,
        date: date,
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
        <div class="dataBox">
            <h4>Duration</h4>
            <h1>${entry.duration}</h1>
            <h4>Minutes</h4>
        </div>
        <div class="dataBox">
            <h4>Distance</h4>
            <h1>${entry.distance}</h1>
            <h4>Meters</h4>
        </div>
        <div class="dataBox">
            <h4>Calories</h4>
            <h1>${entry.calories}</h1>
            <h4>Kcal</h4>
        </div>       
        <div>
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
        <h1>${totalDistance} Meters</h1>
        <h4>Total Distance</h4>
        
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