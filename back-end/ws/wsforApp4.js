var WebSocket = require("ws");
var requestRepo = require("../repos/requestRepo");
var driverRepo = require("../repos/driverRepo");
var blacklistRepo = require("../repos/blacklistRepo");
var SOCKET_PORT = process.env.SOCKET_PORT || 40511;
var socketServer;

if (!socketServer) {
    socketServer = new WebSocket.Server({
        port: SOCKET_PORT,
        origin:'0.0.0.0'
    });

    socketServer.on("connection", ws => {
        ws.on("message", msg => {
            msg = JSON.parse(msg);
            if (msg.init) {
                console.log(`driver_id: ${msg.init.id}`);
                ws.infoClient = msg.init;
            }
            if (msg.msgResend) {
                var json = JSON.stringify(msg.msgResend);
                sendToDriver(json);
            }
        });

        ws.on('close', () => {
            console.log('websocket closed');
        });
    });
    console.log(`WS running on port ${SOCKET_PORT}`);
}

var sendToDriver = msg => {
    console.log(`Pre Send mess to driver!!!`);
    var mes = JSON.parse(msg);
    driverRepo.getDriverBest({
        latitude: mes.location_x,
        longitude: mes.location_y
    }, mes.id).then(driver_id => {
        for (var c of socketServer.clients) {
            if (c.readyState === WebSocket.OPEN) {
                if (c.infoClient.id === driver_id) {
                    console.log(`Send mess to ${driver_id}: ${mes}`);
                    c.send(msg);
                    return;
                }
            }
        }
    });
};

module.exports = {
    socketServer,
    sendToDriver
};