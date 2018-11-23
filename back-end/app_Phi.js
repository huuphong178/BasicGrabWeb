var express = require("express"),
    bodyParser = require("body-parser"),
    morgan = require("morgan"),
    cors = require("cors");

var app = express();
var requestCtrl = require("./apiControllers/requestController");
var driverCtrl = require("./apiControllers/driverController");
var mapCtrl = require("./apiControllers/mapController");
var userCtrl = require("./apiControllers/userController");
var middleWare = require("./repos/authRepo");
var events = require("./event/events");

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cors());

app.use("/account", userCtrl);
app.use("/request", middleWare.verifyAccessTokenAdmin, requestCtrl);
app.use(
    "/driver",
    middleWare.verifyAccessToken,
    driverCtrl
);
app.use("/map", middleWare.verifyAccessTokenAdmin, mapCtrl);
app.get("/requestEvent", events.subscribeRequestEvent);

app.get("/", (req, res) => {
    res.json({
        msg: "hello from nodejs express api"
    });
});

var port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Grab API is running on port ${port}`);
});
