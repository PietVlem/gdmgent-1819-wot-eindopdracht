const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

/*
RPS - game class
*/
const rpsGame = require('./rps-game');

/*
RPS - game
*/
let waitingPlayer = null;

/*
Get Time
*/
getTime = () => {
    let date = new Date();
    return `${date.getHours()}h ${date.getMinutes()}`;
}

io.on('connection', socket => {
    /*
    RPS 
    */
    if (waitingPlayer) {
        new rpsGame(waitingPlayer, socket);
        waitingPlayer = null;
    } else {
        waitingPlayer = socket;
        waitingPlayer.emit('message', {
            'message' : 'Wachten op tegenstander ...',
            'timestamp' : getTime()
        });
    }
    socket.on('sendMessage', message => {
        io.emit('message', message)
    })
    socket.on('disconnect', () => {
        waitingPlayer = null;
    })
});

http.listen(4444, () => {
    console.log('Listening on port 4444');
});
