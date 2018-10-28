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

//NL
router.get('/minway/:requestID', (req, res) => {
	var requestID=req.params.requestID;
	var status = 2; //đã có xe nhận

	requestRepo.loadInfo(requestID, status)
		.then(rows => {
			if(rows.length>0){
				res.statusCode = 200;
				res.json(rows[0]);
			}else{
				res.statusCode = 204;
			}
		}).catch(err => {
			console.log(err);
			res.statusCode = 500;
			res.end('View error log on console');
		})
})

module.exports = router;