const db = require('./connection');
//creates table for characters, note patch_added stores Wavu raw encoded game_version number3 0301, not string like "v3.03.01"
db.exec(`CREATE TABLE IF NOT EXISTS t8characters (
  char_id INTEGER PRIMARY KEY,
  char_name TEXT,
  patch_added INTEGER
)`);


db.exec(`CREATE TABLE IF NOT EXISTS t8ranks (
   rank_id INTEGER PRIMARY KEY ,
   rank_name TEXT,
   points_season1 INTEGER,
   points_season2 INTEGER,
   points_season3 INTEGER
)`);