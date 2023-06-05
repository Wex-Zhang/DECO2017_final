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
}


function displaySwimEntry(entry, index) {
    let cardContainer = document.getElementById('swimCardContainer');
    let card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <nobr><h1>${entry.duration}</h1></nobr> 
        <h4> Min</h4>
        <h4>Swim Duration</h4>
        <h4>${entry.distance} Me</h4>
        <h4>Swim Distance</h4>
    `;
    cardContainer.appendChild(card);
}

window.onload = function() {
    for(let i = 0; i < swimData.length; i++) {
        displaySwimEntry(swimData[i], i);
    }
}