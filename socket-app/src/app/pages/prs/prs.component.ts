import { Component, OnInit } from '@angular/core';
import { RpsService } from 'src/app/services/rps.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { DialogContentComponent } from '../../components/dialog-content/dialog-content.component';
import { faHandRock, faHandPaper, faHandScissors, faTimes, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-prs',
  templateUrl: './prs.component.html',
  styleUrls: ['./prs.component.scss']
})
export class PrsComponent implements OnInit {
  messages = [];
  scores = [];
  nicknames = [];
  lastTurn;
  newMessage;
  playerId;
  advId;
  NewChoice = false;

  // choice
  paperIconShow = false;
  rockIconShow = false;
  scissorsIconShow = false;
  OopsIconShow = false;
  adv_paperIconShow = false;
  adv_rockIconShow = false;
  adv_scissorsIconShow = false;
  adv_OopsIconShow = false;

  // disbale buttons
  btnChoiceDisabled = false;
  
  counter;
  interval;
  yourChoice;
  advChoice;

  /*
  icons 
  */
  faHandRock = faHandRock;
  faHandPaper = faHandPaper;
  faHandScissors = faHandScissors;
  faTimes = faTimes;
  faArrowLeft = faArrowLeft;
  

  constructor(private rpsService: RpsService, private router: Router, public dialog: MatDialog) { }

  ngOnInit() {
    let nicknamePlayer = localStorage.getItem('nickname');
    if (!nicknamePlayer) {
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
    this.rpsService.getPlayerId().subscribe(id => {
      this.playerId = id;
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
      setTimeout(() => {
        this.openDialog(winner);
      }, 2000);
    })
    this.rpsService.getLastTurn().subscribe(turn => {
      console.log(turn);
      this.lastTurn = turn;
    })
  }

  goBack(){
    this.router.navigate(['/']);
  }

  resetTimer = () => {
    this.showLastTurn();
    clearInterval(this.interval);
    this.counter = 20;
    this.runTimer();
  }

  stopTimer = () => {
    this.showLastTurn();
    this.btnChoiceDisabled = true;
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
    this.clearIcons();
    this.NewChoice = true;
    switch (choice) {
      case 'paper':
        this.paperIconShow = true;
        break;
      case 'rock':
        this.rockIconShow = true;
        break;
      case 'scissors':
        this.scissorsIconShow = true;
        break;
    }
  }

  showLastTurn = () => {
    let advId;
    this.playerId == 0 ? advId = 1 : advId = 0;
    let yourChoice = this.lastTurn[this.playerId];
    let advChoice = this.lastTurn[advId];

    switch(yourChoice){
      case 'paper':
        this.paperIconShow = true;
        break;
      case 'rock':
        this.rockIconShow = true;
        break;
      case 'scissors':
        this.scissorsIconShow = true;
        break;
      case null:
        this.OopsIconShow = true;
        break;
    }

    switch(advChoice){
      case 'paper':
        this.adv_paperIconShow = true;
        break;
      case 'rock':
        this.adv_rockIconShow = true;
        break;
      case 'scissors':
        this.adv_scissorsIconShow = true;
        break;
      case null:
        this.adv_OopsIconShow = true;
        break;
    }
    const self = this;
    setTimeout(function () {
     self.clearIcons();
    }, 3000);
  }

  clearIcons = () => {
    this.paperIconShow = false;
    this.rockIconShow = false;
    this.scissorsIconShow = false;
    this.OopsIconShow = false;
    this.adv_paperIconShow = false;
    this.adv_rockIconShow = false;
    this.adv_scissorsIconShow = false;
    this.adv_OopsIconShow = false;
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
