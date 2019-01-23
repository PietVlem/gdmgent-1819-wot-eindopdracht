const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

/*
RPS - game class
*/
const rpsGame = require('./rps-game');

/*
Get Time
*/
getTime = () => {
    let date = new Date();
    return `${date.getHours()}h ${date.getMinutes()}`;
}

/*
RPS - game
*/
vars = {
    room: 1,
    waitingPlayer: null
}

io.of('/rps').on('connection', socket => {
    socket.emit('message', createMessage('connecting to room...'));
    
    if(vars.waitingPlayer){
        vars.waitingPlayer.join(vars.room).emit('message', createMessage(`joined room ${vars.room}`));
        socket.join(vars.room).emit('message', createMessage(`joined room ${vars.room}`));
        new rpsGame(vars.waitingPlayer, socket, vars.room);
        vars.room += 1;
        vars.waitingPlayer = null;
    }else{
        vars.waitingPlayer = socket;
        
        vars.waitingPlayer.on('disconnect', function () {
            vars.waitingPlayer = null;
        });
    }
});

createMessage = (message) =>{
    return {
        'message' : message,
        'timestamp' : getTime(),
        'class': 'green'
    }
}

http.listen(4444, () => {
    console.log('Listening on port 4444');
});