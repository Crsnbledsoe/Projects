
const fs = require('fs');


fs.writeFile('./test1.txt', 'hello world', (err) => {

    if (err) {
        console.error(err);
        return;
    }

    console.log('File written successfully');
});

