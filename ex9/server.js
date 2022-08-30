const xml = require('xml');
const express = require('express');
const app = express();

const database = require('./db.json');

app.get('/', (req, res) => {
    res.send('Hello');
});

app.get('/bands', (req, res) => {
    //default to json
    if (req.headers.accept.indexOf('application/xml') != -1) {
        const bands = database.map(el => {
            return { band: [{ id: el.id }, { name: el.band }, { nationality: el.nationality }] }
        });

        res.set('Content-Type', 'text/xml');
        res.send(xml({bands}));
    } else {
        const bands = database.map(el => {
            return  { id: el.id, name: el.band, nationality: el.nationality };
        });

        res.status(200).json(bands);
    }
});

app.get('/band/:id', (req, res) => {
    const { id } = req.params;

    const band = database.find(el => el.id == id);

    if (typeof(band) !== 'undefined') {
        const response = {
            id: band.id,
            name: band.band,
            nationality: band.nationality,
            links: [
                {
                    href: `${id}/albuns`,
                    rel: 'albuns',
                    type: 'GET'
                }
            ]
        }

        res.json(response);
    }
});

app.post('/band', (req, res) => {

});

app.put('/band/:id', (req, res) => {

});

app.delete('/band/:id', (req, res) => {

});


app.get('/band/:id/albuns', (req, res) => {
    const { id } = req.params;

    const band = database.find(el => el.id == id);

    if (typeof(band) !== 'undefined') {
        const response = {
            id: band.id,
            band: band.band,
            albuns: band.albuns.map(el => {
                return {
                    id: el.id,
                    title: el.title,
                    year: el.year,
                    total_songs: el.total_songs,
                    links: [
                        {
                            href: `${id}/album/${el.id}`,
                            type: "GET"
                        }
                    ]
                }
            })
        }

        res.json(response);
    }
});

app.get('/band/:id/album/:album_id', (req, res) => {
    const { id, album_id } = req.params;

    const band = database.find(el => el.id == id);

    if (typeof(band) !== 'undefined') {
        const album = band.albuns.find(el => el.id == album_id);

        if (typeof(album) !== 'undefined') {
            res.json(album);
        }
    }
});

app.post('/band/:id/album', (req, res) => {

});

app.put('/band/:id/album/:album_id', (req, res) => {

});

app.delete('/band/:id/album/:album_id', (req, res) => {

});


app.listen(3001, '0.0.0.0');