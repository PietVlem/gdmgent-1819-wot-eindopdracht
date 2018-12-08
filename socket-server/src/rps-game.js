class RpsGame {
    constructor(p1, p2) {
        this.p1 = p1;
        this.p2 = p2;

        this.scoreP1 = 0;
        this.scoreP2 = 0;

        this.counter;
        this.maxCounterTime = 20;

        this.gameOver = false;

        this.players = [p1, p2];
        this.nicknames = [null, null];
        this.turns = [null, null];

        this.players.forEach(player => {
            player.emit('connectionSatus', true)
        });

        this.sendToPlayers('Tegenstander gevonden! (BO3 : Eerste die 2 punten heeft wint!)');
        this.updateScore();

        this.players.forEach((player, idx) => {
            player.on('nickname', (nickname) => {
                this.setNickname(idx, nickname);
            });
        });

        this.players.forEach((player, idx) => {
            player.on('turn', (turn) => {
                this.onTurn(idx, turn);
            });
        });

        this.runTimer();

        this.p1.on('disconnect', () => {
            this.onDisconnect(p2, 1)
        });
        this.p2.on('disconnect', () => {
            this.onDisconnect(p1, 0)
        });
    }

    getTime() {
        let date = new Date();
        return `${date.getHours()}h ${date.getMinutes()}`;
    }

    runTimer() {
        this.counter = this.maxCounterTime;
        this.interval = setInterval(() => {
            if(this.turns.includes(null)){
                this.counter--;
                if (this.counter == 0) {
                    let nullValues = this.getOccurrence(this.turns, null);
                    if(nullValues == 2){
                        this.sendToPlayers('Gelijkspel!');
                    }else{
                        if(this.turns.indexOf(null) == 0){
                            this.sendWinMessage(this.players[1], this.players[0]);
                            this.scoreP1 += 1;
                        }else{
                            this.sendWinMessage(this.players[0], this.players[1]);
                            this.scoreP2 += 1;
                        }
                        this.updateScore();
                    }
                    (this.scoreP1 == 2 || this.scoreP2 == 2) ? this.timerStop() : this.timerReset();
                }
            }
        }, 1000);
    }

    getOccurrence(array, value) {
        return array.filter((v) => (v === value)).length;
    }

    timerReset(){
        this.counter = this.maxCounterTime;
        this.players.forEach((player) => {
            player.emit('timerReset', true);
        });
    }

    timerStop(){
        clearInterval(this.interval);
        this.players.forEach((player) =>{
            player.emit('timerStop', true);
        })
    }

    sendToPlayer(playerIndex, msg) {
        this.players[playerIndex].emit('message', {
            'message': msg,
            'timestamp': this.getTime()
        });
    }

    onDisconnect(remainingPlayer, idx){
        this.timerStop();
        remainingPlayer.emit('dcMessage', `${this.nicknames[idx]} is de winnaar! Uw tegenstander is vertrokken.`);
    }

    sendToPlayers(msg) {
        this.players.forEach((player) => {
            player.emit('message', {
                'message': msg,
                'timestamp': this.getTime()
            });
        });
    }

    showWinnerDialog(winner){
        this.players.forEach((player) => {
            player.emit('winnerDialog', winner);
        });
    }

    onTurn(playerIndex, turn) {
        this.turns[playerIndex] = turn;
        this.sendToPlayer(playerIndex, `Uw keuze: ${turn}`);
        this.checkGameOver();
    }

    setNickname(playerIndex, nickname) {
        this.nicknames[playerIndex] = nickname;
        this.updateNickname(this.nicknames[0], this.nicknames[1])
    }

    checkGameOver() {
        const turns = this.turns;

        if (turns[0] && turns[1]) {
            this.sendToPlayers('Game over ' + turns.join(' : '));
            this.getGameResult();
            this.turns = [null, null];
            this.sendToPlayers('Volgende ronde!');
        }
    }

    getGameResult() {
        const p0 = this.decodeTurn(this.turns[0]);
        const p1 = this.decodeTurn(this.turns[1]);

        const distance = (p1 - p0 + 3) % 3;

        switch (distance) {
            case 0:
                this.sendToPlayers('Gelijkspel!');
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

    sendWinMessage(winner, loser) {
        winner.emit('message', {
            'message': 'jij wint! ( +1 punt )',
            'timestamp': this.getTime()
        });
        loser.emit('message', {
            'message': 'jij verliest.',
            'timestamp': this.getTime()
        });

        this.updateScore();
        this.checkWinner();
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
        if(this.scoreP1 == 2 || this.scoreP2 == 2){
            this.timerStop();
            if (this.scoreP1 == 2) {
                this.showWinnerDialog(`${this.nicknames[0]} is the winner!`)
            }
            if (this.scoreP2 == 2) {
                this.showWinnerDialog(`${this.nicknames[1]} is the winner!`)
            }
        }else{
            this.timerReset();
        }
    }

    updateNickname(nickname1, nickname2) {
        this.players.forEach((player) => {
            player.emit('nicknames', {
                'p1': nickname1,
                'p2': nickname2
            });
        })
    }

    updateScore() {
        this.players.forEach((player) => {
            player.emit('score', {
                'p1': this.scoreP1,
                'p2': this.scoreP2
            });
        })
    }
    

}

module.exports = RpsGame;