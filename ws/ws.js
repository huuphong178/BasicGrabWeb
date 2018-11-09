var WebSocket = require("ws");
var requestqueueRepo = require("./../repos/requestqueueRepo");

var SOCKET_PORT = process.env.SOCKET_PORT || 40510;
var socketServer;

if (!socketServer) {
    socketServer = new WebSocket.Server({
        port: SOCKET_PORT
    });

    socketServer.on("connection", ws => {
        ws.on("message", msg => {
            //console.log(`receive: ${msg}`);
            msg = JSON.parse(msg);
            if (msg.init) {
                console.log(`receive: ${msg.init.id} - ${msg.init.status}`);
                ws.infoClient = msg.init;
            }

            if (msg.doneProcess) {
                console.log(
                    `Duoc gui tu: ${msg.doneProcess.id} - ${
                        msg.doneProcess.status
                    }`
                );

                // Kiểm tra trường bên client (doneProcess) gửi qua để coi có xóa trong db không
                if (msg.doneProcess.db.check) {
                    requestqueueRepo
                        .delete(msg.doneProcess.db.id)
                        .then(rows => {
                            console.log(
                                "WS - 34 - doneProcess: Đã xóa DB requestqueue"
                            );
                            checkRequestInDB_SendToClient(msg.doneProcess.id);
                        })
                        .catch(err => {
                            console.log(err);
                        });
                } else {
                    // Kiểm tra DB
                    console.log(
                        "WS - 43 - doneProcess: Xong request trực tiếp"
                    );
                    checkRequestInDB_SendToClient(msg.doneProcess.id);
                }
            }

            if (msg.isEmpty) {
                requestqueueRepo
                    .update(msg.closing.id, 0)
                    .then(rows => {
                        console.log(
                            "WS - 55 - clientClose: Đã cập nhật status requestqueue to 0"
                        );
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }
            // còn thiếu insert xuống db khi request trực tiếp mà close client
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
                        c.infoClient.status = 1;
                        requestqueueRepo
                            .update(rows[0].id, 1)
                            .then(rows => {
                                console.log(
                                    "WS - 76 - sendMsg: Đã cập nhật requestqueue"
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
        console.log(c.readyState);
        if (c.readyState === WebSocket.OPEN) {
            if (+c.infoClient.status === 0) {
                mes = JSON.parse(msg);
                mes.live = true;
                msg = JSON.stringify(mes);
                c.send(msg);
                console.log(msg);
                c.infoClient.status = 1;
                return;
            }
        }
    }

    console.log("WS - 97 - hết locator: Lưu DB đi");
    requestqueueRepo
        .insert(JSON.parse(msg))
        .then(rows => {
            console.log("WS - 101 - hết locator: Đã lưu DB");
        })
        .catch(err => {
            console.log(err);
        });
};

module.exports = {
    socketServer,
    sendToLocator
};
