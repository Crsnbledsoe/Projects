//linking images of fighters into js
const fighterImages = {
    Ahri: "images/Ahri_cs.png",
    Akali: "images/Akali_cs.png",
    Blitzcrank: "images/Blitzcrank_cs.avif",
    Braum: "images/Braum_cs.png",
    Caitlyn: "images/Caitlyn_cs.png",
    Darius: "images/Darius_cs.png",
    Ekko: "images/Ekko_cs.png",
    Illaoi: "images/Illaoi_cs.png",
    Jinx: "images/Jinx_cs.png",
    Teemo: "images/Teemo_cs.png",
    Vi: "images/Vi_cs.png",
    Warwick: "images/Warwick_cs.png",
    Yasuo: "images/Yasuo_cs.png"
}



//pull fighters and win/lose options selected by user from HTML for use/manipulation/storage in JS
const fighter1select = document.getElementById("fighter1");
const fighter2select = document.getElementById("fighter2");
const oppfighter1select = document.getElementById("oppfighter1");
const oppfighter2select = document.getElementById("oppfighter2");
const win = document.getElementById("win");
console.log(win.value);


//adds listener to the HTMl element with saveBtn as ID and then runs the JS function myAlert when clicked
document.getElementById("saveBtn").addEventListener("click", myAlert);



//adds listener to run loadMatches func when page is loaded/reloaded
document.addEventListener("DOMContentLoaded", initPage);



//adds listener for a click on the results box and then runs deleteMatch func
document.getElementById("results").addEventListener("click", deleteMatch);



//parses local storage for an it called "matches" and sets that equal to the JS variable matches
function loadMatches() {
    const matches = getMatches();
    document.getElementById("results").innerHTML = '';
    matches.forEach(displayMatches);
}

function initPage() {
    loadMatches();
    updateStats();
}

function getMatches() {
    return JSON.parse(localStorage.getItem("matches")) || [];
}


//loads previously saved matches, creates new match, pushes new match to the matches array, and then runs displayMatches to updated stats on screen 
function myAlert(e) {
    e.preventDefault();
    //Loads any existing matches saved in local storage or creates a new/empty array titled 'matches'
    const matches = getMatches();
    if (win.value == 'Blank') {
        alert("Please select an option before continuing.");
    }

    else if (fighter1select.value == 'Blank') {
        alert("Please select fighters.");
    }

    else if (fighter2select.value == 'Blank') {
        alert("Please select fighters.");
    }
    //add a new match
    else {
    const match = {
        win: win.value,
        fighter1: fighter1select.value,
        fighter2: fighter2select.value,
        oppfighter1: oppfighter1select.value,
        oppfighter2: oppfighter2select.value,
        id: String(Date.now()),
    }; 
    //push the new match to matches array
    matches.push(match);
    //runs the display matches function to add the new match to the screen
    displayMatches(match);
    
    localStorage.setItem("matches", JSON.stringify(matches));
    updateStats();
    alert("Match Saved!");
}
}
function displayMatches(match) {
    const para = document.createElement("p");
    para.id = String(match.id);

    //create image for fighter1
    const fighter1Image = document.createElement("img");
    fighter1Image.src = fighterImages[match.fighter1]; // Set the source of the image to the path of the Ahri image
    fighter1Image.alt = match.fighter1; // Set alt text for accessibility
    fighter1Image.style.width = "100px"; // Set the width of the image

    //create image for fighter2
    const fighter2Image = document.createElement("img");
    fighter2Image.src = fighterImages[match.fighter2]; // Set the source of the image to the path of the Ahri image
    fighter2Image.alt = match.fighter2; // Set alt text for accessibility
    fighter2Image.style.width = "100px"; // Set the width of the image

     //create image for fighter1
    const oppfighter1Image = document.createElement("img");
    oppfighter1Image.src = fighterImages[match.oppfighter1]; // Set the source of the image to the path of the Ahri image
    oppfighter1Image.alt = match.oppfighter1; // Set alt text for accessibility
    oppfighter1Image.style.width = "100px"; // Set the width of the image

    //create image for fighter2
    const oppfighter2Image = document.createElement("img");
    oppfighter2Image.src = fighterImages[match.oppfighter2]; // Set the source of the image to the path of the Ahri image
    oppfighter2Image.alt = match.oppfighter2; // Set alt text for accessibility
    oppfighter2Image.style.width = "100px"; // Set the width of the image

    para.textContent = `${match.win} | ${match.fighter1} & ${match.fighter2}`; 
    para.appendChild(fighter1Image);
    para.appendChild(document.createTextNode(` & `));
    para.appendChild(fighter2Image);
    para.appendChild(document.createTextNode(` vs. `));
    para.appendChild(oppfighter1Image);
    para.appendChild(document.createTextNode(` & `));
    para.appendChild(oppfighter2Image);
    para.appendChild(document.createTextNode(` ${match.oppfighter1} & ${match.oppfighter2}  `));

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = ("Delete Match")
    deleteBtn.classList.add("delBtn")
    deleteBtn.dataset.id = String(match.id);
    para.appendChild(deleteBtn);
    document.getElementById("results").appendChild(para);
};

function deleteMatch(e) {
    if (e.target.closest(".delBtn")) {
        const para = e.target.closest("p");
            if (para) // Prevent deleting when clicking on the paragraph itself
            {
            para.remove();
            const id = para.id;
            let matches = JSON.parse(localStorage.getItem("matches")) || [];
            console.log("Before delete:", matches, "Deleting id:", id);
            matches = matches.filter(match => match.id !== id);
            console.log("After delete:", matches);
            localStorage.setItem("matches", JSON.stringify(matches));
            updateStats();
            alert("Match Deleted!");
            }
        
}
}
//everything below added by copilot for charts and stats
let resultsChart;
let comboChart;
let lostToChart;

function getTopCombos(matches, firstKey, secondKey, filterWin) {
    const counts = {};
    matches.forEach(match => {
        if (filterWin && match.win !== filterWin) return;
        const combo = `${match[firstKey]} & ${match[secondKey]}`;
        counts[combo] = (counts[combo] || 0) + 1;
    });
    return Object.entries(counts)
        .sort((a, b) => b[1] - a[1]);
}

function createOrUpdateChart(chart, elementId, type, labels, data, options, datasetLabel, backgroundColor) {
    const ctx = document.getElementById(elementId).getContext('2d');
    if (chart) {
        chart.data.labels = labels;
        chart.data.datasets[0].data = data;
        chart.data.datasets[0].label = datasetLabel;
        chart.data.datasets[0].backgroundColor = backgroundColor;
        chart.options = options;
        chart.update();
        return chart;
    }
    return new Chart(ctx, {
        type,
        data: {
            labels,
            datasets: [{
                label: datasetLabel,
                data,
                backgroundColor,
                borderColor: '#111',
                borderWidth: 1
            }]
        },
        options
    });
}

function updateStats() {
    const matches = getMatches();
    const wins = matches.filter(m => m.win === 'Won').length;
    const losses = matches.filter(m => m.win === 'Lost').length;
    document.getElementById("w/l").textContent = `W/L: ${wins}/${losses}`;

    resultsChart = createOrUpdateChart(
        resultsChart,
        'myChart',
        'pie',
        ['Wins', 'Losses'],
        [wins, losses],
        { responsive: true },
        'Match Results',
        ['rgb(204, 245, 100)', 'red']
    );

    const topPlayerCombos = getTopCombos(matches, 'fighter1', 'fighter2');
    const playerLabels = topPlayerCombos.slice(0, 5).map(([combo]) => combo);
    const playerData = topPlayerCombos.slice(0, 5).map(([, count]) => count);
    const topPlayerComboText = topPlayerCombos.length > 0
        ? `${topPlayerCombos[0][0]} (${topPlayerCombos[0][1]} matches)`
        : 'No combo data yet';
    const comboLabelElem = document.getElementById('comboLabel');
    if (comboLabelElem) comboLabelElem.textContent = topPlayerComboText;
    comboChart = createOrUpdateChart(
        comboChart,
        'comboChart',
        'bar',
        playerLabels.length ? playerLabels : ['No data'],
        playerData.length ? playerData : [1],
        {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { precision: 0 }
                }
            }
        },
        'Most Used Combos',
        ['#4e79a7', '#f28e2b', '#e15759', '#76b7b2', '#59a14f']
    );

    const topLosingCombos = getTopCombos(matches, 'oppfighter1', 'oppfighter2', 'Lost');
    const losingLabels = topLosingCombos.slice(0, 5).map(([combo]) => combo);
    const losingData = topLosingCombos.slice(0, 5).map(([, count]) => count);
    const topLosingComboText = topLosingCombos.length > 0
        ? `${topLosingCombos[0][0]} (${topLosingCombos[0][1]} losses)`
        : 'No losing combo data yet';
    const lostToLabelElem = document.getElementById('lostToLabel');
    if (lostToLabelElem) lostToLabelElem.textContent = topLosingComboText;
    lostToChart = createOrUpdateChart(
        lostToChart,
        'lostToChart',
        'bar',
        losingLabels.length ? losingLabels : ['No data'],
        losingData.length ? losingData : [1],
        {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { precision: 0 }
                }
            }
        },
        'Lost To Most',
        ['#e15759', '#ff9da7', '#aec7e8', '#ffbb78', '#98df8a', '#c5b0d5', '#c49c94', '#f7b6d2', '#dbdb8d', '#9edae5']
    );
}
