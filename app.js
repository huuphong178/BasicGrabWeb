var express = require('express'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    cors = require('cors');
var app = express();
//test
var router = express.Router();

var requestCtrl=require('./apiControllers/requestController');
var driverCtrl=require('./apiControllers/driverController');
var userCtrl=require('./apiControllers/userController');
var events = require("./event/events");

var verifyAccessToken= require('./repos/authRepo').verifyAccessToken;
var verifyAccessTokenAdmin= require('./repos/authRepo').verifyAccessTokenAdmin;

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cors());

app.use('/request',verifyAccessTokenAdmin,requestCtrl);
//app.use('/request',requestCtrl);
app.use('/driver', verifyAccessToken, driverCtrl);
//app.use('/driver', driverCtrl);
app.use('/account', userCtrl);

app.get("/requestEvent", events.subscribeRequestEvent);
app.get('/', (req, res) => {
    res.json({
        msg: 'hello from nodejs express api'
    })
});
// app.get('/user/:id', function (req, res, next) {
//     // if the user ID is 0, skip to the next route
//     if (req.params.id === '0') next('route')
//     // otherwise pass the control to the next middleware function in this stack
//     else next()
//   }, function (req, res, next) {
//     // send a regular response
//     res.send('regular')
//   })
  
//   // handler for the /user/:id path, which sends a special response
//   app.get('/user/:id', function (req, res, next) {
//     res.send('special')
//   })
// predicate the router with a check and bail out when needed
router.use(function (req, res, next) {
    if (!req.headers['x-auth']) return next('router')
    next()
  })
  
  router.get('/', function (req, res) {
    res.send('hello, user!')
  })
  
  // use the router and 401 anything falling through
  app.use('/admin', router, function (req, res) {
    res.sendStatus(401)
  })


var port = process.env.PORT || 3000;
app.listen(port,() => {
    console.log(`Grab API is running on port ${port}`);
})