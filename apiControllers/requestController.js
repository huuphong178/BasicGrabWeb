var express = require("express");
var requestRepo = require("../repos/requestRepo");
var googleMapsClient = require("@google/maps").createClient({
    key: "AIzaSyDTOISAXq0i8QpAtlaI1jx6IZXjHpDHgVU",
    Promise: Promise
});
var moment = require("moment");
var events = require("../event/events");
var ws = require("./../ws/ws");
var wsForApp4 = require("./../ws/wsforApp4");

var router = express.Router();

var GenerateID = function() {
    var day = new Date();
    var timenow = day.getTime();
    return timenow;
};

router.get("/", (req, res) => {
    requestRepo
        .loadAll()
        .then(rows => {
            res.json(rows);
        })
        .catch(err => {
            console.log(err);
            res.statusCode = 500;
            res.end("View error log on console");
        });
});

router.post("/", (req, res) => {
    req.body.id = GenerateID();
    requestRepo
        .add(req.body)
        .then(value => {
            //	console.log(value);
            res.statusCode = 201;
            res.json(req.body);

            events.publishRequestAdded(req.body);
            // sendToLocator
            var json = JSON.stringify(req.body);
            ws.sendToLocator(json);
        })
        .catch(err => {
            console.log(err);
            res.statusCode = 500;
            res.end("View error log on console");
        });
});

router.put("/", (req, res) => {
    requestRepo
        .update(req.body)
        .then(value => {
            res.statusCode = 200;
            res.json(req.body);

            events.publishRequestModified(req.body);
            //test driver
            var json = JSON.stringify(req.body);
            wsForApp4.sendToDriver(json);
        })
        .catch(err => {
            console.log(err);
            res.statusCode = 500;
            res.end("View error log on console");
        });
});

router.delete("/", (req, res) => {
    console.log(req.body.id);
    requestRepo
        .delete(req.body.id)
        .then(value => {
            res.statusCode = 200;
            res.json({
                msg: "delete successful"
            });
        })
        .catch(err => {
            console.log(err);
            res.statusCode = 500;
            res.end("View error log on console");
        });
});

//NL
router.get("/minway/:requestID", (req, res) => {
    console.log("ok");
    var requestID = req.params.requestID;
    var status = 2; //đã có xe nhận

    requestRepo
        .loadInfo(requestID, status)
        .then(rows => {
            if (rows.length > 0) {
                res.statusCode = 200;
                res.json(rows[0]);
            } else {
                res.statusCode = 204;
                res.end();
            }
        })
        .catch(err => {
            console.log(err);
            res.statusCode = 500;
            res.end("View error log on console");
        });
});

router.get("/getRequestRealtime", (req, res) => {
    var timestamp = 0;
    if (req.query.timestamp) {
        timestamp = +req.query.timestamp;
    }

    var loop = 0;
    var fn = () => {
        var return_timestamp = new Date().getTime();
        console.log(timestamp);
        requestRepo
            .getRequestBetterID(timestamp)
            .then(rows => {
                if (rows.length > 0) {
                    console.log("rowssssssss");
                    res.json({
                        timestamp: return_timestamp,
                        arr: rows
                    });
                } else {
                    loop++;
                    console.log(`loop: ${loop}`);
                    if (loop < 4) {
                        setTimeout(fn, 2500);
                    } else {
                        res.statusCode = 204;
                        res.end("no data");
                    }
                }
            })
            .catch(err => {
                res.statusCode = 500;
                res.end(err);
            });
    };

    fn();
});

// Phi
router.get("/geocoding", (req, res) => {
    var address = req.query.address;
    console.log(address);

    googleMapsClient
        .geocode({
            address: address
        })
        .asPromise()
        .then(response => {
            console.log(response.json.results[0].geometry.location);
            res.json(response.json.results[0].geometry.location);
        })
        .catch(err => {
            console.log(err);
        });
});

router.get("/reverse-geocoding", (req, res) => {
    var latlng = `${req.query.lat}, ${req.query.lng}`;
    console.log(latlng);

    googleMapsClient
        .reverseGeocode({
            latlng: latlng
        })
        .asPromise()
        .then(response => {
            console.log(response.json.results[0].formatted_address);
            res.json(response.json.results[0].formatted_address);
        })
        .catch(err => {
            console.log(err);
        });
});

router.get("/history/:locator", (req, res) => {
    var locator = req.params.locator;
    requestRepo
        .getLocateHistory(locator)
        .then(rows => {
            console.log(rows);
            if (rows.length > 0) {
                var request = rows;
                res.statusCode = 200;
                res.json(request);
            } else {
                console.log("else");
                res.statusCode = 204;
                res.end();
            }
        })
        .catch(err => {
            console.log(err);
            res.statusCode = 500;
            res.end("View error log on console");
        });
});

router.get("/:id", (req, res) => {
    var id = req.params.id;
    requestRepo
        .getRequest(id)
        .then(rows => {
            if (rows.length > 0) {
                var request = rows[0];
                res.statusCode = 200;
                res.json(request);
            } else {
                res.statusCode = 204;
                res.end();
            }
        })
        .catch(err => {
            console.log(err);
            res.statusCode = 500;
            res.end("View error log on console");
        });
});

module.exports = router;
