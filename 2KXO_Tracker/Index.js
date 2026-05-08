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
const matches = JSON.parse(localStorage.getItem("matches")) || [];
console.log(win.value);


//adds listener to the HTMl element with saveBtn as ID and then runs the JS function myAlert when clicked
document.getElementById("saveBtn").addEventListener("click", myAlert);



//adds listener to run loadMatches func when page is loaded/reloaded
document.addEventListener("DOMContentLoaded", loadMatches);



//adds listener for a click on the results box and then runs deleteMatch func
document.getElementById("results").addEventListener("click", deleteMatch);



//parses local storage for an it called "matches" and sets that equal to the JS variable matches
function loadMatches() {
    const matches = JSON.parse(localStorage.getItem("matches")) || [];
    matches.forEach(displayMatches);
}


//loads previously saved matches, creates new match, pushes new match to the matches array, and then runs displayMatches to updated stats on screen 
function myAlert(e) {
    e.preventDefault();
    //Loads any existing matches saved in local storage or creates a new/empty array titled 'matches'
    const matches = JSON.parse(localStorage.getItem("matches")) || [];
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
            alert("Match Deleted!");
            }
        
}
}
const wins = matches.filter(m => m.win === "Won").length;
const losses = matches.filter(m => m.win === "Lost").length;


console.log(wins);
console.log(losses);
document.getElementById("w/l").textContent = `W/L: ${wins}/${losses}`;

const ctx = document.getElementById('myChart').getContext('2d');

const resultsChart = new Chart(ctx, {
    type: 'pie',
    data: {
        labels: ['Wins', 'Losses'],
      datasets: [{
        data: [wins, losses],
        backgroundColor: ['rgb(204, 245, 100)', 'red'],
    }]
    },
    options: {
      responsive: true,
      }
    }
  );
