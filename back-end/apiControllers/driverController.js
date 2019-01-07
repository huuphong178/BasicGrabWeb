var express = require('express');
var driverRepo = require('../repos/driverRepo');
var authRepo = require('../repos/authRepo');
var haversine = require('haversine');
var router = express.Router();
var blacklistRepo = require("../repos/blacklistRepo");

var DISTANCE_MOVE=100 //meters
router.put('/distance_move', (req, res) => {
	if(req.body.distance>0){
		DISTANCE_MOVE = req.body.distance;
		res.json(DISTANCE_MOVE);
	}
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
			res.json(req.body);
		})
		.catch(err => {
			console.log(err);
			res.statusCode = 500;
			res.end('View error log on console');
		})
})
router.put('/status', (req, res) => {
	var id = req.body.id;
	var status = req.body.status;
	driverRepo.updateStatus(id, status)
		.then(rows => {
			res.json(req.body);
		})
		.catch(err => {
			console.log(err);
			res.statusCode = 500;
			res.end('View error log on console');
		})
})
var checkHarversine = (id_driver, locationend) => {
	return new Promise((resolve, reject) => {
		driverRepo.getCurrentDriver(id_driver)
			.then(value => {
				if (value.length > 0) {
					var locationStart = {
						latitude: value[0].location_X,
						longitude: value[0].location_Y
					};
					var Distance = haversine(locationStart, locationend, {
						unit: 'meter'
					});
					console.log(Distance);
					if (Distance <= DISTANCE_MOVE) return true;
					return false;
				}
			}).then(value => resolve(value))
			.catch(err => reject(err));
	})
}
router.put('/location', (req, res) => {
	var id = req.body.id;
	var locationCheck = {
		latitude: req.body.location_X,
		longitude: req.body.location_Y
	}
	var locationUpdate = {
		X: req.body.location_X,
		Y: req.body.location_Y
	}
	checkHarversine(id, locationCheck)
		.then(value => {
			if (value) {
				driverRepo.updateLocation(id, locationUpdate)
					.then(rows => {
						res.json(req.body);
					})
			} else {
				console.log('Invalid');
				res.statusCode = 204;
				res.end('Invalid');
			}
		}).catch(err => {
			console.log(err);
			res.statusCode = 500;
			res.end('View error log on console');
		})
})
//router.use(authRepo.verifyAccessTokenAdmin);

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
router.post('/blacklist', (req, res) => {
	blacklistRepo.add(req.body).then(value => {
		console.log('Post blacklist success');
		res.json(req.body);
	}).catch(err => {
		console.log(err);
			res.statusCode = 500;
			res.end('View error log on console');
	})
})
router.delete('/blacklist', (req, res) => {
	blacklistRepo.delete(req.body.id).then(value => {
		console.log('Delete blacklist success');
		res.json(req.body.id);
	}).catch(err => {
		console.log(err);
			res.statusCode = 500;
			res.end('View error log on console');
	})
})
router.get('/:driverID',(req, res) => {
	var id = req.params.driverID;
	driverRepo.getCurrentDriver(id)
		.then(rows => {
			if (rows.length > 0) {
                var currentDriverInfo = rows[0];
                res.statusCode = 200;
                res.json(currentDriverInfo);
            } else {
                res.statusCode = 204;
            }
		})
		.catch(err => {
			console.log(err);
            res.statusCode = 500;
            res.end("View error log on console");
		});
})

module.exports = router;