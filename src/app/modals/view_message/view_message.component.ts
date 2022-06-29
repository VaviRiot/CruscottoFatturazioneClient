import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-view-message',
  templateUrl: './view_message.component.html',
  styleUrls: ['./view_message.component.css']
})
export class ViewMessageComponent implements OnInit, AfterViewInit {

  h = '0px'; w = '0px';

  public customTitle: string;
  public customMessage: string;

  constructor(
              private dialogRef: MatDialogRef<ViewMessageComponent>,
              private detector: ChangeDetectorRef
          ) { }


  ngAfterViewInit(): void {
    ///Devo refreshare il componente del pdf altrimenti non viene visualizzato
    this.w = '100%';
    this.h = '1000px';
    this.detector.detectChanges();
  }

  ngOnInit(): void {
  }

  close() {
    this.dialogRef.close();
  }

}
