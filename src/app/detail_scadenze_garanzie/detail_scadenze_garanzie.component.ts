import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RoleVoceMenu } from 'app/models/RoleVoceMenu';
import { ScadenzeGiorniGaranzie } from 'app/models/ScadenzeGiorniGaranzie';
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
  selector: 'app-detail-scadenze-garanzie',
  templateUrl: './detail_scadenze_garanzie.component.html',
  styleUrls: ['./detail_scadenze_garanzie.component.css']
})
export class DetailScadenzeGaranzieComponent implements OnInit {
  
  // Init Param
  public action: string = "";
  public id: number = -1;

  public buttonTitle: string = "Aggiorna Scadenza";
  public isEdit: boolean = false;

  public scadenzeGiorniGaranzie = new ScadenzeGiorniGaranzie(-1, "", 0, "", null, "", null, "", "");
  public userLogged: User;
  
  private mySubscription: Subscription;
  private saveSubscription: Subscription;

  public tipologiaCtrl = new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]);
  public giorniCtrl = new FormControl('', [Validators.required]);
  
  public defRuoloId: number = -1;
  public defVoceMenuId: number = -1;

  constructor(
              private route: ActivatedRoute,
              private authService: AuthService,
              private common: CommonService,
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
      this.buttonTitle = "Crea Scadenza";
    }
    else if(this.action == "edit")
    {
      this.isEdit = true;
    }
    else
    {
      this.isEdit = false;
      this.tipologiaCtrl.disable();
      this.giorniCtrl.disable();
    }

    let authToken: string = this.authService.getAuthToken();    

    this.mySubscription = this.prospectService.getScadenzeGiorniGaranzieById(authToken, this.id).subscribe(res => 
    {
      this.scadenzeGiorniGaranzie = res as ScadenzeGiorniGaranzie;

      // console.log(this.scadenzeGiorniGaranzie);

      this.common.sendUpdate("hideSpinner");
    },
    error => {
      // console.log("getTopSummary");
      // console.log(error);

      this.common.sendUpdate("hideSpinner");
      this.common.sendUpdate("showAlertDanger", error.message);
    });
  }

  salvaScadenzeGiorniGaranzie()
  {
    this.common.sendUpdate("showSpinner");

    let authToken: string = this.authService.getAuthToken();

    if(!this.scadenzeGiorniGaranzie.id)
    {
      this.scadenzeGiorniGaranzie.id = -1;
    }

    this.saveSubscription = this.prospectService.saveScadenzeGiorniGaranzie(authToken, this.scadenzeGiorniGaranzie, this.userLogged.name).subscribe((res: boolean) => 
      {
        if(res)
        {
          //console.log(res);
          this.common.sendUpdate("showAlertInfo", "Scadenza Garanzie salvata correttamente!");

          this.common.redirectToUrl('/scadenze_garanzie');
          this.common.sendUpdate("hideSpinner");
        }
        else
        {
          this.common.sendUpdate("hideSpinner");
          this.common.sendUpdate("showAlertDanger", "Impossibile salvare la scadenza garanzia al momento.");
        }
      },
      error => {
        // console.log("getTopSummary");
        // console.log(error);
  
        this.common.sendUpdate("hideSpinner");
        this.common.sendUpdate("showAlertDanger", error.message);
      });

    this.common.sendUpdate("hideSpinner");
  }

  getTipologiaErrorMessage() {
    if(this.tipologiaCtrl.hasError('required'))
    {
      return "Tipologia Scadenza non inserita.";
    }
    else
    {
      return "";
    }
  }

  getGiorniErrorMessage() {
    if(this.giorniCtrl.hasError('required'))
    {
      return "Giorni Scadenza non inseriti.";
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
  }

}
