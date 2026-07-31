//gets matches
document.getElementById("getMatches").addEventListener("click", getMatches);

async function getMatches(){
const response = await fetch('/api/t8/fetch', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    })
};