import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DetailProspectComponent } from 'app/detail_prospect/detail_prospect.component';
import { ProspectDocUploadRequest } from 'app/models/Request/ProspectDocUploadRequest';
import { ProspectDocumentoTipo } from 'app/models/ProspectDocumentoTipo';
import { User } from 'app/models/User';
import { AuthService } from 'app/shared/Service/AuthService/auth.service';
import { CommonService } from 'app/shared/Service/Common/common.service';
import { ProspectService } from 'app/shared/Service/Prospect/prospect.service';
import { Subscription } from 'rxjs';
import { file } from 'googleapis/build/src/apis/file';
import { CanaleGaranzia } from 'app/models/CanaleGaranzia';
import { environment } from 'environments/environment';
import { ConfirmMessageComponent } from '../confirm_message/confirm_message.component';
import { FileServerData } from 'app/models/FileServerData';

@Component({
  selector: 'app-document-upload',
  templateUrl: './document_upload.component.html',
  styleUrls: ['./document_upload.component.css']
})
export class DocumentUploadComponent implements OnInit {

  private ipAddress: string = "";

  public fileDescription: string = "";
  public errorMessage: string = "";

  public file_full_name: string = "-";
  public fileUploadRequest: ProspectDocUploadRequest = null;

  public tipologiaDocumento: number = 0;
  public tipologiaDocumentoDesc: string = "";
  public user: User;
  
  public canaleGaranzia: number = 0;
  public canaleGaranziaDesc: string = "";
  
  private listSubscription: Subscription;
  private listCanaliSubscription: Subscription;
  public listTipiDocumenti: Array<ProspectDocumentoTipo>;
  public listCanaliGaranzie: Array<CanaleGaranzia>;

  public reader = new FileReader();

  public isView: boolean = true;
  public fileList?: Array<FileServerData>;

  public textDocNameUp: string = "DOCUMENTO";
  public textDocName: string = "Documento";
  public textDocNameUpload: string = "Documento Caricato";
  public textDocTitle: string = "Carica Documento";

  public idRichiesta: number = 0;
  public nomeCliente: string = "";
  public codiceCliente: string = "";

  public idWorkflowStep: number = null;
  public indexWorkflowStep: number = null;

  // Deroga Merito
  public derogaMeritoUser: string = '';
  public derogaMeritoDate: Date = null;
  public derogaMeritoNotaId: number = -1;

  public businessName: string = null;
  public emailProspect: string = null;

  public tipoRegistroEmail: string = "";

  public documentId: number = -1;
  public documentName: string = '';

  public statoId: number = -1;
  public statoName: string = '';

  public validDeroga: boolean = false;
  public noteDerogaMerito: string = '';

  public action: string = 'docUpload';
  public exitReload: boolean = false;

  constructor(private prospect: ProspectService,
              private dialogRef: MatDialogRef<DetailProspectComponent>,
              public dialog: MatDialog,
              private common: CommonService,
              private authService: AuthService
            ) { }

  ngOnInit(): void 
  {
    this.common.sendUpdate("showSpinner");

    this.common.getIPAddress().subscribe((res:any)=>
    {  
      this.ipAddress = res.ip;
    });

    if(this.isView)
    {
      switch(this.action)
      {
        case "derMerito":
          this.textDocNameUp = "DEROGA";
          this.textDocName = "Deroga";
          this.textDocNameUpload = "Deroga Caricata";
          this.textDocTitle = "Visualizza Deroga";
          this.tipoRegistroEmail = environment.tipoRegistroEmailDerMerito;
          break;
      }
    }
    else
    {
      switch(this.action)
      {
        case "valContratto":
          this.textDocNameUp = "CONTRATTO";
          this.textDocName = "Contratto";
          this.textDocNameUpload = "Contratto Caricato";
          this.textDocTitle = "Carica Contratto";
          this.tipoRegistroEmail = environment.tipoRegistroEmailContratto;
          break;
        case "derMerito":
          this.textDocNameUp = "DEROGA";
          this.textDocName = "Deroga";
          this.textDocNameUpload = "Deroga Caricata";
          this.textDocTitle = "Carica Deroga";
          this.tipoRegistroEmail = environment.tipoRegistroEmailDerMerito;
          break;
        case "derContratto":
          this.textDocNameUp = "DEROGA";
          this.textDocName = "Deroga";
          this.textDocNameUpload = "Deroga Caricata";
          this.textDocTitle = "Carica Deroga";
          this.tipoRegistroEmail = environment.tipoRegistroEmailDerContratto;
          break;
        case "docUpload":
          this.textDocNameUp = "DOCUMENTO";
          this.textDocName = "Documento";
          this.textDocNameUpload = "Documento Caricato";
          this.textDocTitle = "Carica Documento";
          break;
        case "sottGaranzie":
          this.textDocNameUp = "SOTTOSCRIZIONE";
          this.textDocName = "Sottoscrizione Garanzie";
          this.textDocNameUpload = "Sottoscrizione Caricata";
          this.textDocTitle = "Carica Sottoscrizione";
          break;
      }
    }

    this.user = this.authService.getUser();
    let authToken: string = this.authService.getAuthToken();
    
    this.listCanaliSubscription = this.prospect.getCanaliGaranziaList(authToken).subscribe(res => 
    {
      this.listCanaliGaranzie = res;

      this.listSubscription = this.prospect.getTipologieDocumentiList(authToken).subscribe(res =>
      {
        if(this.action == "valContratto")
        {
          this.listTipiDocumenti = res as Array<ProspectDocumentoTipo>;
          // console.log(this.listTipiDocumenti);

          this.listTipiDocumenti.forEach(element => {
            if(element.tipologia == "Contratto")
            {
              this.tipologiaDocumento = element.id;
              this.tipologiaDocumentoDesc = "Contratto";
            }
          });
        }

        if(this.action == "derContratto")
        {
          this.listTipiDocumenti = res as Array<ProspectDocumentoTipo>;
          // console.log(this.listTipiDocumenti);

          this.listTipiDocumenti.forEach(element => {
            if(element.tipologia == "Deroga Garanzie")
            {
              this.tipologiaDocumento = element.id;
              this.tipologiaDocumentoDesc = "Deroga Garanzie";
            }
          });
        }

        if(this.action == "derMerito")
        {
          this.listTipiDocumenti = res as Array<ProspectDocumentoTipo>;
          // console.log(this.listTipiDocumenti);

          this.listTipiDocumenti.forEach(element => {
            if(element.tipologia == "Deroga Merito")
            {
              this.tipologiaDocumento = element.id;
              this.tipologiaDocumentoDesc = "Deroga Merito";
            }
          });
        }
        
        if(this.action == "docUpload")
        {
          let appListType: Array<ProspectDocumentoTipo> = res as Array<ProspectDocumentoTipo>;
          this.listTipiDocumenti = new Array<ProspectDocumentoTipo>();

          appListType.forEach(element => {
            if(element.tipologia != "Contratto" && element.tipologia != "Sottoscrizione Garanzie")
            {   
              this.listTipiDocumenti.push(element);
            }
          });
          
          // console.log(this.listTipiDocumenti);
        }

        if(this.action == "sottGaranzie")
        {
          this.listTipiDocumenti = res as Array<ProspectDocumentoTipo>;
          // console.log(this.listTipiDocumenti);

          this.listTipiDocumenti.forEach(element => {
            if(element.tipologia == "Sottoscrizione Garanzie")
            {
              this.tipologiaDocumento = element.id;
              this.tipologiaDocumentoDesc = "Sottoscrizione Garanzie";
            }
          });
        }
      },
      error => {
        
        this.common.sendUpdate("hideSpinner");
        this.common.sendUpdate("showAlertDanger", error.message);
      });
    },
    error => {
      
      this.common.sendUpdate("hideSpinner");
      this.common.sendUpdate("showAlertDanger", error.message);
    });

    this.common.sendUpdate("hideSpinner");
  }

  changeTipo(event: any)
  {
    // console.log(event.value);
    this.listTipiDocumenti.forEach(element => {
      if(element.id == event.value)
      {   
        this.tipologiaDocumentoDesc = element.tipologia;
        this.tipologiaDocumento = element.id;
      }
    });
  }

  changeCanale(event: any)
  {
    // console.log(event.value);
    this.listCanaliGaranzie.forEach(element => {
      if(element.id == event.value)
      {   
        this.canaleGaranziaDesc = element.nome;
        this.canaleGaranzia = element.id;
      }
    });
  }

  handleFileInput(event: any)
  {
    // console.log(this.tipologiaDocumento);
    // console.log(this.tipologiaDocumentoDesc);

    let files = event.target.files[0];
    if(files)
    {
      this.reader.readAsDataURL(files);
  
      this.reader.onload = () =>
      {
        let fileData: string = this.reader.result.toString();
        let fileBlob = fileData.substring(fileData.indexOf(',') + 1);
  
        if(this.tipologiaDocumentoDesc == "")
        {
          this.listTipiDocumenti.forEach(element => {
            if(element.id == this.tipologiaDocumento)
            {   
              this.tipologiaDocumentoDesc = element.tipologia;
            }
          });
        }
    
        // console.log(fileBlob);
        // console.log(files.type);
  
        this.file_full_name = files.name;
        this.fileUploadRequest = new ProspectDocUploadRequest (
                                                        this.documentId,
                                                        this.fileDescription,
                                                        this.file_full_name,
                                                        this.idRichiesta,
                                                        this.tipologiaDocumento,
                                                        this.tipologiaDocumentoDesc,
                                                        this.user.name,
                                                        fileBlob,
                                                        files.type,
                                                        this.file_full_name.substring(this.file_full_name.lastIndexOf('.')),
                                                        this.nomeCliente,
                                                        this.codiceCliente,
                                                        this.idWorkflowStep,
                                                        this.businessName,
                                                        this.emailProspect,
                                                        this.canaleGaranzia,
                                                        this.tipoRegistroEmail,
                                                        this.ipAddress,
                                                        this.user.id,
                                                        this.statoId,
                                                        this.statoName,
                                                        -1,
                                                        this.noteDerogaMerito);
      }
    }
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
                      + ' title="' + item.documentName + '"'
                      + ' src="data:application/pdf;base64,'
                      + encodeURIComponent(item.bytes)
                      + '"></embed>';

    var printWindow = window.open (item.documentName, "PDF", winparams);
    printWindow.document.write(htmlPop);
    printWindow.document.title = item.documentName;
    printWindow.name = item.documentName;
  }

  changeNoteDerogaMerito(event: any)
  {
    this.noteDerogaMerito = event.target.value;
    if(this.noteDerogaMerito.length > 3)
    {
      this.validDeroga = true;
    }
  }

  salvaDocumento()
  {
    let message: string = "Sei sicuro di voler caricare il documento?";

    switch (this.action) {
      case "valContratto":
        message = "Il caricamento del contratto sposterà l'iter approvativo allo step successivo, vuoi proseguire?";
        break;
      case "derMerito":
        message = "Il caricamento della deroga sposterà l'iter approvativo allo step successivo, vuoi proseguire?";
        break;
      case "derContratto":
        message = "Sei sicuro di voler caricare la deroga al contratto?";
        break;
      case "sottGaranzie":
        message = "Sei sicuro di voler caricare una nuova sottoscrizione garanzie?";
        break;
    }

    const dialogConfig = new MatDialogConfig()
    dialogConfig.id = 'confirm-message-modal'
    dialogConfig.height = 'fit-content'
    dialogConfig.width = '34rem';

    const modalDialog = this.dialog.open(ConfirmMessageComponent, dialogConfig);
    modalDialog.componentInstance.messageText = message;

    modalDialog.afterClosed().subscribe(res => 
    {
      if (res == true)
      {
        this.common.sendUpdate("showSpinner");

        if(!this.fileUploadRequest)
        {
          this.fileUploadRequest = new ProspectDocUploadRequest (
                                                          this.documentId,
                                                          this.fileDescription,
                                                          this.file_full_name,
                                                          this.idRichiesta,
                                                          this.tipologiaDocumento,
                                                          this.tipologiaDocumentoDesc,
                                                          this.user.name,
                                                          null,
                                                          "",
                                                          this.file_full_name.substring(this.file_full_name.lastIndexOf('.')),
                                                          this.nomeCliente,
                                                          this.codiceCliente,
                                                          this.idWorkflowStep,
                                                          this.businessName,
                                                          this.emailProspect,
                                                          this.canaleGaranzia,
                                                          this.tipoRegistroEmail,
                                                          this.ipAddress,
                                                          this.user.id,
                                                          this.statoId,
                                                          this.statoName,
                                                          -1,
                                                          this.noteDerogaMerito);
        }
        else
        {
          this.fileUploadRequest.fileDescription = this.fileDescription;
        }

        // console.log(this.fileUploadRequest);

        let authToken: string = this.authService.getAuthToken();

        if(this.action == "docUpload")
        {
          this.prospect.saveProspectDocument(authToken, this.fileUploadRequest).subscribe(
            res =>
            {
                if (res != null)
                {
                  this.exitReload = true;
                  this.documentName = this.fileUploadRequest.fileDescription;
                  this.close();
                }
                this.common.sendUpdate("hideSpinner");
            },
            err => {
                this.common.sendUpdate("hideSpinner");
                this.errorMessage = "Errore nel salvataggio del documento";
                console.log(err)
            }
          );
        }
        if(this.action == "valContratto")
        {
          let sendRequest: boolean = true;

          if(this.businessName == "PAT" || this.businessName == "ZC")
          {
            if(this.canaleGaranzia <= 0)
            {
              sendRequest = false;
              this.errorMessage = "Selezionare il canale garanzia";
            }
            else
            {
              this.fileUploadRequest.idCanaleGaranzia = this.canaleGaranzia;
            }
          }

          if(sendRequest == true)
          {
            // console.log(this.fileUploadRequest);
            this.prospect.saveValutazioneStep3(authToken, this.fileUploadRequest).subscribe(
              res =>
              {
                  if (res.result)
                  {
                    this.exitReload = true;
                    this.documentId = res.savedDocumentId;
                    this.documentName = this.fileUploadRequest.fileDescription;
                    this.idWorkflowStep = res.nextWorkFlowStepId;
                    this.close();
                  }
                  this.common.sendUpdate("hideSpinner");
              },
              err => {
                  this.common.sendUpdate("hideSpinner");
                  this.errorMessage = "Errore nel salvataggio del documento";
                  console.log(err)
              }
            );
          }
          else
          {
            this.common.sendUpdate("hideSpinner");
          }
        }
        
        if(this.action == "derContratto")
        {
          console.log(this.fileUploadRequest);
          this.prospect.saveDerogaContratto(authToken, this.fileUploadRequest).subscribe(
            res =>
            {
                if (res.result)
                {
                  this.exitReload = true;
                  this.documentId = res.savedDocumentId;
                  this.documentName = this.fileUploadRequest.fileDescription;
                  this.idWorkflowStep = res.nextWorkFlowStepId;
                  this.close();
                }
                this.common.sendUpdate("hideSpinner");
            },
            err => {
                this.common.sendUpdate("hideSpinner");
                this.errorMessage = "Errore nel salvataggio della deroga";
                console.log(err)
            }
          );
        }
        if(this.action == "derMerito")
        {
          if(!this.fileUploadRequest.statoId)
          {
            this.fileUploadRequest.statoId = this.statoId;
          }

          if(!this.fileUploadRequest.statoName)
          {
            this.fileUploadRequest.statoName = this.statoName;
          }

          if(!this.fileUploadRequest.notaId)
          {
            this.fileUploadRequest.notaId = -1;
          }

          if(!this.fileUploadRequest.notaValutazione)
          {
            this.fileUploadRequest.notaValutazione = this.noteDerogaMerito;
          }

          console.log(this.fileUploadRequest);
          this.prospect.saveDerogaMerito(authToken, this.fileUploadRequest).subscribe(
            res =>
            {
                if (res.result)
                {
                  this.exitReload = true;
                  this.documentId = res.derogaMeritoId;
                  this.documentName = this.fileUploadRequest.fileDescription;

                  this.derogaMeritoDate = res.derogaMeritoDate;
                  this.derogaMeritoUser = res.derogaMeritoUser;
                  this.derogaMeritoNotaId = res.derogaMeritoNotaId;

                  this.idWorkflowStep = res.nextWorkFlowStepId;
                  this.indexWorkflowStep = res.nextWorkFlowStepIndex;

                  console.log(res);
                  this.close();
                }
                this.common.sendUpdate("hideSpinner");
            },
            err => {
                this.common.sendUpdate("hideSpinner");
                this.errorMessage = "Errore nel salvataggio della deroga";
                console.log(err)
            }
          );
        }
        if(this.action == "sottGaranzie")
        {
          this.prospect.saveProspectDocument(authToken, this.fileUploadRequest).subscribe(
            res =>
            {
              let result = res as number;
              this.common.sendUpdate("hideSpinner");
                if (result > 0)
                {
                  this.exitReload = true;
                  this.documentId = result;
                  this.documentName = this.fileUploadRequest.fileDescription;
                  this.close();
                }
            },
            err => {
                this.common.sendUpdate("hideSpinner");
                this.errorMessage = "Errore nel salvataggio del documento";
                console.log(err)
            }
          );
        }
      }
    });
    
    // this.common.sendUpdate("hideSpinner");
  }

  close() {
    this.dialogRef.close(this.exitReload);
  }

  ngOnDestroy(): void 
  {
    ///qui viene distrutto il componente
    if(this.listSubscription)
      this.listSubscription.unsubscribe();

    if(this.listCanaliSubscription)
      this.listCanaliSubscription.unsubscribe();
  }

}
