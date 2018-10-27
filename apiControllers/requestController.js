var express = require('express');
var requestRepo = require('../repos/requestRepo');

var router = express.Router();

router.get('/', (req, res) => {
	requestRepo.loadAll()
		.then(rows => {
			res.json(rows);
		}).catch(err => {
			console.log(err);
			res.statusCode = 500;
			res.end('View error log on console');
		})
})

module.exports = router;