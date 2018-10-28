var express = require('express');
var driverRepo = require('../repos/driverRepo');

var router = express.Router();

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

router.post('/register', (req, res) => {
	var driverEntity = {
		id: new Date().getTime(),
        name: req.body.name,
        phone: req.body.phone,
        address: req.body.address,
        bike_id: req.body.bike_id,
		bike_type: req.body.bike_type,
		username: req.body.username,
		password: req.body.password
	}

	driverRepo.register(driverEntity)
		.then(rows => {
			driverRepo.insertCurrDriver(driverEntity.id, 2, {X:null, Y:null})
				.then(r => {
					res.json(rows);
				})
		})
		.catch(err => {
			console.log(err);
			res.statusCode = 500;
			res.end('View error log on console');
		})
})

module.exports = router;