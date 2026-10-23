const db = require('./connection');
//creates table for characters, note patch_added stores Wavu raw encoded game_version number3 0301, not string like "v3.03.01"
db.exec(`CREATE TABLE IF NOT EXISTS t8characters (
char_id INTEGER PRIMARY KEY,
char_name TEXT,
game_version INTEGER,
archetype_id INTEGER,
  
FOREIGN KEY (archetype_id) REFERENCES t8archetypes(archetype_id)
)`);


db.exec(`CREATE TABLE IF NOT EXISTS t8ranks (
rank_id INTEGER PRIMARY KEY,
en_name TEXT,
ja_name TEXT,
slug TEXT,
color TEXT,
division TEXT,
f_rank TEXT
)`);

//ranks table
db.exec(`CREATE TABLE IF NOT EXISTS t8versions (
game_version INTEGER PRIMARY KEY,
patch_date INTEGER,
season_id INTEGER
)`);
    

//initialize a table to track matches
db.exec(`CREATE TABLE IF NOT EXISTS t8matches (
battle_id TEXT PRIMARY KEY,
battle_at INTEGER,
battle_type INTEGER, 
game_version INTEGER,
p1_polaris_id TEXT, 
p1_user_id INTEGER, 
p1_chara_id INTEGER,
p1_rank_id INTEGER, 
p1_rating_before INTEGER, 
p1_rating_change INTEGER, 
p1_rounds INTEGER,
p2_polaris_id TEXT, 
p2_user_id INTEGER, 
p2_chara_id INTEGER, 
p2_rank_id INTEGER, 
p2_rating_before INTEGER, 
p2_rating_change INTEGER, 
p2_rounds INTEGER,
stage_id INTEGER, 
winner INTEGER,

FOREIGN KEY (game_version) REFERENCES t8versions(game_version),
FOREIGN KEY (p1_chara_id) REFERENCES t8characters(char_id),
FOREIGN KEY (p1_rank_id) REFERENCES t8ranks(rank_id),
FOREIGN KEY (p2_chara_id) REFERENCES t8characters(char_id),
FOREIGN KEY (p2_rank_id) REFERENCES t8ranks(rank_id)




)`);



db.exec(`CREATE TABLE IF NOT EXISTS t8players (
   polaris_id TEXT PRIMARY KEY,
   user_id INTEGER,
   username TEXT

)`);

db.exec(`CREATE TABLE IF NOT EXISTS t8seasons (
   id INTEGER PRIMARY KEY,
   start_game_version INTEGER,
   FOREIGN KEY (start_game_version) REFERENCES
   t8versions(game_version)
   )`);

   db.exec(`CREATE TABLE IF NOT EXISTS t8rankseasons (
      rank_id INTEGER,
      season_id INTEGER,
      points_to_promote INTEGER,
      PRIMARY KEY(rank_id, season_id),
      FOREIGN KEY(rank_id) REFERENCES t8ranks(rank_id),
      FOREIGN KEY (season_id) REFERENCES t8seasons(id)
      )`);

//create table of t8 archetypes
db.exec(`CREATE TABLE IF NOT EXISTS t8archetypes (
   archetype_id INTEGER PRIMARY KEY,
   archetype_name TEXT, 
   f_archetype TEXT
   )`);