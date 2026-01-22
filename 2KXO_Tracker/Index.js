
//pull fighters and win/lose options selected by user from HTML for use/manipulation/storage in JS
const fighter1select = document.getElementById("fighter1");
const fighter2select = document.getElementById("fighter2");
const win = document.getElementById("win");

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
    //add a new match
    const match = {
        win: win.value,
        fighter1: fighter1select.value,
        fighter2: fighter2select.value,
        id: String(Date.now()),
    }; 
    //push the new match to matches array
    matches.push(match);
    //runs the display matches function to add the new match to the screen
    displayMatches(match);
    
    localStorage.setItem("matches", JSON.stringify(matches));
}

function displayMatches(match) {
    const para = document.createElement("p");
    para.id = String(match.id)
    para.textContent = `${match.win} | ${match.fighter1} & ${match.fighter2}`;

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
            }
        
}
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
