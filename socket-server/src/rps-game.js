class RpsGame {
    constructor(p1, p2, room) {
        this.p1 = p1;
        this.p2 = p2;
        this.room = room;

        this.scoreP1 = 0;
        this.scoreP2 = 0;

        this.counter;
        this.maxCounterTime = 20;

        this.players = [p1, p2];
        this.nicknames = [null, null];
        this.turns = [null, null];
        this.gameOver = false;

        this.getNicknames();
        this.emitConnected();
        this.updateScore();
        this.playerMessage();
        this.emitPlayerId();
        this.sendToPlayers('Tegenstander gevonden! (BO3 : Eerste die 2 punten heeft wint!)');

        this.players.forEach((player, idx) => {
            player.on('turn', (turn) => {
                this.onTurn(idx, turn);
            });
        });
        this.runTimer();
        this.playerDisconnect();
    }

    /*
    On disconnect
    */
    playerDisconnect() {
        this.players.forEach((player, idx) => {
            const self = this;
            player.on('disconnect', function () {
                if(!self.gameOver){
                    idx == 1? self.showWinnerDialog(`${self.nicknames[0]} is de winnaar!`) : self.showWinnerDialog(`${self.nicknames[1]} is de winnaar!`);
                    self.timerStop();
                }
            });
        });
    }

    /*
    Emit player id
    */
    emitPlayerId() {
        this.p1.emit('playerId', 0);
        this.p2.emit('playerId', 1);
    }

    /*
    Emit game found
    */
    emitConnected() {
        this.players.forEach((player) => {
            player.emit('connectionSatus', true);
        });
    }

    /*
    Get current time
    */
    getTime() {
        let date = new Date();
        return `${date.getHours()}h ${date.getMinutes()}`;
    }

    /*
    Nickname update
    */
    getNicknames() {
        this.players.forEach((player, idx) => {
            player.on('nickname', (nickname) => {
                this.setNickname(idx, nickname);
            });
        });
    }

    setNickname(playerIndex, nickname) {
        this.nicknames[playerIndex] = nickname;
        this.updateNickname(this.nicknames[0], this.nicknames[1])
    }

    updateNickname(nickname1, nickname2) {
        this.players.forEach((player) => {
            player.emit('nicknames', {
                'p1': nickname1,
                'p2': nickname2
            });
        })
    }

    /*
    Messaging players
    */
    sendToPlayer(playerIndex, msg) {
        this.players[playerIndex].emit('message', {
            'message': msg,
            'timestamp': this.getTime(),
            'class': 'green'
        });
    }

    sendToPlayers(msg) {
        this.players.forEach((player) => {
            player.emit('message', {
                'message': msg,
                'timestamp': this.getTime(),
                'class': 'green'
            });
        });
    }

    sendWinMessage(winner, loser) {
        winner.emit('message', {
            'message': 'jij wint! ( +1 punt )',
            'timestamp': this.getTime(),
            'class': 'green'
        });
        loser.emit('message', {
            'message': 'jij verliest.',
            'timestamp': this.getTime(),
            'class': 'green'
        });

        this.updateScore();
        this.checkWinner();
    }

    playerMessage() {
        this.players.forEach((player, idx) => {
            player.on('sendMessage', message => {
                this.players.forEach((player) => {
                    player.emit('message', {
                        'message': message.message,
                        'timestamp': message.timestamp,
                    });
                });
            })
        });
    }

    /* 
    Timer functions
    */
    runTimer() {
        this.counter = this.maxCounterTime;
        this.interval = setInterval(() => {
            if (this.turns.includes(null)) {
                this.counter--;
                console.log(this.counter);
                if (this.counter == 0) {
                    this.emitTurn(this.turns);
                    let nullValues = this.getOccurrence(this.turns, null);
                    if (nullValues == 2) {
                        this.sendToPlayers('Gelijkspel!');
                    } else {
                        if (this.turns.indexOf(null) == 0) {
                            this.sendWinMessage(this.players[1], this.players[0]);
                            this.scoreP1 += 1;
                        } else {
                            this.sendWinMessage(this.players[0], this.players[1]);
                            this.scoreP2 += 1;
                        }
                        this.turns = [null, null];
                        this.updateScore();
                    }
                    this.checkWinner();
                }
            }
        }, 1000);
    }

    timerReset() {
        this.counter = this.maxCounterTime;
        this.players.forEach((player) => {
            player.emit('timerReset', true);
        });
    }

    timerStop() {
        clearInterval(this.interval);
        this.players.forEach((player) => {
            player.emit('timerStop', true);
        })
    }

    /*
    Helper functions
    */
    getOccurrence(array, value) {
        return array.filter((v) => (v === value)).length;
    }

    /*
    Game Logic
    */
    onTurn(playerIndex, turn) {
        this.turns[playerIndex] = turn;
        this.sendToPlayer(playerIndex, `Uw keuze: ${turn}`);
        this.checkGameOver();
    }

    checkGameOver() {
        const turns = this.turns;

        if (turns[0] && turns[1]) {
            this.emitTurn(turns);
            this.sendToPlayers('Game over ' + turns.join(' : '));
            this.getGameResult();
            this.turns = [null, null];
            this.sendToPlayers('Volgende ronde!');
        }
    }

    emitTurn(turns) {
        this.players.forEach((player) => {
            player.emit('turn', turns);
        });
    }

    getGameResult() {
        const p0 = this.decodeTurn(this.turns[0]);
        const p1 = this.decodeTurn(this.turns[1]);

        const distance = (p1 - p0 + 3) % 3;

        switch (distance) {
            case 0:
                this.sendToPlayers('Gelijkspel!');
                this.timerReset();
                break;
            case 1:
                this.scoreP1 += 1;
                this.sendWinMessage(this.players[0], this.players[1]);
                break;
            case 2:
                this.scoreP2 += 1;
                this.sendWinMessage(this.players[1], this.players[0]);
                break;
        }
    }

    decodeTurn(turn) {
        switch (turn) {
            case 'rock':
                return 0;
            case 'scissors':
                return 1;
            case 'paper':
                return 2;
            default:
                throw new Error(`Could not decode turn ${turn}`);
        }
    }

    checkWinner() {
        if (this.scoreP1 == 2 || this.scoreP2 == 2) {
            this.timerStop();
            this.emitTurn();
            (this.scoreP1 == 2) ? this.showWinnerDialog(`${this.nicknames[0]} is de winnaar!`) : this.showWinnerDialog(`${this.nicknames[1]} is the winnaar!`);
            this.gameOver = true;
        } else {
            this.timerReset();
        }
    }

    updateScore() {
        this.players.forEach((player) => {
            player.emit('score', {
                'p1': this.scoreP1,
                'p2': this.scoreP2
            });
        })
    }

    /*
    Pop-ups
    */
    showWinnerDialog(winner) {
        this.players.forEach((player) => {
            player.emit('winnerDialog', winner);
        });
    }
}

module.exports = RpsGame;