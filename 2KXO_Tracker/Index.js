//const statForm = document.getElementById('statForm');
//const resultsContainer = document.querySelector(".results")
//const win = statForm['win'];
const fighter1select = document.getElementById("fighter1");
const fighter2select = document.getElementById("fighter2");
const win = document.getElementById("win");
//const fighter2 = statForm['fighter2'];




document.getElementById("saveBtn").addEventListener("click", myAlert);
document.addEventListener("DOMContentLoaded", loadMatches);
document.getElementById("results").addEventListener("click", deleteMatch);

function loadMatches() {
    const matches = JSON.parse(localStorage.getItem("matches")) || [];
    matches.forEach(displayMatches);

}
//document.addEventListener('DOMContentLoaded', refLocStor());

function myAlert(e) {
    e.preventDefault();

    //Loads any existing matches saved in local storage or creates a new/empty array titled 'matches'
    const matches = JSON.parse(localStorage.getItem("matches")) || [];

    //add a new match
    const match = {
        win: win.value,
        fighter1: fighter1select.value,
        fighter2: fighter2select.value,
        id: Date.now(),
    };
        
    //push newMatch to matches array
    matches.push(match);


    displayMatches(match);
}

function displayMatches(match) {
    const para = document.createElement("p");
    para.id = match.id
    para.textContent = `${match.win} | ${match.fighter1} & ${match.fighter2}`;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = ("Delete Match")
    deleteBtn.dataset.id = match.id
    para.appendChild(deleteBtn);
    document.getElementById("results").appendChild(para);
};

function deleteMatch() {
    para.remove();
    
}







/*matches.forEach(displayMatches) 
{
    const p = document.createElement("p");
    const results = document.getElementById("results");
    p.textContent= matches;
    results.appendChild(p);
} ;

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
