var express = require('express');
var requestRepo = require('../repos/requestRepo');
var googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyBkLC43G_H0JQTCbxCRjhtLPwGgXWJNPq4',
    Promise: Promise
});

var router = express.Router();

router.get('/', (req, res) => {
    requestRepo.loadAll()
        .then(rows => {
            res.json(rows);
        }).catch(err => {
            console.log(err);
            res.statusCode = 500;
            res.end('View error log on console');
        });
});

// Phi
router.get('/geocoding', (req, res) => {
    var address = req.query.address;
    console.log(address);

    googleMapsClient.geocode({
            address: address
        })
        .asPromise()
        .then((response) => {
            console.log(response.json.results[0].geometry.location);
            res.json(response.json.results[0].geometry.location);
        })
        .catch((err) => {
            console.log(err);
        });
});

router.get('/reverse-geocoding', (req, res) => {
    var latlng = `${req.query.lat}, ${req.query.lng}`;
    console.log(latlng);

    googleMapsClient.reverseGeocode({
            latlng: latlng
        })
        .asPromise()
        .then((response) => {
            console.log(response.json.results[0].formatted_address);
            res.json(response.json.results[0].formatted_address);
        })
        .catch((err) => {
            console.log(err);
        });
});

module.exports = router;