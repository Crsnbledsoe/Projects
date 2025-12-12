//const statForm = document.getElementById('statForm');
//const resultsContainer = document.querySelector(".results")
//const win = statForm['win'];
const fighter1select = document.getElementById("fighter1");
const fighter2select = document.getElementById("fighter2");
const win = document.getElementById("win");
//const fighter2 = statForm['fighter2'];




document.getElementById("saveBtn").addEventListener("click", myAlert);
//document.addEventListener('DOMContentLoaded', refLocStor());

function myAlert(e) {
    e.preventDefault();

    //Loads any existing matches saved in local storage or creates a new/empty array titled 'matches'
    const matches = JSON.parse(localStorage.getItem("matches")) || [];

    //add a new match
    const newMatch = {
        win: win.value,
        fighter1: fighter1select.value,
        fighter2: fighter2select.value,
    };
    
    //push newMatch to matches array
    matches.push(newMatch);
//
    displayMatches();
}

function displayMatches(match) {
    const para = document.createElement("p");
    para.textContent = `${match.win} | ${match.fighter1select} & ${match.fighter2select}`;
    document.getElementById("results").appendChild(para);
}
/*
    localStorage.setItem("matches",JSON.stringify(matches))

    localStorage.setItem("match",JSON.stringify(matchData));
    //const match = localStorage.getItem("match")
    const match = JSON.parse(localStorage.getItem("match"))
    console.log(match)
    const para = document.createElement("p");
    para.textContent = match
    document.getElementById("results").appendChild(para)
    //document.getElementById("results").textContent = match
    alert("Match Saved!");
}*/

/*function refLocStor() {
 const match = JSON.parse(localStorage.getItem("match"))
    console.log(match)
    const para = document.createElement("p");
    para.textContent = match
    document.getElementById("results").appendChild(para)}
//const matches = document.querySelectorAll("#statForm");
//console.log(matches)};*/
