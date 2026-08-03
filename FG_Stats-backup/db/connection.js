//pulls in bettersqlite3 and the variable database becomes a sort of blueprint we can use to build databases
const Database = require('better-sqlite3');
//keyword 'new' actually builds database at the file location listed
const db = new Database('Data/stats.db');
//allows other files(like app.js) to use the db variable
module.exports = db;
