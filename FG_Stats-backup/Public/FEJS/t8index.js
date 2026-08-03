//gets matches
document.getElementById("getMatches").addEventListener("click", getMatches);

document.getElementById("addchars").addEventListener("click", addChars);


async function getMatches(){
const response = await fetch('/api/t8/fetch', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    })
};


async function addChars() {
    const response = await fetch('/api/t8/seed', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        }
    })
}