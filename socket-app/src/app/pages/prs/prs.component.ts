import { Component, OnInit } from '@angular/core';
import { RpsService } from 'src/app/services/rps.service';
import { Observable, timer } from 'rxjs';
import { take, map } from 'rxjs/operators';
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
    this.scores.push({
      'p1': null,
      'p2': null
    })
    this.nicknames.push({
      'p1': null,
      'p2': null
    })
    this.rpsService.getMessages().subscribe(message => {
      this.messages.push(message);
    })
    this.rpsService.getScore().subscribe(score => {
      this.scores.push(score);
    })
    this.rpsService.getNicknames().subscribe(names => {
      this.nicknames.push(names);
    })
    this.rpsService.getConnectionStatus().subscribe(status => {
      if (status) {
        this.rpsService.emitNickname(nicknamePlayer);
        this.runTimer();
      }
    })
    this.rpsService.getTimerReset().subscribe(TRbool => {
      if(TRbool){
        this.resetTimer();
      }
    })
    this.rpsService.getTimerStop().subscribe(TSbool => {
      console.log(TSbool);
      if(TSbool){
        this.stopTimer();
      }
    })
    this.rpsService.getWinner().subscribe(winner => {
      this.openDialog(winner);
    })
    this.rpsService.getDCMessage().subscribe(DCMessage => {
      this.openDialog(DCMessage);
    })
  }

  resetTimer = () => {
    this.counter = 20;
  }

  stopTimer = () =>{
    clearInterval(this.interval);
    this.counter = 0;
  }

  runTimer = () => {
    this.counter = 20;
    this.interval = setInterval( () => {
      this.counter--;
      if (this.counter == 0) {
        clearInterval(this.interval);
      }
    }, 1000);
  }

  addToMessageArray = (val) => {
    this.messages.push(val);
  }

  sendMessage = (message) => {
    let date = new Date();
    let currentTime = `${date.getHours()}h ${date.getMinutes()}`;
    this.rpsService.emitMessage({
      'message': `${localStorage.getItem('nickname')} zegt: ${message.viewModel}`,
      'timestamp': currentTime
    });
  }

  yourRpsChoice = (choice) => {
    this.rpsService.emitRpsChoice(choice);
  }

  openDialog = (dialogText) => {
    let dialogRef = this.dialog.open(DialogContentComponent,{
      width: '400px',
      data: dialogText
    });


    /*
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog closed: ${result}`);
      this.dialogResult = result;
    })
    */
  }

  show

}
