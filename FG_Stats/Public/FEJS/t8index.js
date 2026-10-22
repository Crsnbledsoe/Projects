//gets matches
document.getElementById("getMatches").addEventListener("click", getMatches);

document.getElementById("addChars").addEventListener("click", addChars);

document.getElementById("addRanks").addEventListener("click", addRanks);

document.getElementById("addVersions").addEventListener("click", addVersions);

document.getElementById("addt8Seasons").addEventListener("click", addt8Seasons);

document.getElementById("addRankSeasons").addEventListener("click", addRankSeasons);

document.getElementById("addt8Archetypes").addEventListener("click", addt8Archetypes);

document.getElementById("addt8characters").addEventListener("click", addt8characters);



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
    const response = await fetch('/api/t8/addcharacters', {
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

async function addt8Seasons(){
    const response = await fetch(`api/t8/add-rank-seasons`, {
        method: `POST`,
        headers: {
            "Content-Type": "application/json"
        }
    })
}



async function addRankSeasons(){
    const response = await fetch(`api/t8/add-rank-seasons`, {
        method: `POST`,
        headers: {
            "Content-Type": "application/json"
        }
    })
};

async function addt8Archetypes(){
    const response = await fetch(`api/t8/add-t8archetypes`, {
        method: `POST`,
        headers: {
            "Content-Type": "application/json"
        }
    })
};


async function addt8characters() {
    const response = await fetch(`api/t8/add-t8characters`, {
        method: `POST`,
        headers: {
            "Content-Type": "application/json"
        }
    })
}