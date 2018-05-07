const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const bodyParse = require('body-parser');
const SerialPort = require('serialport');


var port = new SerialPort('/dev/ttyACM0', {
    baudRate: 9600
});

var led = "";

io.on('connection', client => {
    client.on('subscribeLed', (interval) => {
        // console.log('client is subscribing to timer with interval ', interval);
        setInterval(() => {
            client.emit('led', led);
        }, interval);
    });
});

port.on('readable', ()=>{
    led = port.read().toString('utf-8');
})

// // Switches the port into "flowing mode"
// port.on('data', function (data) {
//     led = data.toString('utf-8');
// });


var router = express.Router();

router.use(bodyParse.urlencoded({
    extended: true
}));

router.use(bodyParse.json());


router.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


router.post("/led/game", (req, res) => {
    var dataJSON = req.body.data;
    var str = dataJSON.join();
    port.write(str, (err) => {
        if (err) {
            return console.log('Error on write: ', err.message);
        }
        console.log('message written');
    })
    res.send(dataJSON);
})



app.use("/api", router);

app.listen(1200, () => {
    console.log("Server listened in port: 1200")
})

http.listen(1230, () => {
    console.log("Socket server listen in port: 1230")
})