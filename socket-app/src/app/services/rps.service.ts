import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { initDomAdapter } from '@angular/platform-browser/src/browser';

@Injectable({
  providedIn: 'root'
})
export class RpsService {

  constructor(private socket: Socket) { }

  emitNickname = (nickname) => {
    this.socket.emit('nickname', nickname);
  }

  emitMessage = (message) => {
    this.socket.emit('sendMessage', message)
  }

  emitRpsChoice = (choice) => {
    this.socket.emit('turn', choice);
  }

  getMessages = () => {
    let observable = new Observable(observer => {
      this.socket.on('message', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    })
    return observable;
  }

  getConnectionStatus = () => {
    let observable = new Observable(observer => {
      this.socket.on('connectionSatus', (status) => {
        observer.next(status);
      });
      return () => {
        this.socket.disconnect();
      };
    })
    return observable;
  }

  getPlayerId = () => {
    let observable = new Observable(observer => {
      this.socket.on('playerId', (id) => {
        observer.next(id);
      });
      return () => {
        this.socket.disconnect();
      };
    })
    return observable;
  }

  getNicknames = () => {
    let observable = new Observable(observer => {
      this.socket.on('nicknames', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    })
    return observable;
  }

  getLastTurn = () =>{
    let observable = new Observable(observer => {
      this.socket.on('turn', (turn) => {
        observer.next(turn);
      });
      return () => {
        this.socket.disconnect();
      };
    })
    return observable;
  }

  getScore = () => {
    let observable = new Observable(observer => {
      this.socket.on('score', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    })
    return observable;
  }

  getTimerReset = () => {
    let observable = new Observable(observer => {
      this.socket.on('timerReset', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    })
    return observable;
  }

  getTimerStop = () => {
    let observable = new Observable(observer => {
      this.socket.on('timerStop', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    })
    return observable;
  }

  getWinner = () => {
    let observable = new Observable(observer => {
      this.socket.on('winnerDialog', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    })
    return observable;
  }
}
