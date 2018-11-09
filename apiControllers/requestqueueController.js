var express = require("express");
var requestqueueRepo = require("./../repos/requestqueueRepo");

var router = express.Router();

router.get("/", (req, res) => {
    requestqueueRepo
        .loadAll()
        .then(rows => {
            res.statusCode = 200;
            res.json(rows);
        })
        .catch(err => {
            console.log(err);
            res.statusCode = 500;
            res.end("View error log on console");
        });
});

module.exports = router;
