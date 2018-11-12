var WebSocket = require("ws");
var requestqueueRepo = require("./../repos/requestqueueRepo");
var RequestStatus = require("./../constants/requestStatus");
var RequestQueueStatus = require("./../constants/requestQueueStatus");
var LocatorStatus = require("./../constants/locatorStatus");

var SOCKET_PORT = process.env.SOCKET_PORT || 40510;
var socketServer;

if (!socketServer) {
    socketServer = new WebSocket.Server({
        port: SOCKET_PORT
    });

    socketServer.on("connection", ws => {
        ws.on("message", msg => {
            msg = JSON.parse(msg);
            if (msg.init) {
                console.log(`locator: ${msg.init.id} - ${msg.init.status}`);
                ws.infoClient = msg.init;
                console.log("Request Status: " + RequestStatus.CHUA_DINH_VI);
            }

            if (msg.doneProcess) {
                console.log(
                    `DoneProcess: ${msg.doneProcess.id} - ${
                        msg.doneProcess.status
                    }`
                );

                // Cập nhật lại status rảnh cho client
                for (var c of socketServer.clients) {
                    if (c.infoClient.id == msg.doneProcess.id) {
                        c.infoClient.status = msg.doneProcess.status;
                    }
                }

                // Kiểm tra trường bên client (doneProcess) gửi qua để coi có xóa trong db không
                if (msg.doneProcess.db.check) {
                    requestqueueRepo
                        .delete(msg.doneProcess.db.id)
                        .then(rows => {
                            console.log(
                                "WS - 44 - doneProcess: Đã xóa DB requestqueue"
                            );
                            checkRequestInDB_SendToClient(msg.doneProcess.id);
                        })
                        .catch(err => {
                            console.log(err);
                        });
                } else {
                    // Kiểm tra DB
                    console.log(
                        "WS - 54 - doneProcess: Xong request trực tiếp"
                    );
                    checkRequestInDB_SendToClient(msg.doneProcess.id);
                }
            }

            if (msg.closing) {
                if (msg.type === "db") {
                    requestqueueRepo
                        .update(msg.data.id, RequestQueueStatus.CHUA_XU_LY)
                        .then(rows => {
                            console.log(
                                "WS - 66 - clientClose: Đã cập nhật status requestqueue to 0 - " +
                                    msg.data.id
                            );
                        })
                        .catch(err => {
                            console.log(err);
                        });
                } else if (msg.type === "live") {
                    console.log(
                        "WS - 75 - clientClose: request live - " + msg.data.id
                    );
                    requestqueueRepo
                        .insert(msg.data)
                        .then(rows => {
                            console.log(
                                "WS - 81 -  clientClose: Đã lưu DB request live"
                            );
                        })
                        .catch(err => {
                            console.log(err);
                        });
                }
            }
        });
    });
    console.log(`WS running on port ${SOCKET_PORT}`);
}

var checkRequestInDB_SendToClient = function(id) {
    requestqueueRepo
        .loadAll()
        .then(rows => {
            if (rows.length > 0) {
                // Tìm locator
                for (var c of socketServer.clients) {
                    if (c.infoClient.id == id) {
                        //thuc hien gui request toi client
                        var msg = rows[0];
                        msg.db = true;
                        c.send(JSON.stringify(msg));
                        c.infoClient.status = LocatorStatus.BAN;

                        requestqueueRepo
                            .update(rows[0].id, RequestQueueStatus.DANG_XU_LY)
                            .then(rows => {
                                console.log(
                                    "WS - 112 - sendMsg: Đã cập nhật requestqueue"
                                );
                            })
                            .catch(err => {
                                console.log(err);
                            });
                        break;
                    }
                }
            }
        })
        .catch(err => {
            console.log(err);
        });
};

var sendToLocator = msg => {
    for (var c of socketServer.clients) {
        if (c.readyState === WebSocket.OPEN) {
            if (+c.infoClient.status === LocatorStatus.RANH) {
                mes = JSON.parse(msg);
                mes.live = true;
                msg = JSON.stringify(mes);
                c.send(msg);
                c.infoClient.status = LocatorStatus.BAN;
                return;
            }
        }
    }

    console.log("WS - 142 - hết locator: Lưu DB đi");
    requestqueueRepo
        .insert(JSON.parse(msg))
        .then(rows => {
            console.log("WS - 146 - hết locator: Đã lưu DB");
        })
        .catch(err => {
            console.log(err);
        });
};

module.exports = {
    socketServer,
    sendToLocator
};
