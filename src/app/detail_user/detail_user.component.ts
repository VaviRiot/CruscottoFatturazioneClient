import { NullTemplateVisitor } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'app/models/User';
import { UserRole } from 'app/models/UserRole';
import { AuthService } from 'app/shared/Service/AuthService/auth.service';
import { CommonService } from 'app/shared/Service/Common/common.service';
import { UserService } from 'app/shared/Service/User/user.service';
import { Subscription } from 'rxjs';
import { threadId } from 'worker_threads';

@Component({
  selector: 'app-detail-user',
  templateUrl: './detail_user.component.html',
  styleUrls: ['./detail_user.component.css']
})
export class DetailUserComponent implements OnInit {
  
  // Init Param
  public action: string = "";
  public id: number = -1;

  public buttonTitle: string = "Aggiorna Utente";
  public isEdit: boolean = false;

  public user = new User(-1, null, "", "", "", "", "", true, "", null, "", null, null, null);
  public userLogged;

  private mySubscription: Subscription;
  private saveSubscription: Subscription;
  private listRuoliSubscription: Subscription;

  public listRuoli: Array<UserRole>;
  public defRuoloId: number = -1;

  public nameCtrl = new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]);
  public emailCtrl = new FormControl('', [Validators.required, Validators.email, Validators.maxLength(250)]);
  public usernameCtrl = new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(250)]);
  public passwordCtrl = new FormControl('', []);
  public validFromCtrl = new FormControl('', [Validators.required]);
  public validToCtrl = new FormControl('', [Validators.required]);
  public ruoloCtrl = new FormControl('', [Validators.required]);

  constructor(private route: ActivatedRoute,
              private authService: AuthService,
              private common: CommonService,
              private userService: UserService) { }

  ngOnInit() {
    this.common.sendUpdate("showSpinner");

    this.userLogged = this.authService.getUser();

    this.action = this.route.snapshot.paramMap.get('action');
    this.id = +this.route.snapshot.paramMap.get('id');

    if(this.action == "create")
    {
      this.isEdit = true;
      this.buttonTitle = "Crea Utente";
    }
    else if(this.action == "edit")
    {
      this.isEdit = true;
    }
    else
    {
      this.isEdit = false;
      this.nameCtrl.disable();
      this.emailCtrl.disable();
      this.usernameCtrl.disable();
      this.passwordCtrl.disable();
      this.ruoloCtrl.disable();
    }


    let authToken: string = this.authService.getAuthToken();

    this.listRuoliSubscription = this.userService.getRuoliList(authToken).subscribe(res =>
      {
        this.listRuoli = res as Array<UserRole>;

        this.mySubscription = this.userService.getUser(authToken, this.id).subscribe(res => 
        {
            this.user = res as User;

            if(this.user.ruoloUtente)
            {
              this.defRuoloId = this.user.ruoloUtente.id;
            }

            // console.log(this.user);
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
  }

  salvaUtente()
  {
    this.common.sendUpdate("showSpinner");

    if(this.defRuoloId)
    {
      let appRole: UserRole = this.getRuoloById(this.defRuoloId);

      if(appRole)
      {
        if(appRole.id)
        {
          this.user.ruoloUtente = appRole;
        }
      }
    }

    if(this.action == "create" && this.user.password == "")
    {
      this.common.sendUpdate("showAlertDanger", "Inserire una Password!");
    }
    else
    {
      if(this.nameCtrl.valid == true)
      {
        if(this.emailCtrl.valid == true)
        {
          if(this.usernameCtrl.valid == true)
          {
            if(this.validFromCtrl.valid == true)
            {
              if(this.validToCtrl.valid == true)
              {
                let authToken: string = this.authService.getAuthToken();
                this.saveSubscription = this.userService.saveUser(authToken, this.user, this.userLogged.name).subscribe((res: boolean) => 
                  {
                    if(res)
                    {
                      //console.log(res);
                      this.common.sendUpdate("showAlertInfo", "Utente salvato correttamente!");
  
                      this.common.redirectToUrl('/users');
                      this.common.sendUpdate("hideSpinner");
                    }
                    else
                    {
                      this.common.sendUpdate("hideSpinner");
                      this.common.sendUpdate("showAlertDanger", "Impossibile salvare l'utente al momento.");
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

  getRuoloById(role_id: number): UserRole
  {
    let returnRole: UserRole;
    this.listRuoli.forEach(ruolo => 
    {
      if(ruolo.id == role_id)
      {
        returnRole = ruolo;
      }
    });

    return returnRole;
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

  getEmailErrorMessage() {
    if(this.emailCtrl.hasError('maxlength'))
    {
      return "L'Email deve contenere al massimo 250 caratteri";
    }
    else if(this.emailCtrl.hasError('required'))
    {
      return "Email non valida";
    }
    else if(this.emailCtrl.hasError('email'))
    {
      return "Email non valida";
    }
    else
    {
      return "";
    }
  }

  getUsernameErrorMessage() {
    if(this.usernameCtrl.hasError('minlength'))
    {
      return "Lo username deve contenere minimo 3 caratteri";
    }
    else if(this.usernameCtrl.hasError('maxlength'))
    {
      return "Lo username deve contenere al massimo 250 caratteri";
    }
    else if(this.usernameCtrl.hasError('required'))
    {
      return "Username non valido";
    }
    else
    {
      return "";
    }
  }

  getPasswordErrorMessage() {
    return this.emailCtrl.hasError('password') ? 'Password non valida' : '';
  }

  getValidFromErrorMessage() {
    if(this.validFromCtrl.hasError('required'))
    {
      return "Data Inizio Validità non valida";
    }
    else
    {
      return "";
    }
  }

  getValidToErrorMessage() {
    if(this.validToCtrl.hasError('required'))
    {
      return "Data Fine Validità non valida";
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

    if(this.listRuoliSubscription)
      this.listRuoliSubscription.unsubscribe();
  }

}
