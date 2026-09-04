//gets matches
document.getElementById("getMatches").addEventListener("click", getMatches);

document.getElementById("addChars").addEventListener("click", addChars);

document.getElementById("addRanks").addEventListener("click", addRanks);

document.getElementById("addVersions").addEventListener("click", addVersions);

document.getElementById("addSeason").addEventListener("click", addVersions);




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
            "Content-Type": "application/json"
        }
    })
};

async function addVersions(){
    const response = await fetch(`/api/t8/game-version-seed`, {
        method: `POST`,
        headers:{
            "Content-Type": "application/json"
        }
    })
};

async function addSeasons(){
    const response = await fetch(`/api/t8/add-seasons`, {
        method: `POST`,
        headers: {
            "Content-Type": "application/json"
        }
    })
};