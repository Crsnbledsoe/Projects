
document.getElementById('fetchBtn').addEventListener('click', fetchPlaytime);
document.getElementById('downloadBtn').addEventListener('click', downloadMarkdown);
document.getElementById('mdFiles').addEventListener('change', handleFileSelect);
document.getElementById('updateBtn').addEventListener('click', updateObsidianFiles);

let gamesData = [];
let selectedFiles = [];

async function fetchPlaytime() {
    const apiKey = document.getElementById('apiKey').value.trim();
    const steamId = document.getElementById('steamId').value.trim();
    
    if (!apiKey || !steamId) {
        alert('Please enter both API Key and Steam ID');
        return;
    }
    
    const steamUrl = `https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=${apiKey}&steamid=${steamId}&format=json`;
    const corsProxy = 'https://api.allorigins.win/get?url=';
    const url = corsProxy + encodeURIComponent(steamUrl);
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        const parsedData = JSON.parse(data.contents);
        gamesData = parsedData.response.games || [];
        displayResults(gamesData);
        document.getElementById('downloadBtn').style.display = 'block';
    } catch (error) {
        alert('Error fetching data: ' + error.message);
        console.error(error);
    }
}

function displayResults(games) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';
    
    if (games.length === 0) {
        resultsDiv.innerHTML = '<p>No recent playtime found.</p>';
        return;
    }
    
    games.forEach(game => {
        const gameDiv = document.createElement('div');
        gameDiv.className = 'game';
        gameDiv.innerHTML = `
            <h3>${game.name}</h3>
            <p>Playtime: ${Math.round(game.playtime_forever / 60)} hours</p>
            <p>Playtime (2 weeks): ${Math.round(game.playtime_2weeks / 60)} hours</p>
        `;
        resultsDiv.appendChild(gameDiv);
    });
}

function downloadMarkdown() {
    if (gamesData.length === 0) {
        alert('No data to download');
        return;
    }
    
    let markdown = '# Recent Steam Playtime\n\n';
    gamesData.forEach(game => {
        markdown += `- **${game.name}**: ${Math.round(game.playtime_forever / 60)} hours total, ${Math.round(game.playtime_2weeks / 60)} hours in last 2 weeks\n`;
    });
    
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'steam-playtime.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function handleFileSelect(event) {
    selectedFiles = Array.from(event.target.files);
    if (selectedFiles.length > 0) {
        document.getElementById('updateBtn').style.display = 'block';
    }
}

function updateObsidianFiles() {
    if (gamesData.length === 0) {
        alert('Please fetch Steam playtime first');
        return;
    }
    
    if (selectedFiles.length === 0) {
        alert('Please select markdown files to update');
        return;
    }
    
    let updated = 0;
    selectedFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
            let content = e.target.result;
            const gameName = extractGameName(file.name);
            const game = gamesData.find(g => g.name.toLowerCase() === gameName.toLowerCase());
            
            if (game) {
                const playtime = Math.round(game.playtime_forever / 60);
                const playtime2weeks = Math.round(game.playtime_2weeks / 60);
                const timestamp = new Date().toISOString().split('T')[0];
                
                content = updatePlaytimeInContent(content, playtime, playtime2weeks, timestamp);
                downloadFile(file.name, content);
                updated++;
            }
        };
        reader.readAsText(file);
    });
    
    setTimeout(() => {
        alert(`Updated ${updated} of ${selectedFiles.length} files`);
    }, 500);
}

function extractGameName(filename) {
    return filename.replace('.md', '').replace(/-/g, ' ');
}

function updatePlaytimeInContent(content, playtime, playtime2weeks, timestamp) {
    const playtimePattern = /playtime:\s*\d+/i;
    const playtime2weeksPattern = /playtime-2weeks:\s*\d+/i;
    const lastUpdatedPattern = /last-updated:\s*\d{4}-\d{2}-\d{2}/i;
    
    if (playtimePattern.test(content)) {
        content = content.replace(playtimePattern, `playtime: ${playtime}`);
    } else {
        content = addPropertyToFrontmatter(content, `playtime: ${playtime}`);
    }
    
    if (playtime2weeksPattern.test(content)) {
        content = content.replace(playtime2weeksPattern, `playtime-2weeks: ${playtime2weeks}`);
    } else {
        content = addPropertyToFrontmatter(content, `playtime-2weeks: ${playtime2weeks}`);
    }
    
    if (lastUpdatedPattern.test(content)) {
        content = content.replace(lastUpdatedPattern, `last-updated: ${timestamp}`);
    } else {
        content = addPropertyToFrontmatter(content, `last-updated: ${timestamp}`);
    }
    
    return content;
}

function addPropertyToFrontmatter(content, property) {
    const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
    const match = content.match(frontmatterRegex);
    
    if (match) {
        const frontmatter = match[1];
        const newFrontmatter = frontmatter + '\n' + property;
        return content.replace(frontmatterRegex, `---\n${newFrontmatter}\n---`);
    } else {
        return `---\n${property}\n---\n\n${content}`;
    }
}

function downloadFile(filename, content) {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}