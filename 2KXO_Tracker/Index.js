//const statForm = document.getElementById('statForm');
//const resultsContainer = document.querySelector(".results")
//const win = statForm['win'];
const fighter1select = document.getElementById("fighter1");
const fighter2select = document.getElementById("fighter2");
const win = document.getElementById("win");
//const fighter2 = statForm['fighter2'];




document.getElementById("saveBtn").addEventListener("click", myAlert);

function myAlert(e) {
    e.preventDefault();
    const matchData = [
        win.value,fighter1select.value,fighter2select.value
    ];
    localStorage.setItem("match",JSON.stringify(matchData));
    //const match = localStorage.getItem("match")
    const match = JSON.parse(localStorage.getItem("match"))
    console.log(match)
    const para = document.createElement("p");
    para.textContent = match
    document.getElementById("results").appendChild(para)
    //document.getElementById("results").textContent = match
    alert("Match Saved!");
}

//const matches = document.querySelectorAll("#statForm");
//console.log(matches)
