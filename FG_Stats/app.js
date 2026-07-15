const express = require('express');
const fs = require('fs');
const app = express();
const morgan = require('morgan');
const Database = require('better-sqlite3');

app.use(express.urlencoded({
   extended: true,
   limit: '10mb'})
);
app.use(express.json())

const db = new Database('stats.db')




db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

//create table if it doesn't exist
db.exec(`CREATE TABLE IF NOT EXISTS matches (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   fighter1 TEXT NOT NULL,
   fighter2 TEXT NOT NULL,
   oppfighter1 TEXT NOT NULL,
   oppfighter2 TEXT NOT NULL,
   result TEXT NOT NULL,
   event_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

//db.exec(`ALTER TABLE matches
//ADD COLUMN uniqueId number`);

//get static files
app.use(express.static('Public'));

//listen for requests
app.listen(3000, '0.0.0.0');

app.use(morgan('dev'));

app.use((req, res, next) => {
    console.log('Request received');
    console.log(('host: ' , req.hostname));
    console.group('path: ', req.path);
    console.log('method: ', req.method);
    next();
});
app.get('/', (req, res) => {
   res.sendFile('./HTML/2XKOT.html', {root: __dirname})
});

app.get('/Smash.html', (req, res) => {
   res.sendFile('./HTML/Smash.html', {root: __dirname})
});


//creating endpoint to receive data from the form
   //listening for post requests to /submit-match from index.js
app.post('/submit-match', ( req, res) => {
      const { fighter1, fighter2, oppfighter1, oppfighter2, result } = req.body;
      console.log(req.body);
//try/catch
      try {
      const stmt = db.prepare('INSERT INTO matches (fighter1, fighter2, oppfighter1, oppfighter2, result) VALUES (?, ?, ?, ?, ?)');
      stmt.run(fighter1, fighter2, oppfighter1, oppfighter2, result);
      res.send('Match data received and stored successfully');
} catch (err) {
      console.error('Error inserting match data: ', err);
      res.status(500).send('An error occurred while storing match data');
      return;
   }
})

app.get(`/match-Display`, (req, res) => {
   try {
  const matchPrep = db.prepare (`SELECT * FROM matches`);
  const displayMatch = matchPrep.all();
  res.json(displayMatch);
   } catch (err) {
      console.error(`Error retrieving/displaying match data`, err);
      res.status(500).send(`An error occurred while retrieving/storing match data`);
      return;
   }
})

//filtering request for oppoenet fighter data
app.get(`/oppFighterData`, (req, res) => {
   try {
      const oppFighterPrep = db.prepare (`SELECT id, oppfighter1, oppfighter2, result 
         FROM matches
         WHERE result = 'Lost'`);
      const oppFighterData = oppFighterPrep.all();
      res.json(oppFighterData)
      } catch (err) {
         console.error(`Error retrieving/displaying opponent Fighter Data`, err);
         res.status(500).send(``)
         return;
      }
})


//404
app.use((req, res) => {
    res.status(404).sendFile('./HTML/404.html', {root: __dirname})
})
//app.get('/2XKOT', (req, res) => {
   // res.send('<p>Home Page</p>') 
//});
//fs.writeFile('./test1.txt', 'hello world', (err) => {

   // if (err) {
  //      console.error(err);
        return;
   // }
//
 //   console.log('File written successfully');
//});

