var WebSocket = require("ws");

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

            if (msg.doneProcess) {
                console.log(
                    `DoneProcess: ${msg.doneProcess.id} - ${
                        msg.doneProcess.status
                    }`
                );

                
            }

            
        });
    });
    console.log(`WS running on port ${SOCKET_PORT}`);
}


module.exports = {
    socketServer
};