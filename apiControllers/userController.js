var express = require('express');
var driverRepo = require('../repos/driverRepo');
var authRepo= require('../repos/authRepo');

var router = express.Router();

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

router.post('/login',(req, res) => {
	// req.body={
	// 	username:"huuphong",
	// 	password: "123456"
	// }
	driverRepo.login(req.body)
		.then(rows => {
			console.log(rows.length);
			if (rows.length > 0){
				var loginEntity=rows[0];
				var acToken = authRepo.generateAccessTokenDriver(loginEntity);
				var refToken= authRepo.generateRefreshToken();
				authRepo.updateRefreshToken(loginEntity.id,refToken)
					.then(value=>{
						res.json({
							auth:true,
							user: loginEntity,
							access_token: acToken,
							refresh_token: refToken
						});
					})
					.catch(err=>{
						console.log(err);
						res.statusCode = 500;
						res.end('View error log on console');
					})
				
			}
			else {
				res.json({
					auth:false
				})
			}
		})
		.catch(err=>{
			console.log(err);
			res.statusCode = 500;
			res.end('View error log on console');
		})
})

module.exports = router;