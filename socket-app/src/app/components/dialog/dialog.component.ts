import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DialogContentComponent } from '../dialog-content/dialog-content.component';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
  dialogResult;

  constructor(public dialog: MatDialog) { }

  ngOnInit() {

  }

  openDialog = () => {
    let dialogRef = this.dialog.open(DialogContentComponent,{
      width: '600px',
      data: 'this text is passed into the dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog closed: ${result}`);
      this.dialogResult = result;
    })
  }

}
