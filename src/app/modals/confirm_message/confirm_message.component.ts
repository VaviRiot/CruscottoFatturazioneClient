import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-message',
  templateUrl: './confirm_message.component.html',
  styleUrls: ['./confirm_message.component.scss']
})
export class ConfirmMessageComponent implements OnInit {

  url: string = "/confirm_message";

  public messageText: string = "";

  constructor(
    private dialogRef: MatDialogRef<ConfirmMessageComponent>,
    @Inject(MAT_DIALOG_DATA) public messageObject: any
    ) {}

  ngOnInit(): void {
    // console.log(this.messageObject);
  }

  close() {
    this.dialogRef.close(false);
  }

  confirm() {
    this.dialogRef.close(true);
  }
}
