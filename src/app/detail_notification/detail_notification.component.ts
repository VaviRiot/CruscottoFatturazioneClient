import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { toHash } from 'ajv/dist/compile/util';
import { GruppoUtenti } from 'app/models/GruppoUtenti';
import { Notifica } from 'app/models/Notifica';
import { NotificaTipologia } from 'app/models/NotificaTipologia';
import { ProspectGaranziaStato } from 'app/models/ProspectGaranziaStato';
import { StatoRichieste } from 'app/models/StatoRichieste';
import { User } from 'app/models/User';
import { WorkflowStep } from 'app/models/WorkflowStep';
import { AuthService } from 'app/shared/Service/AuthService/auth.service';
import { CommonService } from 'app/shared/Service/Common/common.service';
import { NotificheService } from 'app/shared/Service/Notifiche/notifiche.service';
import { ProspectService } from 'app/shared/Service/Prospect/prospect.service';
import { UserService } from 'app/shared/Service/User/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-detail-notification',
  templateUrl: './detail_notification.component.html',
  styleUrls: ['./detail_notification.component.css']
})
export class DetailNotificationComponent implements OnInit {
  
  // Init Param
  public action: string = "";
  public id: number = -1;

  public buttonTitle: string = "Aggiorna Notifica";
  public isEdit: boolean = false;

  public notifica = new Notifica(-1, "", "", "", "", "", "", null, "", null, null, null, new Array<User>(), new Array<GruppoUtenti>());
  public userLogged: User;

  private mySubscription: Subscription;
  private saveSubscription: Subscription;
  private myListUserSubscription: Subscription;
  private myListGroupSubscription: Subscription;
  private myListTipologieSubscription: Subscription;
  private myListWorkflowStepSubscription: Subscription;

  private listStatiMeritoSubscription: Subscription;
  private listStatiGaranzieSubscription: Subscription;

  public nameCtrl = new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]);
  public messaggioNotificaCtrl = new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(500)]);
  public oggettoEmailCtrl = new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(250)]);
  public testoEmailCtrl = new FormControl('', [Validators.required, Validators.minLength(3)]);
  public tipologiaCtrl = new FormControl('', [Validators.required]);
  public workflowStepCtrl = new FormControl('', []);
  public utentiCtrl = new FormControl('', []);
  public gruppiCtrl = new FormControl('', []);

  public esitoMeritoCtrl = new FormControl('', []);
  public esitoGaranzieCtrl = new FormControl('', []);

  public defTipologiaId: number = -1;
  public defTipologiaEmailId: number = -1;
  public defTipologiaAppId: number = -1;
  public defWorkflowStepId: number = -1;

  public defSelectedEsitoMeritoId: number = -1;
  public defSelectedEsitoGaranzieId:number = -1;

  public defSelectedWorkStepName:string = '';

  public listUsers = new Array<User>();
  public listGroups = new Array<GruppoUtenti>();
  public listTipologieNotifiche = new Array<NotificaTipologia>();
  public listWorkflowStep = new Array<WorkflowStep>();

  public listStatiRichieste = new Array<StatoRichieste>();
  public listStatiGaranzie = new Array<ProspectGaranziaStato>();

  public listSelectedUserId = new Array<number>();
  public listSelectedGroupId = new Array<number>();

  public tagsHtml: Array<string> = ['{{nomeCliente}}', '{{codiceCliente}}', '{{business}}'];

  constructor(private router: Router,
              private route: ActivatedRoute,
              private authService: AuthService,
              private common: CommonService,
              private notificheService: NotificheService,
              private userService: UserService,
              private prospectService: ProspectService
            ) { }

  ngOnInit(): void 
  {
    this.common.sendUpdate("showSpinner");

    this.userLogged = this.authService.getUser();

    this.action = this.route.snapshot.paramMap.get('action');
    this.id = +this.route.snapshot.paramMap.get('id');

    if(this.action == "create")
    {
      this.isEdit = true;
      this.buttonTitle = "Crea Notifica";
    }
    else if(this.action == "edit")
    {
      this.isEdit = true;
    }
    else
    {
      this.isEdit = false;
      this.nameCtrl.disable();
      this.messaggioNotificaCtrl.disable();
      this.oggettoEmailCtrl.disable();
      this.testoEmailCtrl.disable();
      this.tipologiaCtrl.disable();
      this.workflowStepCtrl.disable();
      this.utentiCtrl.disable();
      this.gruppiCtrl.disable();
    }

    let authToken: string = this.authService.getAuthToken();

    
    this.listStatiGaranzieSubscription = this.prospectService.getStatiGaranzieList(authToken).subscribe(res =>
    {
      this.listStatiGaranzie = res as Array<ProspectGaranziaStato>;

      this.listStatiMeritoSubscription = this.prospectService.getStatiValutazioneList(authToken).subscribe(res =>
      {
        let appListStatiRichieste = res as Array<StatoRichieste>;

        appListStatiRichieste.forEach(element => {
          if(element.nome != "Attivo" && element.nome != "Attivo con Deroga")
          {
            this.listStatiRichieste.push(element);
          }
        });
        
        // console.log(this.listStatiRichieste);

        this.mySubscription = this.notificheService.getNotificheSetupById(authToken, this.id).subscribe(res => 
        {
          this.notifica = res as Notifica;

          // console.log(this.notifica);

          this.myListWorkflowStepSubscription = this.prospectService.getWorkflowStepList(authToken).subscribe(res => 
          {
            this.listWorkflowStep = res as Array<WorkflowStep>;

            this.myListTipologieSubscription = this.notificheService.getTipologieNotificheList(authToken).subscribe(res => 
            {
              this.listTipologieNotifiche = res as Array<NotificaTipologia>;

              this.listTipologieNotifiche.forEach(tipo => {
                if(tipo.nome == 'EMAIL')
                {
                  this.defTipologiaEmailId = tipo.id;
                }
                else if(tipo.nome == 'APP')
                {
                  this.defTipologiaAppId = tipo.id;
                }
              });

              this.myListGroupSubscription = this.userService.getGruppiList(authToken).subscribe(res => 
              {
                this.listGroups = res as Array<GruppoUtenti>;
                if(this.notifica.gruppiNotifica)
                {
                  this.listSelectedGroupId = this.setListChecked(this.listGroups, this.notifica.gruppiNotifica);
                }
                else
                {
                  this.listSelectedGroupId = new Array<number>();
                }

                this.myListUserSubscription = this.userService.getUserList(authToken).subscribe(res => 
                {
                  this.listUsers = res as Array<User>;
                  if(this.notifica.utentiNotifica)
                  {
                    this.listSelectedUserId = this.setListChecked(this.listUsers, this.notifica.utentiNotifica);
                  }
                  else
                  {
                    this.listSelectedUserId = new Array<number>();
                  }

                  if(this.notifica.tipologiaNotifica)
                  {
                    this.defTipologiaId = this.notifica.tipologiaNotifica.id;
                  }

                  if(this.notifica.workflowStepNotifiche)
                  {
                    this.defWorkflowStepId = this.notifica.workflowStepNotifiche.id;

                    let wFL: WorkflowStep = this.getWorkflowStepById(this.defWorkflowStepId);
                    if(wFL)
                    {
                      this.defSelectedWorkStepName = wFL.nomeStep;
                      
                      if(this.notifica.esitoId)
                      {
                        if(this.defSelectedWorkStepName == 'merito creditizio')
                        {
                          this.defSelectedEsitoMeritoId = this.notifica.esitoId;
                        }
                        
                        if(this.defSelectedWorkStepName == 'valutazione garanzie')
                        {
                          this.defSelectedEsitoGaranzieId = this.notifica.esitoId;
                        }
                      }
                    }
                  }

                
                  // console.log(this.role);
                  this.common.sendUpdate("hideSpinner");
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
    },
    error => {
      this.common.sendUpdate("hideSpinner");
      this.common.sendUpdate("showAlertDanger", error.message);
    });
  }

  toggleWorkflow(workflowstep_id: any)
  {
    let wFL: WorkflowStep = this.getWorkflowStepById(workflowstep_id);
    if(wFL)
    {
      this.defSelectedWorkStepName = wFL.nomeStep;
    }
  }

  setListChecked(sourceList: Array<User|GruppoUtenti>, selectedList: Array<User|GruppoUtenti>): Array<number>
  {
    let returnList = new Array<number>();
    sourceList.forEach(element => {
      if(selectedList.filter(e => e.id === element.id).length > 0)
      {
        returnList.push(element.id);
      }
    });

    return returnList;
  }

  getListChecked(sourceList: Array<User|GruppoUtenti>, selectedListId: Array<number> ): Array<User|GruppoUtenti>
  {
    let returnList = new Array<User|GruppoUtenti>();
    selectedListId.forEach(element_id => {
      let appItem: (User|GruppoUtenti) = sourceList.filter(e => e.id === element_id)[0];
      if(appItem)
      {
        returnList.push(appItem);
      }
    });

    return returnList;
  }

  getTipologiaById(tipologia_id: number): NotificaTipologia
  {
    let returnTipologia: NotificaTipologia;
    this.listTipologieNotifiche.forEach(tipo => 
    {
      if(tipo.id == tipologia_id)
      {
        returnTipologia = tipo;
      }
    });

    return returnTipologia;
  }

  getWorkflowStepById(workflowstep_id: number): WorkflowStep
  {
    let returnWorkflowStep: WorkflowStep;
    this.listWorkflowStep.forEach(wS => 
    {
      if(wS.id == workflowstep_id)
      {
        returnWorkflowStep = wS;
      }
    });

    return returnWorkflowStep;
  }

  salvaNotifica()
  {
    this.common.sendUpdate("showSpinner");

    if(this.nameCtrl.valid == true)
    {
      if(this.messaggioNotificaCtrl.valid == true || this.defTipologiaId != this.defTipologiaAppId)
      {
        if(this.oggettoEmailCtrl.valid == true || this.defTipologiaId != this.defTipologiaEmailId)
        {
          if(this.testoEmailCtrl.valid == true || this.defTipologiaId != this.defTipologiaEmailId)
          {
            if(this.tipologiaCtrl.valid == true)
            {
              if(this.workflowStepCtrl.valid == true)
              {
                this.notifica.utentiNotifica = this.getListChecked(this.listUsers, this.listSelectedUserId);
                this.notifica.gruppiNotifica = this.getListChecked(this.listGroups, this.listSelectedGroupId);

                if(this.defTipologiaId)
                {
                  let appTipologia: NotificaTipologia = this.getTipologiaById(this.defTipologiaId);

                  if(appTipologia)
                  {
                    if(appTipologia.id)
                    {
                      this.notifica.tipologiaNotifica = appTipologia;
                    }
                  }
                }

                if(this.defSelectedEsitoMeritoId && this.defSelectedWorkStepName == 'merito creditizio')
                {
                  this.notifica.esitoId = this.defSelectedEsitoMeritoId;
                }

                if(this.defSelectedEsitoGaranzieId && this.defSelectedWorkStepName == 'valutazione garanzie')
                {
                  this.notifica.esitoId = this.defSelectedEsitoGaranzieId;
                }

                if(this.defWorkflowStepId)
                {
                  let appWorkflowStep: WorkflowStep = this.getWorkflowStepById(this.defWorkflowStepId);

                  if(appWorkflowStep)
                  {
                    if(appWorkflowStep.id)
                    {
                      this.notifica.workflowStepNotifiche = appWorkflowStep;
                    }
                  }
                }

                let authToken: string = this.authService.getAuthToken();
                this.saveSubscription = this.notificheService.saveNotifica(authToken, this.notifica, this.userLogged.name).subscribe((res: boolean) => 
                  {
                    if(res)
                    {
                      //console.log(res);
                      this.common.sendUpdate("showAlertInfo", "Notifica salvata correttamente!");

                      this.common.redirectToUrl('/notifications');
                      this.common.sendUpdate("hideSpinner");
                    }
                    else
                    {
                      this.common.sendUpdate("hideSpinner");
                      this.common.sendUpdate("showAlertDanger", "Impossibile salvare la notifica al momento.");
                    }
                  },
                  error => {
                    // console.log("getTopSummary");
                    // console.log(error);
              
                    this.common.sendUpdate("hideSpinner");
                    this.common.sendUpdate("showAlertDanger", error.message);
                  });
              }
            }
          }
        }
      }
    }

    this.common.sendUpdate("hideSpinner");
  }

  // VALIDATION
  getNameErrorMessage() {
    if(this.nameCtrl.hasError('minlength'))
    {
      return "Il nome deve contenere minimo 3 caratteri";
    }
    else if(this.nameCtrl.hasError('maxlength'))
    {
      return "Il nome deve contenere al massimo 50 caratteri";
    }
    else if(this.nameCtrl.hasError('required'))
    {
      return "Nome non valido";
    }
    else
    {
      return "";
    }
  }
  
  getMessaggioNotificaErrorMessage() {
    if(this.messaggioNotificaCtrl.hasError('minlength'))
    {
      return "Il testo della notifica deve contenere minimo 3 caratteri";
    }
    else if(this.messaggioNotificaCtrl.hasError('maxlength'))
    {
      return "Il testo della notifica deve contenere al massimo 500 caratteri";
    }
    else if(this.messaggioNotificaCtrl.hasError('required'))
    {
      return "Testo della notifica non valido";
    }
    else
    {
      return "";
    }
  }
  
  getOggettoEmailErrorMessage() {
    if(this.oggettoEmailCtrl.hasError('minlength'))
    {
      return "L'oggetto dell'email deve contenere minimo 3 caratteri";
    }
    else if(this.oggettoEmailCtrl.hasError('maxlength'))
    {
      return "L'oggetto dell'email deve contenere al massimo 250 caratteri";
    }
    else if(this.oggettoEmailCtrl.hasError('required'))
    {
      return "Oggetto dell'email non valido";
    }
    else
    {
      return "";
    }
  }
  
  getTestoEmailErrorMessage() {
    if(this.testoEmailCtrl.hasError('minlength'))
    {
      return "Il testo dell'email deve contenere minimo 3 caratteri";
    }
    else if(this.testoEmailCtrl.hasError('maxlength'))
    {
      return "Il testo dell'email deve contenere al massimo 500 caratteri";
    }
    else if(this.testoEmailCtrl.hasError('required'))
    {
      return "Testo dell'email non valido";
    }
    else
    {
      return "";
    }
  }

  getTipologiaErrorMessage() {
    if(this.tipologiaCtrl.hasError('required'))
    {
      return "Tipologia non selezionata";
    }
    else
    {
      return "";
    }
  }

  getWorkflowStepErrorMessage() {
    return "";
    /*if(this.workflowStepCtrl.hasError('required'))
    {
      return "Workflow Step non selezionata";
    }
    else
    {
      return "";
    }*/
  }

  ngOnDestroy(): void {
    ///qui viene distrutto il componente
    if (this.mySubscription)
      this.mySubscription.unsubscribe();

    if(this.saveSubscription)
      this.saveSubscription.unsubscribe();

    if(this.myListUserSubscription)
      this.myListUserSubscription.unsubscribe();

    if(this.myListGroupSubscription)
      this.myListGroupSubscription.unsubscribe();

    if(this.myListTipologieSubscription)
      this.myListTipologieSubscription.unsubscribe();

    if(this.myListWorkflowStepSubscription)
      this.myListWorkflowStepSubscription.unsubscribe();

    if(this.listStatiMeritoSubscription)
      this.listStatiMeritoSubscription.unsubscribe();
      
    if(this.listStatiGaranzieSubscription)
      this.listStatiGaranzieSubscription.unsubscribe();
  }

}
