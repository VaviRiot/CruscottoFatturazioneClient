import { trigger, state, style, transition, animate } from '@angular/animations';
import { ChangeDetectorRef, Component, EventEmitter, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { WizardFormComponent } from 'app/wizardform/wizard-form.component';
import { AuthService } from 'app/shared/Service/AuthService/auth.service';
import { ProspectService } from 'app/shared/Service/Prospect/prospect.service';
import * as Chartist from 'chartist';
import { Subscription } from 'rxjs';
import { CommonService } from 'app/shared/Service/Common/common.service';
import { ProspectComplete } from 'app/models/ProspectComplete';
import { DocumentUploadComponent } from 'app/modals/document_upload/document_upload.component';
import { MatDialog, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProspectDocumento } from 'app/models/ProspectDocumento';
import { ProspectGaranzia } from 'app/models/ProspectGaranzia';
import { ViewPdfComponent } from 'app/modals/view_pdf/view_pdf.component';
import { DomSanitizer } from '@angular/platform-browser';
import { FileServerData } from 'app/models/FileServerData';
import { ValutazioneStep1Request } from 'app/models/Request/ValutazioneStep1Request';
import { CategoriaRichieste } from 'app/models/CategoriaRichieste';
import { User } from 'app/models/User';
import { DatePipe } from '@angular/common';
import { StatoRichieste } from 'app/models/StatoRichieste';
import { ValutazioneStep2Request } from 'app/models/Request/ValutazioneStep2Request';
import { ProspectDocumentoTipo } from 'app/models/ProspectDocumentoTipo';
import { alertcenter } from 'googleapis/build/src/apis/alertcenter';
import { environment } from 'environments/environment';
import { ValutazioneStep4Request } from 'app/models/Request/ValutazioneStep4Request';
import { ValutazioneStep5Request } from 'app/models/Request/ValutazioneStep5Request';
import { ProspectGaranziaStato } from 'app/models/ProspectGaranziaStato';
import { ViewMessageComponent } from 'app/modals/view_message/view_message.component';
import { ViewMailComponent } from 'app/modals/view_mail/view_mail.component';
import { EmailMessageRequest } from 'app/models/Request/EmailMessageRequest';
import { EmailMessage } from 'app/models/EmailMessage';
import { TimelineComponent } from 'app/components/timeline/timeline.component';
import { ViewSaleTirComponent } from 'app/modals/view_sale_tir/view_sale_tir.component';
import { InternalMessage } from 'app/models/InternalMessage';
import { ProspectAuthStepRequest } from 'app/models/Request/ProspectAuthStepRequest';
import { CanaleGaranzia } from 'app/models/CanaleGaranzia';
import { PresaInCaricoRequest } from 'app/models/Request/PresaInCaricoRequest';
import { ConfirmMessageComponent } from 'app/modals/confirm_message/confirm_message.component';
import { _ } from 'ajv';
import { DerogaMeritoResponse } from 'app/models/Response/DerogaMeritoResponse';

@Component({
  selector: 'app-detail',
  templateUrl: './detail_prospect.component.html',
  styleUrls: ['./detail_prospect.component.css'],
  animations: [
    trigger('pictureChange', [
      state('shown', style({ opacity: 1 })),
      state('hidden', style({ opacity: 0 })),
      transition('shown => hidden', animate('100ms')),
      transition('hidden => shown', animate('3000ms')),
    ])
  ]
})
export class DetailProspectComponent implements OnInit {
  public profileForm: FormGroup;
  public wizardPictureUrl = 'assets/img/default-avatar.png';
  public wizardPictureUrlState = 'shown';

  //Wizard Item Ref
  @ViewChild(WizardFormComponent, { static: false }) wizardFormComponent: WizardFormComponent;

  //Timeline Component
  @ViewChild(TimelineComponent, { static: false }) timelineComponent: TimelineComponent;
  
  // Sidebar manage
  public sidebarVisible: boolean = false;

  public authStep1: boolean = false;
  public authStep2: boolean = false;
  public authStep3: boolean = false;
  public authStep4: boolean = false;
  public authStep5: boolean = false;

  // Init Param
  public action: string = "";
  public id: number = -1;
  public codiceCliente: string = "";
  public business: string = "";
  public stepIndex: number = -1;

  private ipAddress: string = "";

  public user: User;
  public roleId: number;

  private myDocumentSubscription: Subscription;
  
  private authSubscription: Subscription;

  private mySubscription: Subscription;
  public prospectObj = new ProspectComplete(true, "");

  // Default Prospect Summary
  public defNumGaranziePrestate: string = '-';
  public defTotaleGaranziePrestate: string = '0';

  public defNumGaranzieScadenze: string = '-';
  public defTotaleGaranzieScadenze: string = '0';

  public defNumGaranzieDeroga: string = '-';
  public defTotaleGaranzieDeroga: string = '0';

  public defNumPrestatoDovuto: string = '0';
  public defTotalePrestatoDovuto: string = '0';

  // Default Prospect Anagrafica
  public defCliente: string = '';
  public defNome: string = '';
  public defBusiness: string = '';
  public defLegalMail: string = '';

  public defCodiceSAP: string = '';
  public defDescrizioneSocieta: string = '';

  public defIdTipologiaPartner: number = -1;
  public defTipologiaPartner: string = '';

  public defCodiceSala: string = '';
  public defCodiceTir: string = '';
  public defNumeroMacchineSala: string = "-";

  public defNumeroSale: string = "-";
  public defNumeroTir: string = "-";
  public defNumeroMacchine: string = "-";

  public defReferenteArea: string = '';
  public defMailReferente: string = '';
  public defIndirizzo: string = '';
  public defTelefonoReferente: string = '';
  public defCodiceFiscaleReferente: string = '';
  public defPartitaIva: string = '';

  public listGaranzieValutate?: Array<ProspectGaranzia>;

  // PRESA IN CARICO
  public defUtentePresaCarico: string = '';
  public defUtenteIdPresaCarico: number = 0;
  public defDataPresaCarico: Date = null;

  // Valutazione
  // STEP 1
  public valutazioneTitle: string = '';
  public valutazioneSubTitle: string = '';

  public defPresenzaSocietaCollegate: boolean = false;
  public defSocietaCollegate: string = '';

  public defPresenzaEventiNegativi: boolean = false;
  public defEventiNegativi: string = '';

  public defPresenzaUltimoBilancio: boolean = false;
  public defAnniBilancio: number;

  public defPresenzaEsitiPregressi: boolean = false;

  public defCategoriaRichiesta = new CategoriaRichieste(-1, '', null, null, null, null);
  
  private listCategorieSubscription: Subscription;  
  public listCategorieRichieste: Array<CategoriaRichieste>;
  
  private listStatiSubscription: Subscription;  
  public listStatiRichieste: Array<StatoRichieste>;

  private listTipiDocumentiSubscription: Subscription;
  public listTipiDocumenti: Array<ProspectDocumentoTipo>;

  private listCanaliSubscription: Subscription;

  private listRoleMeritoSubscription: Subscription;

  //STEP 2
  public defStatoValutazioneMerito: string = "Negativo";
  public defIdNoteValutazioneMerito: number = -1;
  public defNoteValutazioneMerito: string = "";

  public defDerogaValutazioneMerito: boolean = false;
  
  public defDerogaMeritoId: number = -1;
  public defDerogaMeritoName: string = '';

  public defDerogaMeritoUser: string = '';
  public defDerogaMeritoDate: Date = null;
  public defDerogaMeritoNotaId: number = -1;

  // Viene salvato sul server e serve a bloccare la scheda in caso di esito negativo
  public defValutazioneMeritoAttivo: boolean = false;

  //Non viene salvato sul server e serve a bloccare la scheda in caso di esito negativo o altra doc
  public defAfterCustomSave: boolean = false;

  public defDestinatariAltraDoc: string = "";
  public defOggettoAltraDoc: string = "";
  public defTestoAltraDoc: string = "";

  // Search Field
  public searchDocValue: string = '';
  public searchGaranzieValue: string = '';

  public workflow_step_id: number = null;
  
  public defWorkflowStepId: number = null;
  public defWorkflowStepIndex: number = 1;

  //STEP 3
  public defValutazioneContrattoId: number = null;
  public defValutazioneContrattoName: string = '';
  
  public defDerogaContrattoId: number = null;
  public defDerogaContrattoName: string = '';

  // STEP 4
  public defCanaleGaranziaSottoscrizione: number = 0; 
  public listCanaliGaranzie: Array<CanaleGaranzia>;
  public listSottoscrizioneGaranzieDoc?: Array<ProspectDocumento>;

  //STEP 5
  public listStatiGaranzie: Array<ProspectGaranziaStato>;
  public listGaranzieValutazione?: Array<ProspectGaranzia>;
  public defStatoValutazioneGaranzia: string = "Rifiutato";  
  public defPresenzaSideLetterValutazione: boolean = false;
  public defPresenzaDerogaValutazione: boolean = false;

  public defIdNoteValutazioneGaranzia: number = -1;
  public defNoteValutazioneGaranzia: string = "";

  public defRichiestaSalvata: boolean = false;

  // TIMELINE
  public defClienteAttivo: boolean = false;

  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService,
    private common: CommonService,
    private prospectService: ProspectService,
    public dialog: MatDialog,
    protected _sanitizer: DomSanitizer,
    private cd: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) 
    public data?: {
      id: number,
      action: string,
      codiceCliente: string,
      business: string,
      stepIndex: number,
      modal: boolean
    })
  {
      this.createForm();

      let isModal = data.modal;
  }

  ngOnInit()
  {
    this.common.getIPAddress().subscribe((res:any)=>
    {
      this.ipAddress = res.ip;
    });

    this.loadCompleteProspect();
    
    // Da togliere
    // this.wizardFormComponent.goToStepIndex(5);
    // this.showStep2NextButton();
  }

  loadCompleteProspect()
  {
    this.common.sendUpdate("showSpinner");

    this.user = this.authService.getUser();

    if(this.data && this.data.modal == true)
    {
      this.action = this.data.action;
      this.id = +this.data.id;
      this.codiceCliente = this.data.codiceCliente;
      this.business = this.data.business;
      this.stepIndex = +this.data.stepIndex;
    }
    else
    {
      this.action = this.route.snapshot.paramMap.get('action');
      this.id = +this.route.snapshot.paramMap.get('id');
      this.codiceCliente = this.route.snapshot.paramMap.get('codiceCliente');
      this.business = this.route.snapshot.paramMap.get('business');
      this.stepIndex = +this.route.snapshot.paramMap.get('stepIndex');
    }

    let authToken: string = this.authService.getAuthToken();
    
    if(this.user.ruoloUtente)
    {
      this.roleId = this.authService.getUser().ruoloUtente.id;
    }

    this.authSubscription = this.prospectService.getAuthWorkflowStepList(authToken, new ProspectAuthStepRequest(this.roleId, this.business)).subscribe(res =>
    {
      res.forEach(authWorkFlow => {
        switch(authWorkFlow.tabIndex)
        {
          case 1:
            this.authStep1 = true;
            break;
          case 2:
            this.authStep2 = true;
            break;
          case 3:
            this.authStep3 = true;
            break;
          case 4:
            this.authStep4 = true;
            break;
          case 5:
            this.authStep5 = true;
            break;
        }
      });

      this.mySubscription = this.prospectService.getProspectComplete(authToken, this.id, this.codiceCliente, this.business).subscribe(res =>
      {
        this.prospectObj = res as ProspectComplete;

        console.log(this.prospectObj);

        if(this.prospectObj)
        {
          if(this.prospectObj.result === false)
          {    
            this.common.sendUpdate("hideSpinner");
            this.common.sendUpdate("showAlertDanger", this.prospectObj.resultMessage);
          }
          else
          {

            // Top Summary
            if (this.prospectObj.topSummary) {
              if (this.prospectObj.topSummary.numGaranziePrestate) {
                this.defNumGaranziePrestate = this.prospectObj.topSummary.numGaranziePrestate.toString();
              }
              if (this.prospectObj.topSummary.totaleGaranziePrestate) {
                this.defTotaleGaranziePrestate = this.prospectObj.topSummary.totaleGaranziePrestate.toString();
              }
    
              if (this.prospectObj.topSummary.numGaranzieScadenze) {
                this.defNumGaranzieScadenze = this.prospectObj.topSummary.numGaranzieScadenze.toString();
              }
              if (this.prospectObj.topSummary.totaleGaranzieScadenze) {
                this.defTotaleGaranzieScadenze = this.prospectObj.topSummary.totaleGaranzieScadenze.toString();
              }
    
              if (this.prospectObj.topSummary.numGaranzieDeroga) {
                this.defNumGaranzieDeroga = this.prospectObj.topSummary.numGaranzieDeroga.toString();
              }
              if (this.prospectObj.topSummary.totaleGaranzieDeroga) {
                this.defTotaleGaranzieDeroga = this.prospectObj.topSummary.totaleGaranzieDeroga.toString();
              }
    
              if (this.prospectObj.topSummary.numPrestatoDovuto) {
                this.defNumPrestatoDovuto = this.prospectObj.topSummary.numPrestatoDovuto.toString();
              }
              if (this.prospectObj.topSummary.totalePrestatoDovuto) {
                this.defTotalePrestatoDovuto = this.prospectObj.topSummary.totalePrestatoDovuto.toString();
              }
            }
    
            // Prospect Anagrafica
            if (this.prospectObj.anagrafica) {
              if (this.prospectObj.anagrafica.cliente) {
                this.defCliente = this.prospectObj.anagrafica.cliente;
              }
              if (this.prospectObj.anagrafica.nome) {
                this.defNome = this.prospectObj.anagrafica.nome;
              }
              if (this.prospectObj.anagrafica.business) {
                this.defBusiness = this.prospectObj.anagrafica.business;
              }
              if (this.prospectObj.anagrafica.legalMail) {
                this.defLegalMail = this.prospectObj.anagrafica.legalMail;
              }
    
              // "XXXXXXXXXXXXX - Prospect 1"
              let appValutazioneTitle: string = this.defCliente + " - " + this.defNome + " [" + this.defBusiness + "]";
              this.valutazioneTitle = appValutazioneTitle;
    
              if (this.prospectObj.anagrafica.codiceSAP) {
                this.defCodiceSAP = this.prospectObj.anagrafica.codiceSAP;
              }
              if (this.prospectObj.anagrafica.descrizioneSocieta) {
                this.defDescrizioneSocieta = this.prospectObj.anagrafica.descrizioneSocieta;
              }
    
              if (this.prospectObj.anagrafica.idTipologiaPartner) {
                this.defIdTipologiaPartner = this.prospectObj.anagrafica.idTipologiaPartner;
              }
              if (this.prospectObj.anagrafica.tipologiaPartner) {
                this.defTipologiaPartner = this.prospectObj.anagrafica.tipologiaPartner;
              }
              if (this.prospectObj.anagrafica.codiceSala) {
                this.defCodiceSala = this.prospectObj.anagrafica.codiceSala;
              }
              if (this.prospectObj.anagrafica.codiceTir) {
                this.defCodiceTir = this.prospectObj.anagrafica.codiceTir;
              }
              if (this.prospectObj.anagrafica.numeroMacchineSala) {
                this.defNumeroMacchineSala = this.prospectObj.anagrafica.numeroMacchineSala.toString();
              }
    
              // Totali
              if (this.prospectObj.anagrafica.totNumeroSale) {
                this.defNumeroSale = this.prospectObj.anagrafica.totNumeroSale.toString();
              }
              if (this.prospectObj.anagrafica.totNumeroTir) {
                this.defNumeroTir = this.prospectObj.anagrafica.totNumeroTir.toString();
              }
              if (this.prospectObj.anagrafica.totNumeroMacchine) {
                this.defNumeroMacchine = this.prospectObj.anagrafica.totNumeroMacchine.toString();
              }
    
              // Custom Value
              if (this.prospectObj.anagrafica.referenteArea) {
                this.defReferenteArea = this.prospectObj.anagrafica.referenteArea;
              }
              if (this.prospectObj.anagrafica.mailReferente) {
                this.defMailReferente = this.prospectObj.anagrafica.mailReferente;
              }
              if (this.prospectObj.anagrafica.indirizzo) {
                this.defIndirizzo = this.prospectObj.anagrafica.indirizzo;
              }
              if (this.prospectObj.anagrafica.telefonoReferente) {
                this.defTelefonoReferente = this.prospectObj.anagrafica.telefonoReferente;
              }
              if (this.prospectObj.anagrafica.codiceFiscaleReferente) {
                this.defCodiceFiscaleReferente = this.prospectObj.anagrafica.codiceFiscaleReferente;
              }
              if (this.prospectObj.anagrafica.partitaIva) {
                this.defPartitaIva = this.prospectObj.anagrafica.partitaIva;
              }
            }
    
            // Lista Garanzie Valutate
            if (this.prospectObj.listGaranzie)
            {
              this.listGaranzieValutate = this.prospectObj.listGaranzie;
    
              // console.log(this.listGaranzieValutate);
            }
    
            // Valutazione
    
            if (this.prospectObj.richiesta)
            {
              // STEP 1
              const datepipe: DatePipe = new DatePipe('it-IT')
              let appValutazioneSubTitle: string = "";
              if (this.prospectObj.richiesta.lastModDate) {
                let formattedDate = datepipe.transform(this.prospectObj.richiesta.lastModDate, 'dd/MM/YYYY HH:mm:ss')
                appValutazioneSubTitle = "ultimo aggiornamento il " + formattedDate;
                if (this.prospectObj.richiesta.lastModUser) {
                  appValutazioneSubTitle += " da " + this.prospectObj.richiesta.lastModUser;
                }
              }
    
              if (appValutazioneSubTitle == "") {
                if (this.prospectObj.richiesta.createDate) {
                  let formattedDate = datepipe.transform(this.prospectObj.richiesta.createDate, 'dd/MM/YYYY HH:mm:ss')
                  appValutazioneSubTitle = "creato il " + formattedDate;
                  if (this.prospectObj.richiesta.lastModUser) {
                    appValutazioneSubTitle += " da " + this.prospectObj.richiesta.createDate;
                  }
                }
              }
    
              // PRESA IN CARICO
              if(this.prospectObj.richiesta.workUserId)
              {
                this.defUtenteIdPresaCarico = this.prospectObj.richiesta.workUserId;
              }
              
              if(this.prospectObj.richiesta.workUser)
              {
                this.defUtentePresaCarico = this.prospectObj.richiesta.workUser;
              }
              
              if(this.prospectObj.richiesta.workDate)
              {
                this.defDataPresaCarico = this.prospectObj.richiesta.workDate;
              }
    
              this.valutazioneSubTitle = appValutazioneSubTitle;
    
              if(this.prospectObj.richiesta.workflowStep)
              {
                this.defWorkflowStepId = this.prospectObj.richiesta.workflowStep.id;
                this.defWorkflowStepIndex = this.prospectObj.richiesta.workflowStep.tabIndex;
              }
    
              if (this.prospectObj.richiesta.presenzaSocietaCollegate) {
                this.defPresenzaSocietaCollegate = this.prospectObj.richiesta.presenzaSocietaCollegate;
              }
              if (this.prospectObj.richiesta.societaCollegate) {
                this.defSocietaCollegate = this.prospectObj.richiesta.societaCollegate;
              }
    
              if (this.prospectObj.richiesta.presenzaEventiNegativi) {
                this.defPresenzaEventiNegativi = this.prospectObj.richiesta.presenzaEventiNegativi;
              }
              if (this.prospectObj.richiesta.eventiNegativi) {
                this.defEventiNegativi = this.prospectObj.richiesta.eventiNegativi;
              }
    
              if (this.prospectObj.richiesta.presenzaUltimoBilancio) {
                this.defPresenzaUltimoBilancio = this.prospectObj.richiesta.presenzaUltimoBilancio;
              }
              if (this.prospectObj.richiesta.annoBilancio) {
                this.defAnniBilancio = this.prospectObj.richiesta.annoBilancio;
              }
    
              if (this.prospectObj.richiesta.presenzaEsitiPregressi) {
                this.defPresenzaEsitiPregressi = this.prospectObj.richiesta.presenzaEsitiPregressi;
              }
    
              if(this.prospectObj.richiesta.categoriaRichieste)
              {
                this.defCategoriaRichiesta  = this.prospectObj.richiesta.categoriaRichieste;
              }
              
              // STEP 2
              if(this.prospectObj.richiesta.derogaMeritoId)
              {
                this.defDerogaMeritoId = this.prospectObj.richiesta.derogaMeritoId;
              }
              
              if(this.prospectObj.richiesta.derogaMeritoUser)
              {
                this.defDerogaMeritoUser = this.prospectObj.richiesta.derogaMeritoUser;
              }
              
              if(this.prospectObj.richiesta.derogaMeritoDate)
              {
                this.defDerogaMeritoDate = this.prospectObj.richiesta.derogaMeritoDate;
              }
    
              if(this.prospectObj.richiesta.derogaMeritoNotaId)
              {
                this.defDerogaMeritoNotaId = this.prospectObj.richiesta.derogaMeritoNotaId;
              }
    
              if (this.prospectObj.richiesta.statoRichieste)
              {
                if (this.prospectObj.richiesta.statoRichieste.nome)
                {
                  this.defStatoValutazioneMerito = this.prospectObj.richiesta.statoRichieste.nome;

                  let loadTimeline: boolean = false;
    
                  if(this.prospectObj.richiesta.statoRichieste.nome == environment.prospectStatoAttivo)
                  {
                    loadTimeline = true;
                    this.defClienteAttivo = true;    
                  }

                  if(this.data && this.data.modal == true)
                  {
                    loadTimeline = true;
                  }

                  if(loadTimeline == true)
                  {                    
                    this.loadTimelineCliente();
                  }
                }
              }
    
              if(this.user.ruoloUtente)
              {
                this.listRoleMeritoSubscription = this.prospectService.getAvaiableRolesDerogaMerito(authToken).subscribe(res => 
                  {
                    for (let index = 0; index < res.length; index++) {    
                      if(res[index] == this.user.ruoloUtente.id)
                      {
                        this.defDerogaValutazioneMerito = true;
                        if(this.defWorkflowStepIndex == 2)
                        {
                          this.refreshPrevNextButton(2);
                        }
                      }
                    }
                  },
                  error => {
                    
                    this.common.sendUpdate("hideSpinner");
                    this.common.sendUpdate("showAlertDanger", error.message);
                  }
                );
              }
    
              if(this.prospectObj.richiesta.noteRichiesta)
              {
                this.prospectObj.richiesta.noteRichiesta.forEach(nota =>
                {
                  if(nota.workflow_step_index == 2)
                  {
                    this.defIdNoteValutazioneMerito = nota.id;
                    this.defNoteValutazioneMerito = nota.note;
                  }
                });
              }
    
              // console.log(this.defUtenteIdPresaCarico);
    
              // STEP 5
              this.listCanaliSubscription = this.prospectService.getCanaliGaranziaList(authToken).subscribe(res => 
              {
                this.listCanaliGaranzie = res;
    
                this.listStatiSubscription = this.prospectService.getStatiGaranzieList(authToken).subscribe(res =>
                {
                  this.listStatiGaranzie = res as Array<ProspectGaranziaStato>;
    
                  this.defPresenzaSideLetterValutazione = this.prospectObj.richiesta.sideLetter;
    
                  if(this.prospectObj.richiesta.canaleSottoscrizioneId)
                  {
                    this.defCanaleGaranziaSottoscrizione = this.prospectObj.richiesta.canaleSottoscrizioneId;
                  }
                  else if(this.prospectObj.richiesta.canaleContrattoId)
                  {
                    this.defCanaleGaranziaSottoscrizione = this.prospectObj.richiesta.canaleContrattoId;
                  }
    
                  this.defRichiestaSalvata = this.prospectObj.richiesta.salvata;
    
                  if(this.prospectObj.richiesta.listGaranzieValutazione)
                  {
                    this.listGaranzieValutazione = this.prospectObj.richiesta.listGaranzieValutazione;
    
                    if(this.defWorkflowStepIndex == 5)
                    {
                      this.refreshPrevNextButton(5);
                    }
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
            }
    
            this.listCategorieSubscription = this.prospectService.getTipologieCategorieRichiesteList(authToken).subscribe(res =>
            {        
              this.listCategorieRichieste = res as Array<CategoriaRichieste>;
              // console.log(this.listCategorieRichieste);
    
              this.listStatiSubscription = this.prospectService.getStatiValutazioneList(authToken).subscribe(res =>{
                this.listStatiRichieste = res as Array<StatoRichieste>;
                // console.log(this.listStatiRichieste);
                
                this.listTipiDocumentiSubscription = this.prospectService.getTipologieDocumentiList(authToken).subscribe(res =>{
                  
                  this.listTipiDocumenti = res as Array<ProspectDocumentoTipo>;
                  // console.log(this.listTipiDocumenti);
                  this.listSottoscrizioneGaranzieDoc = new Array<ProspectDocumento>();
    
                  // STEP 3 e STEP 4
                  let idTipoContratto: number = -1;
                  let idTipoSottGaranzie: number = -1;
                  let idTipoDerogaGaranzie: number = -1;
                  let idTipoDerogaMerito: number = -1;
                  this.listTipiDocumenti.forEach(tipoDoc => 
                  {
                    if(tipoDoc.tipologia == "Contratto")
                    {
                      idTipoContratto = tipoDoc.id;
                    }
                    if(tipoDoc.tipologia == "Sottoscrizione Garanzie")
                    {
                      idTipoSottGaranzie = tipoDoc.id;
                    }
                    if(tipoDoc.tipologia == "Deroga Garanzie")
                    {
                      idTipoDerogaGaranzie = tipoDoc.id;
                    }
                    if(tipoDoc.tipologia == "Deroga Merito")
                    {
                      idTipoDerogaMerito = tipoDoc.id;
                    }
                  });
    
                  //console.log(this.prospectObj.listDocumenti);
                  // console.log(idTipoContratto);
                  if(this.prospectObj.listDocumenti && this.prospectObj.listDocumenti.length > 0)
                  {
                    this.prospectObj.listDocumenti.forEach(documentItem =>
                    {
                      // console.log(documentItem.tipoDocumentoId);
                      if(documentItem.tipoDocumentoId == idTipoContratto)
                      {
                        this.defValutazioneContrattoId = documentItem.documentId;
                        this.defValutazioneContrattoName = documentItem.docName;
                      }
      
                      if(documentItem.tipoDocumentoId == idTipoSottGaranzie)
                      {
                        this.listSottoscrizioneGaranzieDoc.push(documentItem);
                      }
                      
                      if(documentItem.tipoDocumentoId == idTipoDerogaGaranzie)
                      {
                        this.defDerogaContrattoId = documentItem.documentId;
                        this.defDerogaContrattoName = documentItem.docName;
                      }
                      
                      if(documentItem.tipoDocumentoId == idTipoDerogaMerito)
                      {
                        this.defDerogaMeritoId = documentItem.documentId;
                        this.defDerogaMeritoName = documentItem.docName;
                      }
                    });
                  }
    
                  //console.log(this.defWorkflowStepIndex);
    
                  if(this.defWorkflowStepIndex == 3)
                  {
                    this.refreshPrevNextButton(3);
                  }
                  
                  //this.wizardFormComponent.activeStep.validStep = true;
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
            },
            error => {
              
              this.common.sendUpdate("hideSpinner");
              this.common.sendUpdate("showAlertDanger", error.message);
            });
            
            if(this.stepIndex && this.defWorkflowStepIndex)
            {
              if(this.stepIndex > 0 && this.defWorkflowStepIndex > 0)
              {
                this.wizardFormComponent.goToStepIndex(this.stepIndex);
              }
            }
            
            if(this.defWorkflowStepIndex)
            {
              if(this.defWorkflowStepIndex > 0)
              {
                this.wizardFormComponent.goToStepIndex(this.defWorkflowStepIndex);
              }
            }
    
            this.common.sendUpdate("hideSpinner");
          }
        }
      },
      error => 
      {
        this.common.sendUpdate("hideSpinner");
        this.common.sendUpdate("showAlertDanger", error.message);
      });
    },
    error => {
      this.common.sendUpdate("hideSpinner");
      this.common.sendUpdate("showAlertDanger", error.message);
    });

    this.cd.detectChanges();
  }


  showUploadDocument(action?: string) {
    const dialogConfig = new MatDialogConfig()
    dialogConfig.id = 'modal-component'
    dialogConfig.height = 'fit-content'
    dialogConfig.width = '1400px';
    dialogConfig.id = 'document-upload-modal';

    const modalDialog = this.dialog.open(DocumentUploadComponent, dialogConfig);

    modalDialog.componentInstance.idRichiesta = this.id;
    modalDialog.componentInstance.action = action;
    modalDialog.componentInstance.isView = false;

    if(action != "docUpload")
    {
      modalDialog.componentInstance.idWorkflowStep = this.defWorkflowStepId;
      modalDialog.componentInstance.nomeCliente = this.prospectObj.anagrafica.nome;
      modalDialog.componentInstance.codiceCliente = this.codiceCliente;
      modalDialog.componentInstance.businessName = this.defBusiness;
      modalDialog.componentInstance.emailProspect = this.defLegalMail;
    }

    if(action == "derMerito")
    {
      let statoId: number;
      this.listStatiRichieste.forEach(element => {
        if(element.nome == this.defStatoValutazioneMerito)
        {
          statoId = element.id;
        }
      });

      modalDialog.componentInstance.statoId = statoId;
      modalDialog.componentInstance.statoName = this.defStatoValutazioneMerito;
    }

    modalDialog.afterClosed().subscribe((exitReload) => {
      if (exitReload)
      {
        if(action == "docUpload")
        {
          this.searchDocValue = "";
          this.filtraDocumenti("");
        }
        if(action == "valContratto")
        {
          this.defValutazioneContrattoId = modalDialog.componentInstance.documentId;
          this.defValutazioneContrattoName = modalDialog.componentInstance.documentName;
          this.defWorkflowStepId = modalDialog.componentInstance.idWorkflowStep;
          this.prospectObj.richiesta.canaleContrattoId = modalDialog.componentInstance.canaleGaranzia;

          if(modalDialog.componentInstance.canaleGaranzia)
          {
            if(modalDialog.componentInstance.canaleGaranzia > 0 && this.defCanaleGaranziaSottoscrizione <= 0)
            {
              this.defCanaleGaranziaSottoscrizione = modalDialog.componentInstance.canaleGaranzia;
            }
          }
          
          this.filtraDocumenti("");

          this.wizardFormComponent.next();
        }
        if(action == "derContratto")
        {
          this.defDerogaContrattoId = modalDialog.componentInstance.documentId;
          this.defDerogaContrattoName = modalDialog.componentInstance.documentName;
          
          this.filtraDocumenti("");
        }
        if(action == "derMerito")
        {
          //Deroga Merito
          this.defDerogaMeritoId = modalDialog.componentInstance.documentId;
          this.defDerogaMeritoName = modalDialog.componentInstance.documentName;

          this.defWorkflowStepId = modalDialog.componentInstance.idWorkflowStep;

          this.defDerogaMeritoUser = modalDialog.componentInstance.derogaMeritoUser;
          this.defDerogaMeritoDate = modalDialog.componentInstance.derogaMeritoDate;
          this.defDerogaMeritoNotaId = modalDialog.componentInstance.derogaMeritoNotaId;
          
          this.filtraDocumenti("");

          // this.refreshPrevNextButton(3);
          this.defWorkflowStepIndex = 3;

          this.wizardFormComponent.next();
        }
        if(action == "sottGaranzie")
        {
          this.filtraDocumentiDaTipo(environment.sottGaranzieDocName);
          this.filtraDocumenti("");
        }
      }
    });
  }

  showDerogaMerito(idRichiesta: number)
  {
    let authToken: string = this.authService.getAuthToken();

    this.prospectService.getDerogaMeritoByRichiestaId(authToken, idRichiesta).subscribe(
      res =>
      {
        let derogaMerito = res as DerogaMeritoResponse;

        const dialogConfig = new MatDialogConfig()
        dialogConfig.id = 'modal-component'
        dialogConfig.height = 'fit-content'
        dialogConfig.width = '1400px';
        dialogConfig.id = 'document-upload-modal';

        const modalDialog = this.dialog.open(DocumentUploadComponent, dialogConfig);

        modalDialog.componentInstance.idRichiesta = idRichiesta;
        modalDialog.componentInstance.action = "derMerito";
        modalDialog.componentInstance.isView = true;
        modalDialog.componentInstance.noteDerogaMerito = derogaMerito.derogaMeritoNota;
        modalDialog.componentInstance.fileList = derogaMerito.derogaDocumentList;

        let fileDescription: string = "";
        if(derogaMerito.derogaDocumentList)
        {
          if(derogaMerito.derogaDocumentList.length > 0)
          {
            let derogaFile: FileServerData  = derogaMerito.derogaDocumentList[0];
            fileDescription = derogaFile.documentName;
          }
        }

        modalDialog.componentInstance.fileDescription = fileDescription;
      },
      err => {
          this.common.sendUpdate("hideSpinner");
          this.common.sendUpdate("showAlertDanger", err.message);
          console.log(err)
      }
    );
  }

  openDetailProspect(businessIn: string, actionIn: string)
  {
    // console.log('work in progress!');

    const dialogConfig = new MatDialogConfig()
    dialogConfig.id = 'modal-component'
    dialogConfig.height = '40rem'
    // dialogConfig.width = '40';
    dialogConfig.id = 'detail-prospect-modal';


    dialogConfig.data = {
      id: this.id,
      action: actionIn,
      codiceCliente :this.codiceCliente,
      business: businessIn,
      stepIndex: 0,
      modal: true
    };

    const modalDialog = this.dialog.open(DetailProspectComponent, dialogConfig);
  }

  closeDetailProspect() {
    this.dialog.closeAll();
  }

  openPopupMailContratto()
  {
    let authToken: string = this.authService.getAuthToken();

    let tipoRegistroEmail: string = "";
    if(this.business == "PAT" || this.business == "ZC")
    {
      tipoRegistroEmail = environment.tipoRegistroEmailCanGar;
    }
    else
    {
      tipoRegistroEmail = environment.tipoRegistroEmailContratto;
    }

    this.prospectService.getEmailByRichiestaId(authToken, new EmailMessageRequest(this.id, this.business, tipoRegistroEmail)).subscribe(
      res =>
      {
        let emailMsg = res as EmailMessage;
        this.openPopupMail(emailMsg);
      },
      err => {
          this.common.sendUpdate("hideSpinner");
          this.common.sendUpdate("showAlertDanger", err.message);
          console.log(err)
      }
    );

  }

  public filtraDocumenti(searchInFilter?: string)
  {
    this.common.sendUpdate("showSpinner");
    let authToken: string = this.authService.getAuthToken();
    let passedSearch: string = "";
    if (searchInFilter) {
      passedSearch = searchInFilter;
    }
    else {
      passedSearch = this.searchDocValue;
    }

    this.myDocumentSubscription = this.prospectService.getProspectDocumentList(authToken, this.id, passedSearch).subscribe(res => {
      this.prospectObj.listDocumenti = res as Array<ProspectDocumento>;

      // console.log(res);
      this.common.sendUpdate("hideSpinner");
    },
      error => {
        // console.log("filtraDocumenti");
        // console.log(error);

        this.common.sendUpdate("hideSpinner");
        this.common.sendUpdate("showAlertDanger", error.message);
      });
  }

  public filtraDocumentiDaTipo(searchInType?: string)
  {
    this.common.sendUpdate("showSpinner");
    let authToken: string = this.authService.getAuthToken();
    let passedSearch: string = "";
    if (searchInType) {
      passedSearch = searchInType;
    }
    else {
      passedSearch = this.searchDocValue;
    }

    this.myDocumentSubscription = this.prospectService.getProspectDocumentListByType(authToken, this.id, passedSearch).subscribe(res => {

      if(searchInType == "Sottoscrizione Garanzie" && this.prospectObj.richiesta)
      {
        this.listSottoscrizioneGaranzieDoc = res as Array<ProspectDocumento>;
      }
      else
      {
        this.prospectObj.listDocumenti = res as Array<ProspectDocumento>;
      }

      // console.log(res);
      this.common.sendUpdate("hideSpinner");
    },
      error => {
        // console.log("filtraDocumenti");
        // console.log(error);

        this.common.sendUpdate("hideSpinner");
        this.common.sendUpdate("showAlertDanger", error.message);
      });
  }

  public filtraGaranzie(searchInFilter?: string) 
  {
    this.common.sendUpdate("showSpinner");
    let authToken: string = this.authService.getAuthToken();
    let passedSearch: string = "";
    if (searchInFilter) {
      passedSearch = searchInFilter;
    }
    else {
      passedSearch = this.searchGaranzieValue;
    }

    this.myDocumentSubscription = this.prospectService.getProspectGaranzieList(authToken, this.id, passedSearch, true).subscribe(res => {
      this.prospectObj.listGaranzie = res as Array<ProspectGaranzia>;

      // console.log(res);
      this.common.sendUpdate("hideSpinner");
    },
      error => {
        // console.log("filtraDocumenti");
        // console.log(error);

        this.common.sendUpdate("hideSpinner");
        this.common.sendUpdate("showAlertDanger", error.message);
      });
  }

  filtraGaranzieValidate_Client()
  {    
    this.common.sendUpdate("showSpinner");

    let searchFilter = this.searchGaranzieValue;

    let appArrayGaranzie = new Array<ProspectGaranzia>();

    this.prospectObj.listGaranzie.forEach(garanzia => {

      // console.log(garanzia);
      // console.log(searchFilter);

      if(garanzia.codice.toUpperCase().indexOf(searchFilter.toUpperCase()) >= 0)
      {
        appArrayGaranzie.push(garanzia);
      }
      else if(garanzia.descrizione.toUpperCase().indexOf(searchFilter.toUpperCase()) >= 0)
      {
        appArrayGaranzie.push(garanzia);
      }
      else if(garanzia.tipologia.toUpperCase().indexOf(searchFilter.toUpperCase()) >= 0)
      {
        appArrayGaranzie.push(garanzia);
      }
      else if(garanzia.protocollo.toUpperCase().indexOf(searchFilter.toUpperCase()) >= 0)
      {
        appArrayGaranzie.push(garanzia);
      }
      else if(garanzia.diritto.toUpperCase().indexOf(searchFilter.toUpperCase()) >= 0)
      {
        appArrayGaranzie.push(garanzia);
      }
    });

    this.listGaranzieValutate = appArrayGaranzie;
    // console.log(this.listGaranzieValutate);

    this.common.sendUpdate("hideSpinner");
  }

  public filtraGaranzieDaValidare(searchInFilter?: string)
  {
    this.common.sendUpdate("showSpinner");
    let authToken: string = this.authService.getAuthToken();
    let passedSearch: string = "";
    if (searchInFilter) {
      passedSearch = searchInFilter;
    }
    else {
      passedSearch = this.searchGaranzieValue;
    }

    this.myDocumentSubscription = this.prospectService.getProspectGaranzieList(authToken, this.id, "", false).subscribe(res => 
    {
      this.listGaranzieValutazione = res as Array<ProspectGaranzia>;

      // console.log(res);
      this.common.sendUpdate("hideSpinner");
    },
      error => {
        // console.log("filtraDocumenti");
        // console.log(error);

        this.common.sendUpdate("hideSpinner");
        this.common.sendUpdate("showAlertDanger", error.message);
      });
  }

  openDocument(document_id: number)
  {
    this.common.sendUpdate("showSpinner");
    let authToken: string = this.authService.getAuthToken();

    this.prospectService.getUploadDocumentData(authToken, document_id).subscribe((response: FileServerData) => {
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

  // VALUTAZIONE
  // STEP 1

  toggleChange(value: boolean, toggle_id: string) {
    // console.log(value);
    //console.log(toggle_id);

    switch (toggle_id) {
      case "societa":
        this.defPresenzaSocietaCollegate = value;
        break;
      case "bilancio":
        this.defPresenzaUltimoBilancio = value;
        break;
      case "negativi":
        this.defPresenzaEventiNegativi = value;
        break;
      case "pregressi":
        this.defPresenzaEsitiPregressi = value;
        break;
      case "deroga":
        this.defPresenzaDerogaValutazione = value;
        break;
      case "sideLetter":
        this.defPresenzaSideLetterValutazione = value;
        break;
    }
  }

  bindInputStep1(event: any)
  {
    // console.log(event.target.id);
    // console.log(event.target.value);
    if(event != null)
    {
      switch(event.target.id)
      {
        case "societaCollegate":
          this.defSocietaCollegate = event.target.value;
        break;
        case "anniBilancio":
          this.defAnniBilancio = event.target.value;
        break;
        case "eventiNegativi":
          this.defEventiNegativi = event.target.value;
        break;
      }
    }
  }

  validaStep1()
  {
    // console.log(this.wizardFormComponent.activeStep.validStep);
    
    if(!this.authStep1 && (!this.defWorkflowStepIndex || this.defWorkflowStepIndex == 1))
    {
      this.wizardFormComponent.activeStep.validStep = false;
      this.common.sendUpdate("showAlertDanger", "Non sei autorizzato a proseguire!");
    }
    else if(!this.defCategoriaRichiesta || !this.defCategoriaRichiesta.id)
    {
      this.wizardFormComponent.activeStep.validStep = false;
      this.common.sendUpdate("showAlertDanger", "Devi selezionare la Categoria per proseguire!");
      // console.log(this.wizardFormComponent.activeStep.validStep);

      return false;
    }
    else
    {
      this.wizardFormComponent.activeStep.validStep = true;
      // console.log(this.wizardFormComponent.activeStep.validStep);

      return true;
    }
  }

  validaStep4()
  {
    // console.log(this.wizardFormComponent.activeStep.validStep);
    
    if(!this.authStep4 && (!this.defWorkflowStepIndex || this.defWorkflowStepIndex <= 4))
    {
      this.wizardFormComponent.activeStep.validStep = false;
      this.common.sendUpdate("showAlertDanger", "Non sei autorizzato a proseguire!");
    }
    else
    {
      this.wizardFormComponent.activeStep.validStep = true;
      // console.log(this.wizardFormComponent.activeStep.validStep);

      return true;
    }
  }

  validaStep5()
  {
    // console.log(this.wizardFormComponent.activeStep.validStep);
    
    if(!this.authStep5)
    {
      this.wizardFormComponent.activeStep.validStep = false;
      this.common.sendUpdate("showAlertDanger", "Non sei autorizzato a proseguire!");
    }
    else
    {
      this.wizardFormComponent.activeStep.validStep = true;
      // console.log(this.wizardFormComponent.activeStep.validStep);

      return true;
    }
  }

  // STEP 2
  toggleValutazione(value: string, toggle_id: string)
  {
    // console.log(value);
    switch (toggle_id) {
      case "Merito":
        this.defStatoValutazioneMerito = value;
        this.refreshPrevNextButton(2);
        this.validaStep2(null);
        
        // console.log(this.defStatoValutazioneMerito);
        break;
      case "Garanzia":
        this.defStatoValutazioneGaranzia = value;

        if(value == 'Con Deroga')
        {
          this.defPresenzaDerogaValutazione = true;
        }
        else
        {
          this.defPresenzaDerogaValutazione = false;
        }
        break;
    }

    // console.log(this.defStatoValutazioneMerito);
    // console.log(this.defWorkflowStepIndex);
    // console.log(this.action);
  }

  validaStep2Message()
  {
    // console.log(this.defDestinatariAltraDoc);
    // console.log(this.defOggettoAltraDoc);
    // console.log(this.defTestoAltraDoc);
    switch(this.defStatoValutazioneMerito)
    {
      case "Altra Documentazione":
        if(this.defDestinatariAltraDoc == "" || this.defOggettoAltraDoc == "" || this.defTestoAltraDoc == "")
        {
          this.common.sendUpdate("showAlertDanger", "Popolare tutti i campi relativi all'invio email altra documentazione!");
        }
        else if(!this.validateEmailList(this.defDestinatariAltraDoc))
        {
          this.common.sendUpdate("showAlertDanger", "Uno o più indirizzi email non validi!");
        }
      break;
      default:
      break;
    }
  }

  showStep2NextButton()
  {
    let showButton: boolean = false;

    if(this.defStatoValutazioneMerito != 'Negativo')
    {
      showButton = true;
    }
    /*else if(this.defPresenzaDerogaMerito  == true && this.defNoteDerogaMerito.length >= 3)
    {
      showButton = true;
    }*/
    
    this.wizardFormComponent.activeStep.showNext = showButton;
    this.wizardFormComponent.activeStep.showCustomSave = false;
  }

  validaStep2(event: any)
  {
    //console.log(event);
    if(event != null)
    {
      switch(event.target.id)
      {
        case "destinatariAltraDoc":
          this.defDestinatariAltraDoc = event.target.value;
        break;
        case "oggettoAltraDoc":
          this.defOggettoAltraDoc = event.target.value;
        break;
        case "testoAltraDoc":
          this.defTestoAltraDoc = event.target.value;
        break;
      }
    }
    // console.log(this.wizardFormComponent.activeStep.validStep);
    switch(this.defStatoValutazioneMerito)
    {
      case "Altra Documentazione":
        if(this.defDestinatariAltraDoc == "" || this.defOggettoAltraDoc == "" || this.defTestoAltraDoc == "")
        {
          this.wizardFormComponent.activeStep.validStep = false;
        }
        else if(!this.validateEmailList(this.defDestinatariAltraDoc))
        {
          this.wizardFormComponent.activeStep.validStep = false;
        }
        else
        {
          this.wizardFormComponent.activeStep.validStep = true;
        }
      break;
      default:
        this.wizardFormComponent.activeStep.validStep = true;
      break;
    }
    // console.log(this.wizardFormComponent.activeStep.validStep);
  }

  validateEmailList(emailList: string)
  {
    emailList = emailList.replace(',',';');
    let allEmailValid: boolean = true;

    emailList.split(';').forEach(email => {
      // console.log(email);
      if(!this.validateEmail(email))
      {
        //console.log('email is not valid');
        if(allEmailValid == true)
        {
          allEmailValid = false;
        }
      }
    });

    //console.log('all email valid: ' + allEmailValid);
    return allEmailValid;
  }

  validateEmail(email: string)
  {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
    {
      //console.log('email valid');
      return true;
    }
    return false;
  }

  // TIMELINE
  loadTimelineCliente()
  {
    this.common.sendUpdate("showSpinner");    
    let authToken: string = this.authService.getAuthToken();

    this.prospectService.getTimelineByRichiestaId(authToken, this.id).subscribe(
      res =>
      {
        let dateNow = new Date();
    
        res.forEach(element => {
          let dateApp = new Date(element.createDate);
          let gapApp = dateNow.getTime() - dateApp.getTime(); 
          element.dayUntilNow = gapApp / (1000 * 3600 * 24);      
        });

        // console.log(res);

        this.timelineComponent.entries = res;
        this.common.sendUpdate("hideSpinner");
      },
      err => {
          this.common.sendUpdate("hideSpinner");
          this.common.sendUpdate("showAlertDanger", err.message);
          console.log(err)
      }
    );
  }

  openPopupMessage(titolo: string, messaggio: string)
  {
    let dialogRef = this.dialog.open(ViewMessageComponent, { width: '1200px', height: '600px', id: 'view-message-modal' });
    dialogRef.componentInstance.customTitle = titolo;
    dialogRef.componentInstance.customMessage = messaggio;
  }

  openPopupMail(emailMessage: EmailMessage)
  {
    let dialogRef = this.dialog.open(ViewMailComponent, { width: '1200px', height: '615px', id: 'view-mail-modal' });
    dialogRef.componentInstance.emailMessage = emailMessage;
  }

  openPopupSaleTir()
  {
    let dialogRef = this.dialog.open(ViewSaleTirComponent, { width: '1200px', height: '72vh', id: 'view-sale-tir-modal' });
    dialogRef.componentInstance.loadTable(this.id);
  }

  getStepIndexByTitle(title: string)
  {
    let result: number = 1;
    switch(title)
    {
      case "Prospect":
        result = 1;
        break;
      case "Valutazione Merito":
        result = 2;
        break;
      case "Contratto":
        result = 3;
        break;
      case "Sottoscrizione Garanzie":
        result = 4;
        break;
      case "Valutazione Garanzie":
        result = 5;
        break;
    }

    return result;
  }

  onStepChanged($event: any) {
    let tabIndex: number = this.getStepIndexByTitle($event.title);

    this.refreshPrevNextButton(tabIndex);
  }

  onPresaCarico($event: any)
  {
    this.presaInCarico();
  }

  // NEXT EVENT

  public presaInCarico()
  {
    if(this.action == "edit")
    {
      this.common.sendUpdate("showSpinner");
      
      let authToken: string = this.authService.getAuthToken();
  
      let presaInCaricoRequest = new PresaInCaricoRequest(
                                                            this.id,
                                                            this.user.id,
                                                            this.user.name
                                                        );
  
      // console.log(presaInCaricoRequest);
  
      this.prospectService.savePresaInCarico(authToken, presaInCaricoRequest).subscribe(
        res =>
        {
          this.defUtentePresaCarico = this.user.name;
          this.defUtenteIdPresaCarico = this.user.id;
          this.defDataPresaCarico = res;
  
          this.common.sendUpdate("hideSpinner");
        },
        err => {
            this.common.sendUpdate("hideSpinner");
            this.common.sendUpdate("showAlertDanger", err.message);
            console.log(err)
        }
      );
    }
  }

  onValutazioneNext_1(event: any)
  {
    // Dal secondo step in poi non eseguo il salvataggio
    if(this.defWorkflowStepIndex <= 1)
    {
      if(this.action == "edit")
      {
        if(this.validaStep1())
        {
          // Fermo il movimento altrimenti andrebbe avanti senza aspettare la conferma dell'utente
          this.wizardFormComponent.activeStep.validStep = false;

          const dialogConfig = new MatDialogConfig();
          dialogConfig.id = 'confirm-message-modal';
          dialogConfig.height = 'fit-content';
          dialogConfig.width = '34rem';

          const modalDialog = this.dialog.open(ConfirmMessageComponent, dialogConfig);
          modalDialog.componentInstance.messageText = "Sei sicuro di voler passare allo step successivo?<br /> Non sarà più possibile modificare quello precedente.";

          modalDialog.afterClosed().subscribe(res => 
          {
            if (res == true)
            {
              this.wizardFormComponent.activeStep.validStep = true;

              this.common.sendUpdate("showSpinner");
              
              let authToken: string = this.authService.getAuthToken();
          
              let validazioneRequest = new ValutazioneStep1Request(
                                                                    this.id,
                                                                    this.prospectObj.anagrafica.nome,
                                                                    this.codiceCliente,
                                                                    this.defWorkflowStepId,
                                                                    this.prospectObj.anagrafica.business,
                                                                    this.defPresenzaSocietaCollegate,
                                                                    this.defSocietaCollegate,
                                                                    this.defPresenzaUltimoBilancio,
                                                                    this.defAnniBilancio,
                                                                    this.defPresenzaEventiNegativi,
                                                                    this.defEventiNegativi,
                                                                    this.defPresenzaEsitiPregressi,
                                                                    this.defCategoriaRichiesta.id,
                                                                    this.ipAddress,
                                                                    this.user.id,
                                                                    this.user.name
                                                                );
      
              // console.log(validazioneRequest);
          
              this.prospectService.saveValutazioneStep1(authToken, validazioneRequest).subscribe(
                res =>
                {
                  if(res.nextWorkFlowStepId > 0)
                  {
                    this.defWorkflowStepId = res.nextWorkFlowStepId;

                    this.defUtenteIdPresaCarico = this.user.id;
                    this.defUtentePresaCarico = this.user.name;
                  }
          
                  // this.refreshPrevNextButton(2);
                  this.defWorkflowStepIndex = 2;
                  this.wizardFormComponent.goToStepIndex(2);

                  this.common.sendUpdate("hideSpinner");
                },
                err => {
                    this.common.sendUpdate("hideSpinner");
                    this.common.sendUpdate("showAlertDanger", err.message);
                    console.log(err)
                }
              );
            }
          });
        }
      }
    }
  }

  onValutazioneNext_2(event: any)
  {
    // Valido per
    // this.prospectObj.richiesta.statoRichieste.nome == 'Positivo'
    if(this.action == "edit")
    {
      this.salvaStep2(false);
    }
  }

  onCustomSaveStep_2(event: any)
  {
    // Valido per
    // this.prospectObj.richiesta.statoRichieste.nome == 'Negativo'
    // this.defStatoValutazioneMerito == 'Altra Documentazione'
    if(this.action == "edit")
    {
      if(this.defStatoValutazioneMerito == 'Altra Documentazione')
      {
        this.salvaStep2(true);
      }
      else if(this.defStatoValutazioneMerito == 'Negativo')
      {
        this.salvaStep2(true);
      }
    }
  }

  onValutazioneNext_3(event: any)
  {
    // debugger;
    // non c'è perché sposto nel caricamento documento
    // this.refreshPrevNextButton(4);
    // this.defWorkflowStepIndex = 4;
  }

  onValutazioneNext_4(event: any)
  {
    // Se è 5 non eseguo il salvataggio
    if(this.defWorkflowStepIndex <= 4)
    {
      if(this.action == "edit")
      {
        if(this.validaStep4())
        {
          // Fermo il movimento altrimenti andrebbe avanti senza aspettare la conferma dell'utente
          this.wizardFormComponent.activeStep.validStep = false;

          const dialogConfig = new MatDialogConfig();
          dialogConfig.id = 'confirm-message-modal';
          dialogConfig.height = 'fit-content';
          dialogConfig.width = '34rem';

          const modalDialog = this.dialog.open(ConfirmMessageComponent, dialogConfig);
          modalDialog.componentInstance.messageText = "Sei sicuro di voler passare allo step successivo?<br /> Non sarà più possibile modificare quello precedente.";

          modalDialog.afterClosed().subscribe(res => 
          {
            if (res == true)
            {
              this.wizardFormComponent.activeStep.validStep = true;

              this.common.sendUpdate("showSpinner");    
              let authToken: string = this.authService.getAuthToken();

              let tipoRegistroEmail: string = "";
              if(this.prospectObj.anagrafica.business == "PAT" || this.prospectObj.anagrafica.business == "ZC")
              {
                tipoRegistroEmail = environment.tipoRegistroEmailCanGar;
              }

              let validazioneRequest = new ValutazioneStep4Request(
                                                                    this.id,
                                                                    this.prospectObj.anagrafica.nome,
                                                                    this.codiceCliente,
                                                                    this.defWorkflowStepId,
                                                                    this.prospectObj.anagrafica.business,
                                                                    this.defCanaleGaranziaSottoscrizione,
                                                                    this.defLegalMail,
                                                                    tipoRegistroEmail,
                                                                    this.ipAddress,
                                                                    this.user.id,
                                                                    this.user.name
                                                                );

              this.prospectService.saveValutazioneStep4(authToken, validazioneRequest).subscribe(
                res =>
                {
                  // debugger
                  // console.log(res);
                  if(res.nextWorkFlowStepId > 0)
                  {
                    this.defWorkflowStepId = res.nextWorkFlowStepId;

                    this.defUtenteIdPresaCarico = this.user.id;
                    this.defUtentePresaCarico = this.user.name;
                  }

                  // this.refreshPrevNextButton(5);
                  this.defWorkflowStepIndex = 5;
                  this.wizardFormComponent.goToStepIndex(5);
                  this.common.sendUpdate("hideSpinner");
                },
                err => {
                    this.common.sendUpdate("hideSpinner");
                    this.common.sendUpdate("showAlertDanger", err.message);
                    console.log(err)
                }
              );
            }
          });
        }
      }
    }
  }

  onValutazioneNext_5(event: any)
  {    
    const dialogConfig = new MatDialogConfig()
    dialogConfig.id = 'confirm-message-modal'
    dialogConfig.height = 'fit-content'
    dialogConfig.width = '25rem';

    const modalDialog = this.dialog.open(ConfirmMessageComponent, dialogConfig);
    modalDialog.componentInstance.messageText = "Sei sicuro di salvare la pratica?<br /> Non sarà più possibile modificarla.";

    modalDialog.afterClosed().subscribe(res => 
    {
      if (res == true)
      {
        if(this.validaStep5())
        {
          this.common.sendUpdate("showSpinner");    
          let authToken: string = this.authService.getAuthToken();

          let statoId: number;

          if(this.listStatiGaranzie)
          {
            this.listStatiGaranzie.forEach(element => {
              if(element.descrizione == this.defStatoValutazioneGaranzia)
              {
                statoId = element.id;
              }
            });  
          }

          let validazioneRequest = new ValutazioneStep5Request(
                                                                this.id,
                                                                this.prospectObj.anagrafica.nome,
                                                                this.codiceCliente,
                                                                this.defWorkflowStepId,
                                                                statoId,
                                                                this.defStatoValutazioneGaranzia,
                                                                this.prospectObj.anagrafica.business,
                                                                this.defPresenzaSideLetterValutazione,
                                                                this.defPresenzaDerogaValutazione,
                                                                this.defIdNoteValutazioneGaranzia,
                                                                this.defNoteValutazioneGaranzia,
                                                                this.ipAddress,
                                                                this.user.id,
                                                                this.user.name,
                                                                this.listGaranzieValutazione
                                                            );

          this.prospectService.saveValutazioneStep5(authToken, validazioneRequest).subscribe(
            res =>
            {
              // console.log(res);
              if(res.nextWorkFlowStepId > 0)
              {
                this.defWorkflowStepId = res.nextWorkFlowStepId;

                this.defUtenteIdPresaCarico = this.user.id;
                this.defUtentePresaCarico = this.user.name;
              }

              this.defRichiestaSalvata = true;
              this.defStatoValutazioneGaranzia = "Rifiutato";
              this.defPresenzaDerogaValutazione = false;
              this.defNoteValutazioneGaranzia = "";

              this.loadCompleteProspect();
            },
            err => {
                this.common.sendUpdate("hideSpinner");
                this.common.sendUpdate("showAlertDanger", err.message);
                console.log(err)
            }
          );
        }
      }
    });
  }

  // Se refreshPrevStep è true rimane sullo stesso Step e nasconde il pulsante in basso
  salvaStep2(refreshPrevStep: boolean)
  {
    if(!this.authStep2 && (!this.defWorkflowStepIndex || this.defWorkflowStepIndex <= 2))
    {
      this.wizardFormComponent.activeStep.validStep = false;
      this.common.sendUpdate("showAlertDanger", "Non sei autorizzato a proseguire!");
    }
    else if(!this.wizardFormComponent.activeStep.validStep)
    {
      this.validaStep2Message();
    }
    else if(this.authStep2 && this.defWorkflowStepIndex && (this.defWorkflowStepIndex <= 2 && (!this.defDerogaMeritoId || this.defDerogaMeritoId == -1)))
    {
      this.common.sendUpdate("showSpinner");    
      let authToken: string = this.authService.getAuthToken();

      let statoId: number;
      this.listStatiRichieste.forEach(element => {
        if(element.nome == this.defStatoValutazioneMerito)
        {
          statoId = element.id;
        }
      });

      let validazioneRequest = new ValutazioneStep2Request(
                                                            this.id,
                                                            this.prospectObj.anagrafica.nome,
                                                            this.codiceCliente,
                                                            this.defWorkflowStepId,
                                                            statoId,
                                                            this.defStatoValutazioneMerito,
                                                            this.prospectObj.anagrafica.business,
                                                            this.defIdNoteValutazioneMerito,
                                                            this.defNoteValutazioneMerito,
                                                            this.defDestinatariAltraDoc,
                                                            this.defOggettoAltraDoc,
                                                            this.defTestoAltraDoc,
                                                            this.ipAddress,
                                                            this.user.id,
                                                            -1,
                                                            "",
                                                            this.user.name
                                                        );

      this.prospectService.saveValutazioneStep2(authToken, validazioneRequest).subscribe(
        res =>
        {

          this.defUtenteIdPresaCarico = this.user.id;
          this.defUtentePresaCarico = this.user.name;
          
          if(refreshPrevStep)
          {
            // debugger;
            // this.wizardFormComponent.activeStep.showNext = false;
            this.wizardFormComponent.activeStep.showCustomSave = false;

            this.actionAfterCustomSaveStep_2();
          }
          else
          {
            if(res.nextWorkFlowStepId > 0)
            {
              this.defWorkflowStepId = res.nextWorkFlowStepId;
            }

            this.refreshPrevNextButton(3);
            this.defWorkflowStepIndex = 3;
          }
          this.common.sendUpdate("hideSpinner");
        },
        err => {
            this.common.sendUpdate("hideSpinner");
            this.common.sendUpdate("showAlertDanger", err.message);
            console.log(err)
        }
      );
    }
  }

  openPopupNoteDeroga(testo_nota: string)
  {
    this.openPopupMessage("Nota Deroga", testo_nota);
  }

  // PREV EVENT

  onValutazionePrev_1(event: any)
  {
    // debugger;
    // this.refreshPrevNextButton(0);
  }

  onValutazionePrev_2(event: any)
  {
    // debugger;
    // this.refreshPrevNextButton(1);
  }

  onValutazionePrev_3(event: any)
  {
    // debugger;
    // this.refreshPrevNextButton(2);
  }

  onValutazionePrev_4(event: any)
  {
    // debugger;
    // this.refreshPrevNextButton(3);
  }

  onValutazionePrev_5(event: any)
  {
    // debugger;
    // this.refreshPrevNextButton(4);
  }

  actionAfterCustomSaveStep_2()
  {
    this.defAfterCustomSave = true;
    switch(this.defStatoValutazioneMerito)
    {
      case "Altra Documentazione":
        this.defDestinatariAltraDoc = "";
        this.defOggettoAltraDoc = "";
        this.defTestoAltraDoc = "";
        break;
    }
  }

  refreshPrevNextButton(tabIndex: number)
  {
    let defaultBtnName: string = "SALVA";
    if(this.defWorkflowStepIndex > tabIndex)
    {
      defaultBtnName = "AVANTI";
    }
    this.wizardFormComponent.activeStep.showCustomSave = false;
    
    if(this.action == "view")
    {
      this.wizardFormComponent.activeStep.showNext = false;
    }
    else
    {
      switch (tabIndex)
      {
        case 2:
          // console.log(this.prospectObj.richiesta.statoRichieste);
          // debugger;

          let derogaInserita: boolean = false;
          if((this.defDerogaMeritoId != null && this.defDerogaMeritoId > 0) || (this.defDerogaMeritoDate && this.defDerogaMeritoUser != ''))
          {
            derogaInserita = true;
          }

          if (this.prospectObj.richiesta.statoRichieste && this.prospectObj.richiesta.statoRichieste.nome)
          {
            // this.defValutazioneMeritoAttivo = false;

            if(this.prospectObj.richiesta.statoRichieste.nome == 'Altra Documentazione')
            {
              // Se precedentemente ho cliccato su altra documentazione mantengo attiva la selezione
              this.defValutazioneMeritoAttivo = true;
            }
            else
            {
              this.defValutazioneMeritoAttivo = false;
            }
          }
          else 
          {
            if(this.authStep2 != true || this.defWorkflowStepIndex > 2 || this.defAfterCustomSave == true || this.action != 'edit')
            {
              this.defValutazioneMeritoAttivo = false;
            }
            else
            {
              this.defValutazioneMeritoAttivo = true;
            }
          }

          if(this.defValutazioneMeritoAttivo == false)
          {
            if(this.defStatoValutazioneMerito == 'Positivo' || (this.defStatoValutazioneMerito == 'Negativo' && derogaInserita == true))
            {
              this.wizardFormComponent.nextBtnText = "AVANTI";
              this.wizardFormComponent.activeStep.showNext = true;
              this.wizardFormComponent.activeStep.showCustomSave = false;
            }
            else
            {
              this.wizardFormComponent.activeStep.showNext = false;
              this.wizardFormComponent.activeStep.showCustomSave = false;
            }
          }
          else if(this.defValutazioneMeritoAttivo == true)
          {
            if(this.defStatoValutazioneMerito == 'Altra Documentazione')
            {
              this.wizardFormComponent.nextBtnText = "INVIA";
              this.wizardFormComponent.activeStep.showNext = false;
              this.wizardFormComponent.activeStep.showCustomSave = true;
            }
            else if(this.defStatoValutazioneMerito == 'Negativo')
            {
              this.wizardFormComponent.nextBtnText = "SALVA";
              this.wizardFormComponent.activeStep.showNext = false;
              this.wizardFormComponent.activeStep.showCustomSave = true;
            }
            else
            {
              this.wizardFormComponent.nextBtnText = "AVANTI";
              this.wizardFormComponent.activeStep.showNext = true;
              this.wizardFormComponent.activeStep.showCustomSave = false;
            }
          }

          // this.showStep2NextButton();
          break;
        case 3:
          // console.log(this.defValutazioneContrattoId);
          
          if(this.defValutazioneContrattoId != null)
          {
            this.wizardFormComponent.activeStep.showNext = true;
            this.wizardFormComponent.nextBtnText = "AVANTI";
          }
          else
          {
            this.wizardFormComponent.activeStep.showNext = false;
          }
          break;
        case 5:
            if(!this.listGaranzieValutazione || this.listGaranzieValutazione.length == 0)
            {
              this.wizardFormComponent.activeStep.showNext = false;
            }
            else
            {
              this.wizardFormComponent.activeStep.showNext = true;
            }
          break;
        default:
          this.wizardFormComponent.activeStep.showNext = true;
          this.wizardFormComponent.activeStep.showCustomSave = false;
          this.wizardFormComponent.nextBtnText = defaultBtnName;
          break;
      }
    }
  }

  public displayBootstrapClass(field: string) {
    return WizardFormComponent.displayBootstrapClass(this.profileForm, field);
  }

  public profilePictureRead(event, imgElement) {
    const uploadPromise = WizardFormComponent.updatePicturePreview(event, imgElement);
    uploadPromise.then((file) => {
      // file will contain the event.target.files[0] data
      // Here you can post the file to the server or whatever you need to do
      // with it
      console.log('build-profile.component, file "uploaded"', file);
    }).catch(() => {
      console.log('build-profile.component, file "upload" FAIL');
    });
  }

  public onSubmit(evt) {
    console.log(evt);
  }
  
  ngAfterViewInit() {

      this.mySubscription = this.common.getUpdate().subscribe(res => {
  
        let json_obj: InternalMessage = JSON.parse(res.text);
        // console.log(json_obj.command);
  
        if (json_obj.command == "sidebarToggle") 
        {
          this.wizardToggle();
        }
      });
  }

  
  /**** Correzione grafica del wizard ad apertura chiusura menu ****/
  wizardToggle()
  {
    var sideBarObj = document.getElementsByClassName("moving-tab")[0];

    // console.log(sideBarObj);

    if(this.sidebarVisible == true)
    {
      sideBarObj.classList.remove('compactMovingTab');
      this.sidebarVisible = false;
    }
    else
    {
      sideBarObj.classList.add('compactMovingTab');
      this.sidebarVisible = true;
    }
  }

  ngOnDestroy(): void {
    ///qui viene distrutto il componente
    if (this.mySubscription)
      this.mySubscription.unsubscribe();

    if (this.myDocumentSubscription)
      this.myDocumentSubscription.unsubscribe();

    if(this.listCategorieSubscription)
      this.listCategorieSubscription.unsubscribe();

    if(this.listStatiSubscription)
      this.listStatiSubscription.unsubscribe();

    if(this.listTipiDocumentiSubscription)
      this.listTipiDocumentiSubscription.unsubscribe();

    if(this.authSubscription)
      this.authSubscription.unsubscribe();

    if(this.listCanaliSubscription)
      this.listCanaliSubscription.unsubscribe();

    if(this.listRoleMeritoSubscription)
      this.listRoleMeritoSubscription.unsubscribe();
  }

  ///Istanzia la form
  private createForm() {
    this.profileForm = this.fb.group({
      type: this.fb.group({
        type: [''],
      }),
      aboutPerson: this.fb.group({
        profilePicture: '',
        name: [''],
        lastName: [''],
        email: [''],
      }),
      aboutBusiness: this.fb.group({
        name: [''],
        legalRepresentative: [''],
      }),
      aboutDummy: null, // Dummy step to maintain an about title visible
      // before select a type of profile
      address: this.fb.group({
        street: [''],
        number: [''],
        extension: '',
        city: ['']
      })
    });
  }
}