//new version of index with server logic
//linking images of fighters into js
const fighterImages = { 
    Ahri: "../images/Ahri_cs.png",
    Akali: "../images/Akali_cs.png",
    Blitzcrank: "../images/Blitzcrank_cs.avif",
    Braum: "../images/Braum_cs.png",
    Caitlyn: "../images/Caitlyn_cs.png",
    Darius: "../images/Darius_cs.png",
    Ekko: "../images/Ekko_cs.png",
    Illaoi: "../images/Illaoi_cs.png",
    Jinx: "../images/Jinx_cs.png",
    Teemo: "../images/Teemo_cs.png",
    Vi: "../images/Vi_cs.png",
    Warwick: "../images/Warwick_cs.png",
    Yasuo: "../images/Yasuo_cs.png"
}



//pull fighters and win/lose options selected by user from HTML for use/manipulation/storage in JS
const fighter1select = document.getElementById("fighter1");
const fighter2select = document.getElementById("fighter2");
const oppfighter1select = document.getElementById("oppfighter1");
const oppfighter2select = document.getElementById("oppfighter2");
const win = document.getElementById("win");


//adds listener to the HTMl element with saveBtn as ID and then runs the JS function myAlert when clicked
document.getElementById("saveBtn").addEventListener("click", myAlert);



//adds listener to run loadMatches func when page is loaded/reloaded
document.addEventListener("DOMContentLoaded", pageReloaded);

async function pageReloaded() {
    const response = await fetch(`match-Display`, {
        method: "GET"
    })
        const data = await response.json();
        displayMatches(data);
}

async function displayMatches(data) {
    for (const match of data) {
        const para = document.createElement("p");
        para.id = String(match.id);
        document.getElementById("results").appendChild = data;
    }

    }



/*adds listener for a click on the results box and then runs deleteMatch func
document.getElementById("results").addEventListener("click", deleteMatch);*/

 async function createNewMatch (){
    const match = {
        result: result.value,
        fighter1: fighter1select.value,
        fighter2: fighter2select.value,
        oppfighter1: oppfighter1select.value,
        oppfighter2: oppfighter2select.value,
    }; 
    const response = await fetch(`/submit-match`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(match),
    })
    alert("Match Saved!");
}
    ;



//loads previously saved matches, creates new match, pushes new match to the matches array, and then runs displayMatches to updated stats on screen 
async function  myAlert(e) {
    e.preventDefault();
    //Loads any existing matches saved in local storage or creates a new/empty array titled 'matches'
    if (result.value == 'Blank') {
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
    await createNewMatch ();
}
}


