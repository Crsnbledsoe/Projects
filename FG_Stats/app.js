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


db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

require('./db/2xko-schema');
require('./db/t8-schema');





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
   const knownCharacters = [{char_id: 0, char_name: "Paul"}, {char_id: 1, char_name: "Law" }, {char_id: 2, char_name: "King"}, {char_id: 3, char_name: "Yoshimitsu"}, {char_id: 4, char_name: "Hwoarang"}, {char_id: 5, char_name: "Ling Xiaoyu"}, {char_id: 6, char_name: "Jin"}, {char_id: 7, char_name: "Bryan"}, {char_id: 8, char_name: "Kazuya"}, {char_id: 9, char_name: "Steve",}, {char_id: 10, char_name:"Jack-8"}, {char_id: 11, char_name: "Asuka"}, {char_id: 12, char_name: "Devil Jin"}, {char_id: 13, char_name: "Feng"}, {char_id: 14, char_name: "Lili"}, {char_id: 15, char_name: "Dragunov"}, {char_id: 16, char_name: "Leo"}, {char_id: 17, char_name: "Lars"}, {char_id: 18, char_name: "Alisa"}, {char_id: 19, char_name: "Claudio"}, {char_id: 20, char_name: "Shaheen"}, {char_id: 21, char_name: "Nina"}, {char_id: 22, char_name: "Lee"}, {char_id: 23, char_name: "Kuma"}, {char_id: 24, char_name: "Panda"}, {char_id: 28, char_name: "Zafina"}, {char_id: 29, char_name: "Leroy"}, {char_id: 32, char_name: "Jun"}, {char_id: 33, char_name: "Reina"}, {char_id: 34, char_name: "Azucena"}, {char_id: 35, char_name: "Victor"}, {char_id: 36, char_name: "Raven"}, {char_id: 38, char_name: "Eddy", game_version: 10301}, {char_id: 39, char_name: "Lidia", game_version: 10601}, {char_id: 40, char_name: "Heihachi", game_version: 10801}, {char_id: 41, char_name: "Clive", game_version: 11001}, {char_id: 42, char_name: "Anna", game_version: 20001}, {char_id: 43, char_name: "Fahkumram", game_version: 20301}, {char_id: 44, char_name: "Armor King", game_version: 20601}, {char_id: 45, char_name: "Mairy Zo", game_version: 20800}, {char_id: 46, char_name: "Kunimitsu", game_version: 30101}]
   const characters = db.prepare('INSERT INTO t8characters(char_id, char_name, game_version) VALUES(?,?,?) ON CONFLICT(char_id) DO UPDATE SET char_id = excluded.char_id')
   for (const character of knownCharacters) {
   characters.run(character.char_id,character.char_name, character.game_version)
   }
   res.send('characters added to table successfully');
}
catch(err) {
   console.error('Error adding characters to t8characters table');
   console.log('error adding characters to t8Characters table');
   res.status(500).json({error: err.message});
}
})

//one time route to insert ranks and ids into ranks tables
app.post('/api/t8/rank-seed', (req, res) => {
   try{
      const knownRanks = [{rank_id: 0, en_name: "Beginner", ja_name: "入門生", slug: "beginner", color: "Brown", division: "Brown", f_rank: "" },
         {rank_id: 1, en_name: "First Dan", ja_name: "初段", slug: "first-dan", color: "Silver", division: "Silver", f_rank: ""}, 
         {rank_id: 2, en_name: "Second Dan", ja_name: "二段", slug: "second-dan", color: "Silver", division: "Silver", f_rank: ""},
         {rank_id: 3, en_name: "Fighter", ja_name: "勇士", slug: "fighter", color: "Turquoise", division: "Turquoise", f_rank: ""},
         {rank_id: 4, en_name: "Strategist", ja_name: "策士", slug: "strategist", color: "Turquoise", division: "Turquoise", f_rank: ""},
         {rank_id: 5, en_name: "Combatant", ja_name: "闘士", slug: "combatant", color: "Turquoise", division: "Turquoise", f_rank: ""},
         {rank_id: 6, en_name: "Brawler", ja_name: "餓狼", slug: "brawler", color: "Green", division: "Green", f_rank: ""},
         {rank_id: 7, en_name: "Ranger", ja_name: "荒鷲", slug: "ranger", color: "Green", division: "Green", f_rank: ""},
         {rank_id: 8, en_name: "Cavalry", ja_name: "猛象", slug: "cavalry", color: "Green", division: "Green", f_rank: ""},
         {rank_id: 9, en_name: "Warrior", ja_name: "剛拳", slug: "warrior", color: "Yellow", division: "Yellow", f_rank: ""},
         {rank_id: 10, en_name: "Assailant", ja_name: "邪拳", slug: "assailant", color: "Yellow", division: "Yellow", f_rank: ""},
         {rank_id: 11, en_name: "Dominator", ja_name: "戒拳", slug: "dominator", color: "Yellow", division: "Yellow", f_rank: ""},
         {rank_id: 12, en_name: "Vanquisher", ja_name: "修羅", slug: "vanquisher", color: "Orange", division: "Orange", f_rank: ""},
         {rank_id: 13, en_name: "Destroyer", ja_name: "羅刹", slug: "destroyer", color: "Orange", division: "Orange", f_rank: ""},
         {rank_id: 14, en_name: "Eliminator", ja_name: "羅傑", slug: "eliminator", color: "Orange", division: "Orange", f_rank: ""},
         {rank_id: 15, en_name: "Garyu", ja_name: "臥龍", slug: "garyu", color: "Red", division: "Red", f_rank: ""},
         {rank_id: 16, en_name: "Shinryu", ja_name: "真龍", slug: "shinryu", color: "Red", division: "Red", f_rank: ""},
         {rank_id: 17, en_name: "Tenryu", ja_name: "天龍", slug: "tenryu", color: "Red", division: "Red", f_rank: ""},
         {rank_id: 18, en_name: "Mighty Ruler", ja_name: "拳帝", slug: "mighty-ruler", color: "Ruler", division: "Ruler", f_rank: ""},
         {rank_id: 19, en_name: "Flame Ruler", ja_name: "炎帝", slug: "flame-ruler", color: "Ruler", division: "Ruler", f_rank: ""},
         {rank_id: 20, en_name: "Battle Ruler", ja_name: "炎帝", slug: "battle-ruler", color: "Ruler", division: "Ruler", f_rank: ""},
         {rank_id: 21, en_name: "Fujin", ja_name: "風神", slug: "fujin", color: "Blue", division: "Blue", f_rank: ""},
         {rank_id: 22, en_name: "Raijin", ja_name: "雷神", slug: "raijin", color: "Blue", division: "Blue", f_rank: ""},
         {rank_id: 23, en_name: "Kishin", ja_name: "鬼神", slug: "kishin", color: "Blue", division: "Blue", f_rank: ""},
         {rank_id: 24, en_name: "Bushin", ja_name: "武神", slug: "bushin", color: "Blue", division: "Blue", f_rank: ""},
         {rank_id: 25, en_name: "Tekken King", ja_name: "鉄拳王", slug: "tekken-king", color: "Gold", division: "Purple", f_rank: ""},
         {rank_id: 26, en_name: "Tekken Emperor", ja_name: "鉄拳覇皇", slug: "tekken-emperor", color: "Gold", division: "Purple", f_rank: ""},
         {rank_id: 27, en_name: "Tekken God", ja_name: "鉄拳神", slug: "tekken-god", color: "Gold", division: "Gold", f_rank: ""},
         {rank_id: 28, en_name: "Tekken God Supreme", ja_name: "鉄拳神極", slug: "tekken-god-supreme", color: "Gold", division: "Gold", f_rank: ""},
         {rank_id: 29, en_name: "Tekken God of Destruction", ja_name: "破壊神", slug: "tekken-god-of-destruction", color: "God of Destruction", division: "God of Destruction", f_rank: ""},
         {rank_id: 30, en_name: "Tekken God of Destruction 1", ja_name: "破壊神壱", slug: "tekken-god-of-destruction-1", color: "God of Destruction", division: "God of Destruction", f_rank: ""},
         {rank_id: 31, en_name: "Tekken God of Destruction 2", ja_name: "破壊神弐", slug: "tekken-god-of-destruction-2", color: "God of Destruction", division: "God of Destruction", f_rank: ""},
         {rank_id: 32, en_name: "Tekken God of Destruction 3", ja_name: "破壊神参", slug: "tekken-god-of-destruction-3", color: "God of Destruction", division: "God of Destruction", f_rank: ""},
         {rank_id: 33, en_name: "Tekken God of Destruction 4", ja_name: "破壊神肆", slug: "tekken-god-of-destruction-4", color: "God of Destruction", division: "God of Destruction", f_rank: ""},
         {rank_id: 34, en_name: "Tekken God of Destruction 5", ja_name: "破壊神伍", slug: "tekken-god-of-destruction-5", color: "God of Destruction", division: "God of Destruction", f_rank: ""},
         {rank_id: 35, en_name: "Tekken God of Destruction 6", ja_name: "破壊神陸", slug: "tekken-god-of-destruction-6", color: "God of Destruction", division: "God of Destruction", f_rank: ""},
         {rank_id: 36, en_name: "Tekken God of Destruction 7", ja_name: "破壊神漆", slug: "tekken-god-of-destruction-7", color: "God of Destruction", division: "God of Destruction", f_rank: ""},
         {rank_id: 37, en_name: "Tekken God of Destruction ∞", ja_name: "破壊神∞", slug: "tekken-god-of-destruction-∞", color: "God of Destruction", division: "God of Destruction", f_rank: ""},

      ]
      const patches = db.prepare(`INSERT  INTO t8ranks(rank_id), en_name, ja_name, slug, color, division, f_rank) VALUES(?,?,?,?,?,?,?)`)
   for(const rank of knownRanks) {
      rank.rank_id, rank.en_name, rank.ja_name, rank.slug, rank.color, rank.division, rank.f_rank
   }
   }
   catch(err){
      console.error(`Error adding ranks to t8ranks table`);
      console.log(`Error adding ranks to the t8ranks table`);
      res.status(500).json({error: err.message});

   }
})


app.post('/api/t8/game-version-seed', (req, res) => {
   try {
     const knownVersion = [{game_version: 10104, date_added: 1707307200, season_id: 0}, {game_version: 10201, date_added: 1709172000, season_id: 0}, {game_version: 10301, date_added: 1712008800, season_id: 1}, {game_version: 10302, date_added: 1714114800, season_id: 1 },{game_version: 10400, date_added: 1715151600, season_id: 1},{game_version: 10500, date_added: 1718089200, season_id: 1}, {game_version: 10601, date_added: 1721707200, season_id: 1},{game_version: 10602, date_added: 1722927780, season_id: 1},{game_version: 10700, date_added: 1725350580, season_id: 1},{game_version: 10801, date_added: 1727755200, season_id: 1},{game_version: 10901, date_added: 1730185200, season_id: 1} , {game_version: 11001, date_added: 1734411600, season_id: 1}, {game_version: 11100, date_added: 1736827200, season_id: 1},{game_version: 11201, date_added:1739851200, season_id: 1},{game_version: 11300, date_added: 1741669200, season_id: 1},{game_version: 20001, date_added: 1743480000, season_id: 2}, {game_version: 20002, date_added: 1744866180, season_id: 2},{game_version: 20100, date_added: 1747119600, season_id: 2},{game_version: 20200, date_added: 1748925000, season_id: 2}, {game_version: 20301, date_added: 1751947200, season_id: 2},{game_version: 20302, date_added: 1753155000, season_id: 2},{game_version: 20400, date_added: 1754368200, season_id: 2},{game_version: 20500, date_added: 1756794600, season_id: 2},{game_version: 20601, date_added: 1760421600, season_id: 2}, {game_version: 20602, date_added: 1761705000, season_id: 2}, {game_version: 20800, date_added: 1764644400, season_id: 2},{game_version: 20801, date_added: 1765852200, season_id: 2},{game_version: 30000, date_added: 1773723600, season_id: 3}, {game_version: 30001, date_added: 1774492200, season_id: 3},{game_version: 30002, date_added: 1776319200, season_id: 3}, {game_version: 30101, date: 1779948000, season_id: 3}, {game_version: 30201, date_added: 1787198400, season_id: 3} 
      ]
      const versions = db.prepare( `INSERT INTO t8versions (game_version, patch_date, season_id) VALUES (?,?,?) ON CONFLICT(game_version) DO NOTHING`)
     for (const version of knownVersions)
      versions.run(version.game_version, version.date_added, version.season_id)
   }
   catch(err){
      console.error(`Error adding patches table`)
      console.log(`Error adding patches table`)
      res.status(500).json({error: err.message});
   }
})


app.post(`/api/t8/add-seasons`, (req, res) => {
   try {
      const knownSeasons = [{id: 0, start_game_version: 10104}, {id: 1, start_game_version: 10301 }, {id: 2, start_game_version: 20001}, {id: 3, start_game_version: 30000}
      ]
      const seasons = db.prepare(`INSERT INTO t8seasons (id, start_game_version) VALUES (?,?) ON CONFLICT(id) DO NOTHING`)
      for (const season of knownSeasons)
      seasons.run(season.id, season.game_start_version)
   }
   catch (err){
      console.error(`Error adding seasons table`)
      console.log(`Error adding seasons table`)
      res.status(500).json({error: err.message});
   }
   }
);

app.post(`api/t8/add-rank-seasons`, (req, res) => {
   try {
      const knownRankSeason = [{ 

      }]
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
//

//rank_id 34= godV rank35 = godVI