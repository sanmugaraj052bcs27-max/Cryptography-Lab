const express = require('express');
const app = express();
const path = require('path');


app.use(express.static(__dirname));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});


app.get('/aes', (req, res) => {
    res.sendFile(path.join(__dirname, 'aesht.html'));
});


app.get('/des', (req, res) => {
    res.sendFile(path.join(__dirname, 'desht.html'));
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log("Server running at http://localhost:" + PORT);
});