import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RoleVoceMenu } from 'app/models/RoleVoceMenu';
import { User } from 'app/models/User';
import { UserRole } from 'app/models/UserRole';
import { VoceMenu } from 'app/models/VoceMenu';
import { AuthService } from 'app/shared/Service/AuthService/auth.service';
import { CommonService } from 'app/shared/Service/Common/common.service';
import { NotificheService } from 'app/shared/Service/Notifiche/notifiche.service';
import { ProspectService } from 'app/shared/Service/Prospect/prospect.service';
import { UserService } from 'app/shared/Service/User/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-detail-role-vocimenu',
  templateUrl: './detail_role_vocimenu.component.html',
  styleUrls: ['./detail_role_vocimenu.component.css']
})
export class DetailRoleVocimenuComponent implements OnInit {
  
  // Init Param
  public action: string = "";
  public id: number = -1;

  public buttonTitle: string = "Aggiorna Associazione";
  public isEdit: boolean = false;

  public roleVoceMenu = new RoleVoceMenu(-1, null, null, "", null, "", null, "", "");
  public userLogged: User;
  
  private mySubscription: Subscription;
  private myListRuoliSubscription: Subscription;
  private myListVociMenuSubscription: Subscription;
  private saveSubscription: Subscription;

  public ruoloCtrl = new FormControl('', [Validators.required]);
  public voceMenuCtrl = new FormControl('', [Validators.required]);
  
  public defRuoloId: number = -1;
  public defVoceMenuId: number = -1;

  public listRuoliUtenti = new Array<UserRole>();
  public listVociMenu = new Array<VoceMenu>();

  constructor(
                private route: ActivatedRoute,
                private authService: AuthService,
                private common: CommonService,
                private userService: UserService
            ) { }

  ngOnInit(): void {
    this.common.sendUpdate("showSpinner");

    this.userLogged = this.authService.getUser();

    this.action = this.route.snapshot.paramMap.get('action');
    this.id = +this.route.snapshot.paramMap.get('id');

    if(this.action == "create")
    {
      this.isEdit = true;
      this.buttonTitle = "Crea Associazione";
    }
    else if(this.action == "edit")
    {
      this.isEdit = true;
    }
    else
    {
      this.isEdit = false;
      this.ruoloCtrl.disable();
      this.voceMenuCtrl.disable();
    }

    let authToken: string = this.authService.getAuthToken();    

    this.mySubscription = this.userService.getRoleVoceMenuById(authToken, this.id).subscribe(res => 
    {
      this.roleVoceMenu = res as RoleVoceMenu;

      // console.log(this.roleVoceMenu);

      this.myListRuoliSubscription = this.userService.getVociMenuList(authToken).subscribe(res => 
      {
        this.listVociMenu = res as Array<VoceMenu>;

        this.myListRuoliSubscription = this.userService.getRuoliList(authToken).subscribe(res => 
        {
          this.listRuoliUtenti = res as Array<UserRole>;

          if(this.roleVoceMenu.ruoloVoceMenu)
          {
            this.defRuoloId = this.roleVoceMenu.ruoloVoceMenu.id;
          }

          if(this.roleVoceMenu.voceMenuRuolo)
          {
            this.defVoceMenuId = this.roleVoceMenu.voceMenuRuolo.id;
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

  getRuoloById(ruoloId: number): UserRole
  {
    let returnRuolo: UserRole;
    this.listRuoliUtenti.forEach(tipo => 
    {
      if(tipo.id == ruoloId)
      {
        returnRuolo = tipo;
      }
    });

    return returnRuolo;
  }

  getVoceMenuById(voceMenuId: number): VoceMenu
  {
    let returnVoceMenu: VoceMenu;
    this.listVociMenu.forEach(vM => 
    {
      if(vM.id == voceMenuId)
      {
        returnVoceMenu = vM;
      }
    });

    return returnVoceMenu;
  }

  salvaRoleVoceMenu()
  {
    this.common.sendUpdate("showSpinner");

    if(this.ruoloCtrl.valid == true)
    {
      if(this.voceMenuCtrl.valid == true)
      {
        let authToken: string = this.authService.getAuthToken();

        if(this.defRuoloId)
        {
          let appRuolo: UserRole = this.getRuoloById(this.defRuoloId);

          if(appRuolo)
          {
            if(appRuolo.id)
            {
              this.roleVoceMenu.ruoloVoceMenu = appRuolo;
            }
          }
        }

        if(this.defVoceMenuId)
        {
          let appVoceMenu: VoceMenu = this.getVoceMenuById(this.defVoceMenuId);

          if(appVoceMenu)
          {
            if(appVoceMenu.id)
            {
              this.roleVoceMenu.voceMenuRuolo = appVoceMenu;
            }
          }
        }

        if(!this.roleVoceMenu.id)
        {
          this.roleVoceMenu.id = -1;
        }

        this.saveSubscription = this.userService.saveRoleVoceMenu(authToken, this.roleVoceMenu, this.userLogged.name).subscribe((res: boolean) => 
          {
            if(res)
            {
              //console.log(res);
              this.common.sendUpdate("showAlertInfo", "Associazione salvata correttamente!");

              this.common.redirectToUrl('/role_vocimenu');
              this.common.sendUpdate("hideSpinner");
            }
            else
            {
              this.common.sendUpdate("hideSpinner");
              this.common.sendUpdate("showAlertDanger", "Impossibile salvare l'associazione al momento.");
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
    if(this.voceMenuCtrl.hasError('required'))
    {
      return "Voce Menù non selezionata.";
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

    if(this.myListVociMenuSubscription)
      this.myListVociMenuSubscription.unsubscribe();
  }

}
