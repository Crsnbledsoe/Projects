const express = require('express');
const fs = require('fs');
const app = express();

//listen for requests
app.listen(3000);
app.get('/', (req, res) => {
   res.sendFile('./HTML/2XKOT.html', {root: __dirname})
});

//404
app.use((req, res) => {
    res.sendFile('./HTML/404.html', {root: __dirname})
})
//app.get('/2XKOT', (req, res) => {
   // res.send('<p>Home Page</p>') 
//});
fs.writeFile('./test1.txt', 'hello world', (err) => {

    if (err) {
        console.error(err);
        return;
    }

    console.log('File written successfully');
});

