import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'app/models/User';
import { UserRole } from 'app/models/UserRole';
import { WorkflowStep } from 'app/models/WorkflowStep';
import { WorkflowStepRole } from 'app/models/WorkflowStepRole';
import { AuthService } from 'app/shared/Service/AuthService/auth.service';
import { CommonService } from 'app/shared/Service/Common/common.service';
import { NotificheService } from 'app/shared/Service/Notifiche/notifiche.service';
import { ProspectService } from 'app/shared/Service/Prospect/prospect.service';
import { UserService } from 'app/shared/Service/User/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-detail-role-workflowstep',
  templateUrl: './detail_role_workflowstep.component.html',
  styleUrls: ['./detail_role_workflowstep.component.css']
})
export class DetailRoleWorkflowstepComponent implements OnInit {
  
  // Init Param
  public action: string = "";
  public id: number = -1;

  public buttonTitle: string = "Aggiorna Autorizzazione";
  public isEdit: boolean = false;

  public workflowStepRole = new WorkflowStepRole(-1, null, null, "", null, "", null, "", "");
  public userLogged: User;
  
  private mySubscription: Subscription;
  private myListRuoliSubscription: Subscription;
  private myListWorkflowStepSubscription: Subscription;
  private saveSubscription: Subscription;

  public ruoloCtrl = new FormControl('', [Validators.required]);
  public workflowStepCtrl = new FormControl('', [Validators.required]);
  
  public defRuoloId: number = -1;
  public defWorkflowStepId: number = -1;

  public listRuoliUtenti = new Array<UserRole>();
  public listWorkflowStep = new Array<WorkflowStep>();

  constructor(
                private router: Router,
                private route: ActivatedRoute,
                private authService: AuthService,
                private common: CommonService,
                private notificheService: NotificheService,
                private userService: UserService,
                private prospectService: ProspectService
              ) { }

  ngOnInit(): void {
    this.common.sendUpdate("showSpinner");

    this.userLogged = this.authService.getUser();

    this.action = this.route.snapshot.paramMap.get('action');
    this.id = +this.route.snapshot.paramMap.get('id');

    if(this.action == "create")
    {
      this.isEdit = true;
      this.buttonTitle = "Crea Autorizzazione";
    }
    else if(this.action == "edit")
    {
      this.isEdit = true;
    }
    else
    {
      this.isEdit = false;
      this.ruoloCtrl.disable();
      this.workflowStepCtrl.disable();
    }

    let auth_token: string = this.authService.getAuthToken();    

    this.mySubscription = this.prospectService.getWorkflowStepRoleById(auth_token, this.id).subscribe(res => 
    {
      this.workflowStepRole = res as WorkflowStepRole;

      console.log(this.workflowStepRole);

      this.myListWorkflowStepSubscription = this.prospectService.getWorkflowStepList(auth_token).subscribe(res => 
      {
        this.listWorkflowStep = res as Array<WorkflowStep>;

        this.myListRuoliSubscription = this.userService.getRuoliList(auth_token).subscribe(res => 
        {
          this.listRuoliUtenti = res as Array<UserRole>;

          if(this.workflowStepRole.ruoloWorkflowStep)
          {
            this.defRuoloId = this.workflowStepRole.ruoloWorkflowStep.id;
          }

          if(this.workflowStepRole.workflowStepRuolo)
          {
            this.defWorkflowStepId = this.workflowStepRole.ruoloWorkflowStep.id;
          }

          this.common.sendUpdate("hideSpinner");          
        },
        error => {
          // console.log("getTopSummary");
          // console.log(error);

          this.common.sendUpdate("hideSpinner");
          this.common.sendUpdate("showAlertDanger", error.message);
        });
      },
      error => {
        // console.log("getTopSummary");
        // console.log(error);

        this.common.sendUpdate("hideSpinner");
        this.common.sendUpdate("showAlertDanger", error.message);
      });
    },
    error => {
      // console.log("getTopSummary");
      // console.log(error);

      this.common.sendUpdate("hideSpinner");
      this.common.sendUpdate("showAlertDanger", error.message);
    });
  }

  getRuoloById(ruolo_id: number): UserRole
  {
    let returnRuolo: UserRole;
    this.listRuoliUtenti.forEach(tipo => 
    {
      if(tipo.id == ruolo_id)
      {
        returnRuolo = tipo;
      }
    });

    return returnRuolo;
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

  salvaWorkflowStepRole()
  {
    this.common.sendUpdate("showSpinner");

    if(this.ruoloCtrl.valid == true)
    {
      if(this.workflowStepCtrl.valid == true)
      {
        let auth_token: string = this.authService.getAuthToken();

        if(this.defRuoloId)
        {
          let appRuolo: UserRole = this.getRuoloById(this.defRuoloId);

          if(appRuolo)
          {
            if(appRuolo.id)
            {
              this.workflowStepRole.ruoloWorkflowStep = appRuolo;
            }
          }
        }

        if(this.defWorkflowStepId)
        {
          let appWorkflowStep: WorkflowStep = this.getWorkflowStepById(this.defWorkflowStepId);

          if(appWorkflowStep)
          {
            if(appWorkflowStep.id)
            {
              this.workflowStepRole.workflowStepRuolo = appWorkflowStep;
            }
          }
        }

        if(!this.workflowStepRole.id)
          {
            this.workflowStepRole.id = -1;
          }

        this.saveSubscription = this.prospectService.saveWorkflowStepRole(auth_token, this.workflowStepRole, this.userLogged.name).subscribe((res: boolean) => 
          {
            if(res)
            {
              //console.log(res);
              this.common.sendUpdate("showAlertInfo", "Autorizzazione salvata correttamente!");

              this.common.redirectToUrl('/role_workflowstep');
              this.common.sendUpdate("hideSpinner");
            }
            else
            {
              this.common.sendUpdate("hideSpinner");
              this.common.sendUpdate("showAlertDanger", "Impossibile salvare l'autorizzazione al momento.");
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

    this.common.sendUpdate("hideSpinner");
  }

  getRuoloErrorMessage() {
    if(this.ruoloCtrl.hasError('required'))
    {
      return "Ruolo non selezionato.";
    }
    else
    {
      return "";
    }
  }

  getWorkflowStepErrorMessage() {
    if(this.workflowStepCtrl.hasError('required'))
    {
      return "Workflow Step non selezionato.";
    }
    else
    {
      return "";
    }
  }

  ngOnDestroy(): void {
    ///qui viene distrutto il componente
    if (this.mySubscription)
      this.mySubscription.unsubscribe();

    if(this.saveSubscription)
      this.saveSubscription.unsubscribe();

    if(this.myListRuoliSubscription)
      this.myListRuoliSubscription.unsubscribe();

    if(this.myListWorkflowStepSubscription)
      this.myListWorkflowStepSubscription.unsubscribe();
  }

}
