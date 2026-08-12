//gets matches
document.getElementById("getMatches").addEventListener("click", getMatches);

document.getElementById("addChars").addEventListener("click", addChars);

document.getElementById("addRanks").addEventListener("click", addRanks);



async function getMatches(){
const response = await fetch('/api/t8/fetch', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    })
};

// 5JB7NdRfYTBr is polaris id for infitity rank player
async function addChars() {
    const response = await fetch('/api/t8/seed', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        }
    })
}

async function addRanks() {
    const response = await fetch('/api/t8/rank-seed', {
        method: 'POST',
        headers: {
            "Content-Typer": "application/json"
        }
    })
};