import { Component, OnInit } from '@angular/core';
import { RpsService } from 'src/app/services/rps.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { DialogContentComponent } from '../../components/dialog-content/dialog-content.component';
import { faHandRock, faHandPaper, faHandScissors } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-prs',
  templateUrl: './prs.component.html',
  styleUrls: ['./prs.component.scss']
})
export class PrsComponent implements OnInit {
  messages = [];
  scores = [];
  nicknames = [];
  newMessage;

  counter;
  interval;

  /*
  icons 
  */
  faHandRock = faHandRock;
  faHandPaper = faHandPaper;
  faHandScissors = faHandScissors;

  constructor(private rpsService: RpsService, private router: Router, public dialog: MatDialog) { }

  ngOnInit() {
    let nicknamePlayer = localStorage.getItem('nickname');
    if(!nicknamePlayer){
      this.router.navigate(['/'])
    }
    this.newMessage = '';
    this.scores.push({
      'p1': null,
      'p2': null
    })
    this.nicknames.push({
      'p1': null,
      'p2': null
    })
    this.rpsService.getMessages().subscribe(message => {
      this.messages.unshift(message);
    })
    this.rpsService.getScore().subscribe(score => {
      this.scores.push(score);
    })
    this.rpsService.getNicknames().subscribe(names => {
      this.nicknames.push(names);
    })
    this.rpsService.getConnectionStatus().subscribe(status => {
      console.log(status);
      if (status) {
        this.rpsService.emitNickname(nicknamePlayer);
        this.runTimer();
      }
    })
    this.rpsService.getTimerReset().subscribe(TRbool => {
      if (TRbool) {
        this.resetTimer();
      }
    })
    this.rpsService.getTimerStop().subscribe(TSbool => {
      console.log(TSbool);
      if (TSbool) {
        this.stopTimer();
      }
    })
    this.rpsService.getWinner().subscribe(winner => {
      this.openDialog(winner);
    })
  }

  resetTimer = () => {
    clearInterval(this.interval);
    this.counter = 20;
    this.runTimer();
  }

  stopTimer = () => {
    clearInterval(this.interval);
    this.counter = 0;
  }

  runTimer = () => {
    this.counter = 20;
    this.interval = setInterval(() => {
      this.counter--;
      if (this.counter == 0) {
        clearInterval(this.interval);
      }
    }, 1000);
  }

  addToMessageArray = (val) => {
    this.messages.push(val);
  }

  sendMessage = () => {
    if (this.newMessage != '') {
      let date = new Date();
      let currentTime = `${date.getHours()}h ${date.getMinutes()}`;
      this.rpsService.emitMessage({
        'message': `${localStorage.getItem('nickname')} zegt: ${this.newMessage}`,
        'timestamp': currentTime
      });
      this.newMessage = '';
    }
  }

  yourRpsChoice = (choice) => {
    this.rpsService.emitRpsChoice(choice);
  }

  openDialog = (dialogText) => {
    let dialogRef = this.dialog.open(DialogContentComponent, {
      width: '400px',
      data: dialogText
    });
  }

  onKeydown(event) {
    if (event.key === "Enter") {
      this.sendMessage();
    }
  }

}
