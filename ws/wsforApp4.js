var WebSocket = require("ws");
var requestRepo = require("../repos/requestRepo");
var driverRepo = require("../repos/driverRepo");
var SOCKET_PORT = process.env.SOCKET_PORT || 40511;
var socketServer;

if (!socketServer) {
    socketServer = new WebSocket.Server({
        port: SOCKET_PORT
    });

    socketServer.on("connection", ws => {
        ws.on("message", msg => {
            msg = JSON.parse(msg);
            if (msg.init) {
                console.log(`driver_id: ${msg.init.id}`);
                ws.infoClient = msg.init;
            }
            if (msg.denyMsg) {
                console.log(
                    `Deny: ${msg.denyMsg.id}`
                );
                ws.infoClient.deny.push(msg.denyMsg.id);
                console.log(ws.infoClient.deny);
                ws.infoClient.status = 1;
            }
            if (msg.accessMsg) {
                console.log(
                    `Access: ${msg.accessMsg}`
                );
                //Cap nhat trang thai request da co xe nhan
                msg.accessMsg.status = 2;
                requestRepo.update(msg.accessMsg).then(value => {
                    driverRepo.updateStatus(ws.infoClient.id, 3).then(value => {
                        //Cap nhat trang thai driving
                        ws.infoClient.status = 3;
                    })
                }).catch(err=>{
                    console.log(err);
                })

            }
            if (msg.finishMsg) {
                console.log(
                    `Finish: ${msg.finishMsg.id}`
                );
                //Cap nhat trang thai request da co xe nhan
                msg.finishMsg.status = 4;
                requestRepo.update(msg.finishMsg).then(value => {
                    driverRepo.updateStatus(ws.infoClient.id, 1).then(value => {
                        //Cap nhat trang thai ready
                        ws.infoClient.status = 1;
                    })
                }).catch(err=>{
                    console.log(err);
                })

            }
            
        });

        ws.on('close', ()=>{
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
                if(c.infoClient.id === driver_id){
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