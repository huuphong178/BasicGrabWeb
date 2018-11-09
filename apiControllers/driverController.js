var express = require('express');
var driverRepo = require('../repos/driverRepo');
var authRepo= require('../repos/authRepo');
var haversine = require('haversine');
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
var checkHarversine=function(loctStart, loctEnd){
	var Distance=haversine(loctStart, loctEnd, {unit: 'meter'});
	console.log(Distance);
	if(Distance<=100) return true;
	return false;
}
var setHarversine=function(location){
	if(locationStart.latitude==0){
		locationStart.latitude=location.X;
		locationStart.longitude=location.Y;
		locationEnd.latitude=location.X;
		locationEnd.longitude=location.Y;
	}else{
		locationStart.latitude=locationEnd.latitude;
		locationStart.longitude=locationEnd.longitude;
		locationEnd.latitude=location.X;
		locationEnd.longitude=location.Y;
	}
}
var locationStart={ 
	latitude: 0,
	longitude: 0
	};
var locationEnd={ 
	latitude: 0,
	longitude: 0
	};

router.put('/location', (req, res) => {
	var id = req.body.id;
	var location = { 
		X: req.body.location_X,
		Y: req.body.location_Y
	}
	setHarversine(location);
	if(checkHarversine(locationStart, locationEnd)){
		driverRepo.updateLocation(id, location)
		.then(rows => {
			res.json(req.body);
		})
		.catch(err => {
			console.log(err);
			res.statusCode = 500;
			res.end('View error log on console');
		})
	}else{
		console.log('Invalid');
		res.statusCode = 204;
		res.end('Invalid');
	}
	
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

module.exports = router;