import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RpsService {

  constructor(private socket: Socket) { }

  emitMessage = (message) => {
    this.socket.emit('sendMessage', message)
  }

  emitRpsChoice = (choice) => {
    this.socket.emit('turn', choice);
  }

  emitNickname = (nickname) => {
    console.log(nickname);
    this.socket.emit('nickname', nickname);
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
        console.log(data);
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    })
    return observable;
  }
}
