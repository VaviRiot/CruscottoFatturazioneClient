import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { EmailMessage } from 'app/models/EmailMessage';
import { FileServerData } from 'app/models/FileServerData';

@Component({
  selector: 'app-view-mail',
  templateUrl: './view_mail.component.html',
  styleUrls: ['./view_mail.component.css']
})
export class ViewMailComponent implements OnInit, AfterViewInit {

  h = '0px'; w = '0px'; 

  public emailMessage: EmailMessage = new EmailMessage("", "", "", "", null, null);

  public defDisabled: boolean = true;

  constructor(
                private dialogRef: MatDialogRef<EmailMessage>,
                private detector: ChangeDetectorRef
            ) { }


  ngAfterViewInit(): void {
    ///Devo refreshare il componente del pdf altrimenti non viene visualizzato
    this.w = '100%';
    this.h = '1000px';
    this.detector.detectChanges();
  }

  ngOnInit(): void {
    document.getElementById('testoEmailPrint').innerHTML = this.emailMessage.testo;

    // console.log(this.emailMessage);
  }

  openDocument(item: FileServerData)
  {
    // console.log(item);
    switch(item.type.toLowerCase())
    {
      case "pdf":
        this.openDocumentPDF(item);
        break;
    }
  }

  openDocumentPDF(item: FileServerData)
  {
    var winparams = 'dependent=yes,locationbar=no,scrollbars=yes,menubar=yes,'+
            'resizable,screenX=50,screenY=50,width=850,height=1050';

    var htmlPop = '<embed width=100% height=100%'
                      + ' type="application/pdf"'
                      + ' src="data:application/pdf;base64,'
                      + encodeURIComponent(item.bytes)
                      + '"></embed>';

    var printWindow = window.open (item.documentName, "PDF", winparams);
    printWindow.document.write (htmlPop);
  }

  close() {
    this.dialogRef.close();
  }

}
