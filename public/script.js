let swimData = JSON.parse(localStorage.getItem('swimData')) || [];

function showInputBox(inputId) {
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

    let swimEntry = {
        duration: duration,
        distance: distance
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
            <h4>Swim Duration</h4>
            <h1>${entry.duration} Minutes</h1>
        </div>
        <div class="dataBox">
            <h4>Swim Distance</h4>
            <h1>${entry.distance} Meter</h1>
        </div>
        <button onclick="deleteSwim(${index})">Delete</button>
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