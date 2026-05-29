const express = require('express');
const fs = require('fs');
const app = express();

//listen for requests
app.listen(3000);
app.get('/', (req, res) => {
    res.send('<p>Home Page</p>') //.send method infers the content type and status code
});

fs.writeFile('./test1.txt', 'hello world', (err) => {

    if (err) {
        console.error(err);
        return;
    }

    console.log('File written successfully');
});

