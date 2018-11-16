var express = require('express');
var driverRepo = require('../repos/driverRepo');
var authRepo = require('../repos/authRepo');
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
					if (Distance <= 100) return true;
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
	// driverRepo.findDriverBest({
	// 	latitude: 18.7624178,
	// 	longitude: 106.68119679999999
	// }, 12).then(value=>{
	// 	console.log(1);
	// 	res.json(value);
	// 	//res.json('value');
	// }).catch(err=>{
	// 	console.log(2);
	// })
	const getNumbers=async function loop() {
		let check=false;
		let result=-1;
		for (let i = 0; i < 5000; i++) {
			
			if(!check){
				await driverRepo.findDriverBest({
					latitude: 18.7624178,
					longitude: 106.68119679999999
				}, req.query.id).then(value => {
					
					console.log(value)
					if(value!=-1) {
						console.log('abcd');
						check=true;
						result=value;
						
						 }
				});
			}else{return result;}
			
			console.log(i);
		}
		return result;
		//res.json(result);
	};
	getNumbers().then(v=>{
		console.log(v);
		res.json(v);
	})
	
	// driverRepo.loadAll()
	// 	.then(rows => {
	// 		res.json(rows);
	// 	}).catch(err => {
	// 		console.log(err);
	// 		res.statusCode = 500;
	// 		res.end('View error log on console');
	// 	})
})

module.exports = router;