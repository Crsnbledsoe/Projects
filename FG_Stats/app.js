const express = require('express');
const fs = require('fs');
const app = express();
const morgan = require('morgan');

app.use(express.urlencoded({
   extended: true,
   limit: '10mb'})
);
app.use(express.json())


const db = require('./db/connection')
console.log(db);

require('./db/2xko-schema');
require('./db/t8-schema');



db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

//create table if it doesn't exist

/*db.exec(`CREATE TABLE IF NOT EXISTS matches (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   fighter1 TEXT NOT NULL,
   fighter2 TEXT NOT NULL,
   oppfighter1 TEXT NOT NULL,
   oppfighter2 TEXT NOT NULL,
   result TEXT NOT NULL,
   event_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
)`);*/


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
  const matchPrep = db.prepare (`SELECT * FROM matches
   LIMIT 10`);
  const displayMatch = matchPrep.all();
  res.json(displayMatch);
   } catch (err) {
      console.error(`Error retrieving/displaying match data`, err);
      res.status(500).send(`An error occurred while retrieving/storing match data`);
      return;
   }
})

app.get(`/dataForCharts` , (req, res) => {
   try{
      const DataForChartsPrep = db.prepare (`SELECT * FROM matches`);
      const myDataForCharts = DataForChartsPrep.all();
      res.json(myDataForCharts);
   } catch (err) {
      console.error(`Error retrieving data required for charts`, err);
      res.status(500).send(`An error occured while retrieving data for charts`);
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

//route for handling deletion of single match
app.delete('/match-Delete/:id', (req, res) =>{
   console.log(`request recievedadsf`)
   try {
      console.log(`delete request recieved`)
      const id = Number(req.params.id)
      const deleteMatch = db.prepare(`DELETE FROM matches
      WHERE id = ?`);
      const result = deleteMatch.run(id);
      if (result.changes === 0) {
         return res.status(404).json({ error: `Match not found`});
      }

      res.json({success: true});
   }
   catch (err) {
      console.error(`error delting match`,err);
      res.status(500).json({error: err.message });   
   }
})


app.get('/loadMore', (req, res) => {
   try{
   console.log("LoadMore recieved");
   const offset = Number(req.query.offset)
   console.log(offset);
   const nextTenMatches = db.prepare(`SELECT id, fighter1, fighter2, oppfighter1, oppfighter2, result
      FROM matches
      LIMIT 10
      OFFSET ?`)
   const sendNextTenMatches = nextTenMatches.all(offset)
   res.json(sendNextTenMatches)
   }
   
   catch(err){
      console.error('error loading more matches');
      res.status(500).json({error: err.message});
   }
   
}
)




//t8 routes
app.post('/api/t8/fetch', async (req, res) => {
   try{
      console.log('gmrr')
      const beforeParam = Math.floor(Date.now()/1000)
      const response = await fetch(`https://wank.wavu.wiki/api/replays/?before=${beforeParam}&_format=json`)
            console.log('gmrr')
      const t8matches = await response.json();
      const stmt = db.prepare('INSERT INTO t8players (polaris_id, user_id, username) VALUES (?, ?, ?) ON CONFLICT(polaris_id) DO UPDATE SET username = excluded.username');
      const matches = db.prepare('INSERT INTO t8matches (battle_id, battle_at, battle_type, game_version, p1_polaris_id, p1_user_id, p1_chara_id, p1_rank_id, p1_rating_before, p1_rating_change, p1_rounds, p2_polaris_id, p2_user_id, p2_chara_id, p2_rank_id, p2_rating_before, p2_rating_change, p2_rounds, stage_id, winner) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,? ) ON CONFLICT(battle_id) DO NOTHING')
      for (const match of t8matches) {
         const { p1_polaris_id, p1_user_id, p1_name, p2_polaris_id, p2_user_id, p2_name, battle_id, battle_at, battle_type, game_version, p1_chara_id, p1_rank: p1_rank_id, p1_rating_before, p1_rating_change, p1_rounds, p2_chara_id, p2_rank: p2_rank_id, p2_rating_before, p2_rating_change, p2_rounds, stage_id, winner} = match
         stmt.run(p1_polaris_id, p1_user_id, p1_name);
         stmt.run(p2_polaris_id, p2_user_id, p2_name);
         matches.run(battle_id, battle_at, battle_type, game_version, p1_polaris_id, p1_user_id, p1_chara_id, p1_rank_id, p1_rating_before, p1_rating_change, p1_rounds, p2_polaris_id, p2_user_id, p2_chara_id, p2_rank_id, p2_rating_before, p2_rating_change, p2_rounds, stage_id, winner)
      }
      res.send(t8matches)
   } catch(err) {
console.error(`error retrieving matches`, err)
console.log(`error retrieving matches.`)
res.status(500).json({error: err.message});
   }
});


//run once to insert character ids, names, and patch added
app.post('/api/t8/seed', (req, res) => {
   try{
   const knownCharacters = [{char_id: 0, char_name: "Paul"}, {char_id: 1, char_name: "Law" }, {char_id: 2, char_name: "King"}, {char_id: 3, char_name: "Yoshimitsu"}, {char_id: 4, char_name: "Hwoarang"}, {char_id: 5, char_name: "Ling Xiaoyu"}, {char_id: 6, char_name: "Jin"}, {char_id: 7, char_name: "Bryan"}, {char_id: 8, char_name: "Kazuya"}, {char_id: 9, char_name: "Steve",}, {char_id: 10, char_name:"Jack-8"}, {char_id: 11, char_name: "Asuka"}, {char_id: 12, char_name: "Devil Jin"}, {char_id: 13, char_name: "Feng"}, {char_id: 14, char_name: "Lili"}, {char_id: 15, char_name: "Dragunov"}, {char_id: 16, char_name: "Leo"}, {char_id: 17, char_name: "Lars"}, {char_id: 18, char_name: "Alisa"}, {char_id: 19, char_name: "Claudio"}, {char_id: 20, char_name: "Shaheen"}, {char_id: 21, char_name: "Nina"}, {char_id: 22, char_name: "Lee"}, {char_id: 23, char_name: "Kuma"}, {char_id: 24, char_name: "Panda"}, {char_id: 25, char_name: "Zafina"}, {char_id: 26, char_name: "Leroy"}, {char_id: 27, char_name: "Jun"}, {char_id: 28, char_name: "Reina"}, {char_id: 29, char_name: "Azucena"}, {char_id: 30, char_name: "Victor"}, {char_id: 31, char_name: "Raven"}, {char_id: 33, char_name: "Eddy", patch_added: 10301}, {char_id: 34, char_name: "Lidia", patch_added: 10601}, {char_id: 35, char_name: "Heihachi", patch_added: 10801}, {char_id: 36, char_name: "Clive", patch_added: 11001}, {char_id: 37, char_name: "Anna", patch_added: 20001}, {char_id: 38, char_name: "Fahkumram", patch_added: 20301}, {char_id: 39, char_name: "Armor King", patch_added: 20601}, {char_id: 40, char_name: "Miary Zo", patch_added: 20800}, {char_id: 41, char_name: "Kunimitsu", patch_added: 30101} ]
   const characters = db.prepare('INSERT INTO t8characters(char_id, char_name, patch_added) VALUES(?,?,?) ON CONFLICT(char_id) DO NOTHING')
   for (const character of knownCharacters) {
   characters.run(character.char_id,character.char_name, character.patch_added)
   }
   res.send('characters added to table successfully');
}
catch(err) {
   console.error('Error adding characters to t8characters table');
   console.log('error adding characters to t8Characters table');
   res.status(500).json({error: err.message});
}
})


app.get('/Tekken8.html', (req, res) => {
   res.sendFile('./HTML/Tekken8.html', {root: __dirname})
});





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
// 28= zafina 29=leroy  32=jun 33= reina 34= azcuema 38= eddy there is no id25-27, 30-31
const knownCharacters = [{char_id: 0, char_name: "Paul"}, {char_id: 1, char_name: "Law" }, {char_id: 2, char_name: "King"}, {char_id: 3, char_name: "Yoshimitsu"}, {char_id: 4, char_name: "Hwoarang"}, {char_id: 5, char_name: "Ling Xiaoyu"}, {char_id: 6, char_name: "Jin"}, {char_id: 7, char_name: "Bryan"}, {char_id: 8, char_name: "Kazuya"}, {char_id: 9, char_name: Steve,}, {char_id: 10, char_name:"Jack-8"}, {char_id: 11, char_name: "Asuka"}, {char_id: 12, char_name: "Devil Jin"}, {char_id: 13, char_name: "Feng"}, {char_id: 14, char_name: "Lili"}, {char_id: 15, char_name: "Dragunov"}, {char_id: 16, char_name: "Leo"}, {char_id: 17, char_name: "Lars"}, {char_id: 18, char_name: "Alisa"}, {char_id: 19, char_name: "Claudio"}, {char_id: 20, char_name: "Shaheen"}, {char_id: 21, char_name: "Nina"}, {char_id: 22, char_name: "Lee"}, {char_id: 23, char_name: "Kuma"}, {char_id: 24, char_name: "Panda"}, {char_id: 28, char_name: "Zafina"}, {char_id: 29, char_name: "Leroy"}, {char_id: 32, char_name: "Jun"}, {char_id: 33, char_name: "Reina"}, {char_id: 34, char_name: "Azucena"}, {char_id: 35, char_name: "Victor"}, {char_id: 36, char_name: "Raven"}, {char_id: 38, char_name: "Eddy", patch_added: 10301}, {char_id: 39, char_name: "Lidia", patch_added: 10601}, {char_id: 40, char_name: "Heihachi", patch_added: 10801}, {char_id: 41, char_name: "Clive", patch_added: 11001}, {char_id: 42, char_name: "Anna", patch_added: 20001}, {char_id: 43, char_name: "Fahkumram", patch_added: 20301}, {char_id: 44, char_name: "Armor King", patch_added: 20601}, {char_id: 45, char_name: "Mairy Zo", patch_added: 20800}, {char_id: 46, char_name: "Kunimitsu", patch_added: 30101} ]
const characters = db.prepare('INSERT INTO t8characters(char_id, char_name, patch_added) VALUES(?,?,?)')
   for (const character of knownCharacters) {
      characters.run(character.char_id,character.char_name, character.patch_added)
   }

//rank_id 34= godV rank35 = godVI