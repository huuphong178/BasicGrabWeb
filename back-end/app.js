var express = require('express'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    cors = require('cors');
var app = express();

var requestCtrl = require('./apiControllers/requestController');
var driverCtrl = require('./apiControllers/driverController');
var userCtrl = require('./apiControllers/userController');
var mapCtrl = require("./apiControllers/mapController");
var events = require("./event/events");

var verifyAccessToken = require('./repos/authRepo').verifyAccessToken;
var verifyAccessTokenAdmin = require('./repos/authRepo').verifyAccessTokenAdmin;

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cors());

//app.use('/request', verifyAccessToken, requestCtrl);
app.use('/request',requestCtrl);
app.use('/driver', verifyAccessToken, driverCtrl);
//app.use('/driver', driverCtrl);
app.use('/account', userCtrl);

app.use("/map", verifyAccessTokenAdmin, mapCtrl);

app.get("/requestEvent", events.subscribeRequestEvent);

app.get('/', (req, res) => {
    res.json({
        msg: 'hello from nodejs express api'
    })
});

var port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Grab API is running on port ${port}`);
})