var express = require("express");
var googleMapsClient = require("@google/maps").createClient({
    key: "AIzaSyAF4NnJmtnjQIsG3cOP3Ci3-uJb0QCVr5E",
    Promise: Promise
});

var requestRepo = require("../repos/requestRepo");

var router = express.Router();
// Phi
// geocoding
router.get("/geocoding", (req, res) => {
    var address = req.query.address;

    googleMapsClient
        .geocode({
            address: address
        })
        .asPromise()
        .then(response => {
            res.statusCode = 200;
            res.json(response.json.results[0].geometry.location);
        })
        .catch(err => {
            if (err === "timeout") {
                res.statusCode = 504;
            } else {
                res.statusCode = 500;
            }
            res.json(`Google API didn't response +  ${err}`);
        });
});

// reverse-geocoding
router.get("/reverse-geocoding", (req, res) => {
    var latlng = `${req.query.lat}, ${req.query.lng}`;

    googleMapsClient
        .reverseGeocode({
            latlng: latlng
        })
        .asPromise()
        .then(response => {
            res.statusCode = 200;
            res.json(response.json.results[0].formatted_address);
        })
        .catch(err => {
            if (err === "timeout") {
                res.statusCode = 504;
            } else {
                res.statusCode = 500;
            }
            res.json("Google API didn't response");
        });
});

// directions
router.get("/directions/:id", (req, res) => {
    var requestId = req.params.id;

    requestRepo
        .loadInfo(requestId, 2)
        .then(rows => {
            if (rows.length > 0) {
                var origin = `${rows[0].request_loX}, ${rows[0].request_loY}`;
                var destination = `${rows[0].driver_loX}, ${
                    rows[0].driver_loY
                }`;
                googleMapsClient
                    .directions({
                        origin: origin,
                        destination: destination
                    })
                    .asPromise()
                    .then(response => {
                        res.statusCode = 200;
                        res.json(response);
                    })
                    .catch(err => {
                        if (err === "timeout") {
                            res.statusCode = 504;
                        } else {
                            res.statusCode = 500;
                        }
                        res.json("Google API not response");
                    });
            } else {
                res.statusCode = 204;
            }
        })
        .catch(err => {
            res.statusCode = 500;
            res.end("Server didn't response");
        });
});

module.exports = router;
