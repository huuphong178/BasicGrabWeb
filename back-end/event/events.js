var eventEmitter = require('eventemitter3');
var emitter = new eventEmitter();

var subscribeEvent = (req, res, eventArr) => {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });

    var heartBeat = setInterval(() => {
        res.write('\n');
    }, 15000);

    var handler = (data) => {
        var json = JSON.stringify(data);
        res.write(`retry: 500\n`);
        res.write(`event: ${data.event}\n`);
        res.write(`data: ${json}\n`);
        res.write(`\n`);
    }

    
    eventArr.forEach(element => {
        emitter.on(element, handler);
    });
    //emitter.on(event, handler);

    req.on('close', () => {
        clearInterval(heartBeat);
        eventArr.forEach(element => {
            emitter.removeListener(element, handler);
        });
        //emitter.removeListener(event, handler);
    });
}

//events
var REQUEST_ADDED = 'REQUEST_ADDED';
var REQUEST_MODIFIED = 'REQUEST_MODIFIED';

//RequestAdded
var subscribeRequestEvent = (req, res) => {
    subscribeEvent(req, res, [REQUEST_ADDED, REQUEST_MODIFIED]);
}

var publishRequestAdded = (requestObject) => {
    requestObject.event = REQUEST_ADDED;
    emitter.emit(REQUEST_ADDED, requestObject);
}

var publishRequestModified = (requestObject) => {
    requestObject.event = REQUEST_MODIFIED;
    emitter.emit(REQUEST_MODIFIED, requestObject);
}

module.exports = {
    subscribeRequestEvent,
    publishRequestAdded,
    publishRequestModified
}