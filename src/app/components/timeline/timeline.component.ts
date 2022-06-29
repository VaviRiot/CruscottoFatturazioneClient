import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { ViewMailComponent } from 'app/modals/view_mail/view_mail.component';
import { ViewPdfComponent } from 'app/modals/view_pdf/view_pdf.component';
import { EmailMessage } from 'app/models/EmailMessage';
import { FileServerData } from 'app/models/FileServerData';
import { EmailMessageRequest } from 'app/models/Request/EmailMessageRequest';
import { RichiestaTimelineResponse } from 'app/models/Response/RichiestaTimelineResponse';
import { AuthService } from 'app/shared/Service/AuthService/auth.service';
import { CommonService } from 'app/shared/Service/Common/common.service';
import { ProspectService } from 'app/shared/Service/Prospect/prospect.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {
  alternate: boolean = true;
  toggle: boolean = false;
  focusOnOpen: boolean = false;
  size: number = 40;
  expandEnabled: boolean = false;
  contentAnimation: boolean = false;
  dotAnimation: boolean = false;

  public dayMaxCompleteDate: number = +environment.dayMaxCompleteDate;

  @Input() entries: Array<RichiestaTimelineResponse> = []

  constructor(
              private authService: AuthService,
              private common: CommonService,
              private prospectService: ProspectService,
              public dialog: MatDialog,
              protected _sanitizer: DomSanitizer
            ) { }

  ngOnInit(): void
  {
    // console.log(this.dayMaxCompleteDate);
    // console.log(this.entries);
  }

  onHeaderClick(event) {
    if (!this.expandEnabled) {
      event.stopPropagation();
    }
  }

  onDotClick(event) {
    if (!this.expandEnabled) {
      event.stopPropagation();
    }
  }

  onExpandEntry(event, index) {
    if (!this.expandEnabled) {
      event.stopPropagation();
    }
  }
  
  openDocument(item: FileServerData, entry: RichiestaTimelineResponse)
  {
    // console.log(item);
    switch(item.type.toLowerCase())
    {
      case "pdf":
        this.openDocumentPDF(item);
        break;
      case "mail":
        this.openPopupMail(item, entry);
        break;
      default:
        if(item.documentId)
        {
          this.openGenericDocument(item.documentId);
        }
        break;
    }
  }

  openGenericDocument(document_id?: number)
  {
    this.common.sendUpdate("showSpinner");
    let auth_token: string = this.authService.getAuthToken();

    this.prospectService.getUploadDocumentData(auth_token, document_id).subscribe((response: FileServerData) => {
      this.common.sendUpdate("hideSpinner");
      var file = this.common.convertBase64ToBlobData(response.bytes, response.type);
      var fileURL = this._sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(file));

      let dialogRef = this.dialog.open(ViewPdfComponent, { data: fileURL, width: '1200px', height: '75vh', id: 'view-pdf-modal' });
      dialogRef.componentInstance.customTitle = response.documentName;
    },
      error => {

        this.common.sendUpdate("hideSpinner");
        this.common.sendUpdate("showAlertDanger", error.message);
      });
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

  openPopupMail(item: FileServerData, entry: RichiestaTimelineResponse)
  {
    let authToken: string = this.authService.getAuthToken();

    let tipoRegistroEmail: string = "";
    if(entry.business == "PAT" || entry.business == "ZC")
    {
      tipoRegistroEmail = environment.tipoRegistroEmailCanGar;
    }
    else
    {
      tipoRegistroEmail = environment.tipoRegistroEmailContratto;
    }

    this.prospectService.getEmailByRichiestaId(authToken, new EmailMessageRequest(entry.richiesta.id, entry.business, tipoRegistroEmail)).subscribe(
      res =>
      {
        let emailMessage = res as EmailMessage;

        let dialogRef = this.dialog.open(ViewMailComponent, { width: '1200px', height: '615px', id: 'view-mail-modal' });
        dialogRef.componentInstance.emailMessage = emailMessage;
      },
      err => {
          this.common.sendUpdate("hideSpinner");
          this.common.sendUpdate("showAlertDanger", err.message);
          console.log(err)
      }
    );
  }

}
