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
router.get('/:id', (req, res) => {
    var id = req.params.id;
    requestRepo.getRequest(id).then(rows=>{
        if(rows.length>0){
            var request=rows[0];
            res.statusCode=200;
            res.json(request);
        } else{
            res.statusCode=204;
        }
        
    }).catch(err=>{
            console.log(err);
			res.statusCode = 500;
			res.end('View error log on console');
    })
})

router.post('/', (req,res) => {
    requestRepo.add(req.body)
        .then(value => {
		//	console.log(value);
			res.statusCode = 201;
			res.json(req.body);
        })
        .catch(err=>{
            console.log(err);
			res.statusCode = 500;
			res.end('View error log on console');
    })
})

router.put('/', (req, res) => {
    requestRepo.update(req.body)
        .then(value=>{
            res.statusCode = 200;
			res.json(req.body);
        })
        .catch(err=>{
            console.log(err);
			res.statusCode = 500;
			res.end('View error log on console');
        })
})

router.delete('/', (req,res)=>{
    console.log(req.body.id);
    requestRepo.delete(req.body.id)
        .then(value=>{
            res.statusCode = 200;
			res.json({
                msg:"delete successful"
            });
        })
        .catch(err=>{
            console.log(err);
            res.statusCode=500;
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