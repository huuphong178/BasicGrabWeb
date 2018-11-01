var express = require('express');
var driverRepo = require('../repos/driverRepo');
var authRepo= require('../repos/authRepo');

var router = express.Router();

router.put('/', (req, res) => {
	var id = req.body.id;
	var status = req.body.status;
	var location = { 
		X: req.body.location_X,
		Y: req.body.location_Y
	}
	driverRepo.update(id, status, location)
		.then(rows => {
			res.json(rows);
		})
		.catch(err => {
			console.log(err);
			res.statusCode = 500;
			res.end('View error log on console');
		})
})

router.use(authRepo.verifyAccessTokenAdmin);

router.get('/', (req, res) => {
	driverRepo.loadAll()
		.then(rows => {
			res.json(rows);
		}).catch(err => {
			console.log(err);
			res.statusCode = 500;
			res.end('View error log on console');
		})
})

module.exports = router;