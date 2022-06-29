import { AfterViewInit, ChangeDetectorRef, Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-view-pdf',
  templateUrl: './view_pdf.component.html',
  styleUrls: ['./view_pdf.component.css']
})
export class ViewPdfComponent implements OnInit, AfterViewInit {

  h = '0px'; w = '0px';

  public customTitle: string;

  constructor(
                @Inject(MAT_DIALOG_DATA) public content: any,
                private dialogRef: MatDialogRef<ViewPdfComponent>,
                private detector: ChangeDetectorRef
              ) {
                // console.log(this.customTitle);
               }


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
