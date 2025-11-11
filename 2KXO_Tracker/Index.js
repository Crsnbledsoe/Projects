const statForm = document.getElementById('statForm');
const resultsContainer = document.querySelector(".results")
const win = statForm['win'];
const fighter1 = statForm['fighter1'];
const fighter2 = statForm['fighter2'];

const result = [
    {
        win: "w",
        fighter1: "Ahri",
        fighter2: "Yasuo",
    },
];


const addResult = (win, fighter1, fighter2) => {};

const createResultEvent = ({win, fighter1, fighter2})=> {
    const resultDiv = document.createElement('div');
    const win = document.createElement('h2');
    const fighter1 = document.createElement('p');
    const fighter2 = document.createElement('p');


    win.innerText = "Result: " + win
    fighter1.innerText = "Result " + fighter1;
    fighter2.innerText = "Result " + fighter2;

    resultDiv.append(win, fighter1, fighter2);
    resultsContainer.appendChild(resultDiv);

}


students.forEach(createResultEvent)