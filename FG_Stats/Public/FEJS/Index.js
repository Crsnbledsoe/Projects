//new version of index with server logic


//linking images of fighters into js
const fighterImages = { 
    Ahri: "/images/Ahri_cs.png",
    Akali: "/images/Akali_cs.png",
    Blitzcrank: "/images/Blitzcrank_cs.png",
    Braum: "/images/Braum_cs.png",
    Caitlyn: "/images/Caitlyn_cs.png",
    Darius: "/images/Darius_cs.png",
    Ekko: "/images/Ekko_cs.png",
    Illaoi: "/images/Illaoi_cs.png",
    Jinx: "/images/Jinx_cs.png",
    Senna: "/images/Senna_cs.webp",
    Teemo: "/images/Teemo_cs.png",
    Thresh:" /images/Thresh_cs.webp",
    Vi:" /images/Vi_cs.png",
    Warwick: "/images/Warwick_cs.png",
    Yasuo: "/images/Yasuo_cs.png"
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
document.addEventListener("DOMContentLoaded", initPage);

//function that calls any functions that need to run when the page is loaded/reloaded
async function initPage(){
    const fightersLostTo = await oppFighterData();
    await pageReloaded(fightersLostTo);
}
async function pageReloaded(fightersLostTo) {
    const response = await fetch(`match-Display`, {
        method: "GET"
    })
        const data = await response.json();
        await displayMatches(data,fightersLostTo);

}

function displayMatches(data, fightersLostTo) {
    document.getElementById("results").textContent = "";
    for (const match of data) {
        const para = document.createElement("p");
        para.textContent = `${match.result} | ${match.fighter1} & ${match.fighter2} VS ${match.oppfighter1}, ${match.oppfighter2}`;
        para.id = String(match.id);

        const fighter1Image = document.createElement("img")
        fighter1Image.src = fighterImages[match.fighter1];
        fighter1Image.alt = match.fighter1;
        fighter1Image.style.width = "100px";

        const fighter2Image = document.createElement("img");
        fighter2Image.src = fighterImages[match.fighter2];
        fighter2Image.alt = match.fighter2;
        fighter2Image.style.width = "100px";

        const oppfighter1Image = document.createElement("img");
        oppfighter1Image.src = fighterImages[match.oppfighter1];
        oppfighter1Image.alt = match.oppfighter1;
        oppfighter1Image.style.width = "100px"

        const oppfighter2Image = document.createElement("img");
        oppfighter2Image.src = fighterImages[match.oppfighter2];
        oppfighter2Image.alt = match.oppfighter2;
        oppfighter2Image.style.width = "100px"

        para.appendChild(fighter1Image);
        para.appendChild(document.createTextNode(`&`));
        para.appendChild(fighter2Image);
        para.appendChild(document.createTextNode("vs"))
        para.appendChild(oppfighter1Image);
        para.appendChild(document.createTextNode("&"));
        para.appendChild(oppfighter2Image);
        document.getElementById("results").appendChild(para);
        console.log(match);

    }
        const comboCounts = dataForCharts(data);
        wLChart(data);
        myFightersChart(comboCounts);
        console.log(comboCounts);
        oppFightersChart(fightersLostTo);

    }

async function oppFighterData(){
    const response = await fetch(`oppFighterData`, {
method: "GET"
})
    const data = await response.json();
    console.log('Value of data:', data);
    console.log('Type of data:', typeof data);
    const fightersLostTo = {}
        for (const match of data) {
            oppFighterCombo = [match.oppfighter1, match.oppfighter2].sort().join('&')
                if (oppFighterCombo in fightersLostTo)
                    fightersLostTo[oppFighterCombo] += 1 
                else 
                    fightersLostTo[oppFighterCombo] = 1;
        }
    console.log(fightersLostTo);
    console.log('Type of fightersLostTo:', typeof fightersLostTo);

    return fightersLostTo;
   
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
    //Loads any existing matches saved in storage or creates a new/empty array titled 'matches'
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

function wLChart(data) {
    console.log("rendering carts");
    const Wins = data.filter(match => match.result === 'Won').length
    const Losses = data.filter(match => match.result === 'Lost').length

    new Chart(document.getElementById("myChart"), {
    type: 'pie',
    data: {
        labels: [
            "Wins","Losses"
        ],
        datasets: [{
            data: [Wins,Losses]
        }]
},
    options: {
        maintainAspectRatio: false
            }
        }
    );
    document.getElementById("w/l").textContent = `Wins/Losses   ${Wins}/${Losses}`;

}


function myFightersChart(comboCounts){
    const comboCountsKeys = Object.keys(comboCounts);
    const comboCountsValues = Object.values(comboCounts);
    console.log(comboCountsKeys);
    console.log(comboCountsValues);
            
new Chart(document.getElementById("comboChart"), {
    type: 'bar',
    data: {
        labels:  
           comboCountsKeys
        ,
        datasets: [{
            data: comboCountsValues
        }]
},
    options:{
        plugins:{
            legend:{
                display: false
            }
        }
    }

}
);
}

function oppFightersChart(fightersLostTo){ 
if(fightersLostTo)
    {const fightersLostToKeys = Object.keys(fightersLostTo);
    const fightersLostToValues = Object.values(fightersLostTo);
    
new Chart(document.getElementById("lostToChart"), {
    type: 'bar',
    data: {
        labels: 
        fightersLostToKeys

            ,
        datasets:[{
            data: fightersLostToValues,
        }]
    }
}
)
    }
};


function dataForCharts(data) {
    console.log('Value of data:', data);
    console.log('Type of data:', typeof data);
    const comboCounts = {};
    for (const match of data) {
        const fighterCombo = [match.fighter1, match.fighter2].sort().join(' & ')
        
            if (fighterCombo in comboCounts) 
                comboCounts[fighterCombo] += 1
            else
                comboCounts[fighterCombo] = 1
            }
        console.log(comboCounts)
        console.log('Type of comboCounts:', typeof comboCounts);

        return comboCounts;


        };
