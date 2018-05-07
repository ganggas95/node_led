var {Board, Led} = require("johnny-five");

var board = new Board({port: '/dev/ttyACM0', timeout: 3600});

board.on("ready", function() {
    let led = new Led(13);
    led.strobe(2000);
});

board.on('error', (err)=>{
    console.log(err);
})

