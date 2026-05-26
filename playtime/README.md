# Steam Playtime Tracker

A simple web application to fetch your recent Steam game playtime and save it as a Markdown file.

## How to Use

1. Get your Steam API Key from [Steam API](https://steamcommunity.com/dev/apikey)
2. Find your Steam ID (64-bit) from [SteamID Finder](https://steamidfinder.com/)
3. Open `index.html` in your web browser
4. Enter your API Key and Steam ID
5. Click "Fetch Playtime" to load your recent games
6. Click "Download as Markdown" to save the data as a .md file

## Features

- Fetches recently played games from Steam
- Displays total playtime and playtime in the last 2 weeks
- Generates a downloadable Markdown file with the playtime data

## Note

This app runs entirely in the browser. Due to CORS restrictions, you may need to run it from a local server if testing locally. You can use Python's built-in server: `python -m http.server` in the project directory.