const statForm = document.getElementById('statForm');
const resultsContainer = document.querySelector(".results")
const win = statForm['win'];
const fighter1 = statForm['fighter1'];
const fighter2 = statForm['fighter2'];



document.getElementById("saveBtn").addEventListener("click", myAlert);

function myAlert() {
    alert("Match Saved!");
}

const matches = document.querySelectorAll("#statForm");
console.log(matches)
