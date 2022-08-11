const xml = require('xml');
const express = require('express');
const app = express();

const database = require('./db.json');

app.get('/', (req, res) => {
    res.send('Hello');
});

app.get('/bands', (req, res) => {
    const bands = database.map(el => {
        return { band: [{ name: el.band }, { nationality: el.nationality }] }
    });

    res.set('Content-Type', 'text/xml');
    res.send(xml({bands}));

    //res.status(200).json(bands);
});

app.listen(3001, '0.0.0.0');