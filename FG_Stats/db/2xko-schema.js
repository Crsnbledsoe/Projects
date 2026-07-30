const db = require('./connection')

db.exec(`CREATE TABLE IF NOT EXISTS matches (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   fighter1 TEXT NOT NULL,
   fighter2 TEXT NOT NULL,
   oppfighter1 TEXT NOT NULL,
   oppfighter2 TEXT NOT NULL,
   result TEXT NOT NULL,
   event_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
)`);