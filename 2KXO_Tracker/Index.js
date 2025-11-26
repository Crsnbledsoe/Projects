//const statForm = document.getElementById('statForm');
//const resultsContainer = document.querySelector(".results")
//const win = statForm['win'];
const fighter1 = document.getElementById("fighter1");
//const fighter2 = statForm['fighter2'];




document.getElementById("saveBtn").addEventListener("click", myAlert);

function myAlert(e) {
    e.preventDefault();
    localStorage.setItem("pc1",fighter1.value)
    const pc1 = localStorage.getItem("pc1")
    console.log(pc1)
    document.getElementById("results").textContent = pc1
    alert("Match Saved!");
}

//const matches = document.querySelectorAll("#statForm");
//console.log(matches)
