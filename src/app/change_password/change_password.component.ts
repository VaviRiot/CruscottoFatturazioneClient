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
  selector: 'app-change-password',
  templateUrl: './change_password.component.html',
  styleUrls: ['./change_password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  
  public buttonTitle: string = "Aggiorna Password";

  public userLogged: User;

  public nameCtrl = new FormControl('',[]);

  public passwordPrecedenteCtrl = new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(250)]);
  public confermaPasswordPrecedenteCtrl = new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(250)]);
  public passwordCtrl = new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(250)]);
  public confermaPasswordCtrl = new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(250)]);

  public defPasswordPrecedente: string = "";
  public defConfermaPasswordPrecedente: string = "";
  public defPassword: string = "";
  public defConfermaPassword: string = "";

  private saveSubscription: Subscription;

  constructor(
                private route: ActivatedRoute,
                private authService: AuthService,
                private common: CommonService,
                private userService: UserService
            ) { }

  ngOnInit(): void 
  {
    this.common.sendUpdate("showSpinner");
    this.nameCtrl.disable();

    this.userLogged = this.authService.getUser();
    console.log(this.userLogged);

    this.common.sendUpdate("hideSpinner");
  }

  salvaPassword()
  {
    this.common.sendUpdate("showSpinner");

    if(this.passwordCtrl.valid == true)
      {
        if(this.confermaPasswordCtrl.valid == true)
        {
          if(this.passwordPrecedenteCtrl.valid == true)
          {
            if(this.confermaPasswordPrecedenteCtrl.valid == true)
            {
              if(this.defPasswordPrecedente == this.defConfermaPasswordPrecedente)
              {
                if(this.defPassword == this.defConfermaPassword)
                {
                  let authToken: string = this.authService.getAuthToken();
                  this.saveSubscription = this.userService.changeUserPassword(authToken, this.userLogged.id, this.defPasswordPrecedente, this.defPassword, this.userLogged.name).subscribe((res) => 
                    {
                      if(res.result)
                      {
                        //console.log(res);
                        this.common.sendUpdate("showAlertInfo", "Password salvata correttamente!");

                        let redirectToUrl: string = this.authService.getRedirectUrl();
                        if(redirectToUrl != "")
                        {
                          this.authService.setRedirectUrl("");
                          this.common.redirectToUrl(redirectToUrl);
                        }
                        else
                        {
                          this.common.redirectToUrl('/dashboard');
                        }
                        this.common.sendUpdate("hideSpinner");
                      }
                      else
                      {
                        this.common.sendUpdate("hideSpinner");
                        this.common.sendUpdate("showAlertDanger", res.message);
                      }
                    },
                    error => {
                      // console.log("getTopSummary");
                      // console.log(error);
                
                      this.common.sendUpdate("hideSpinner");
                      this.common.sendUpdate("showAlertDanger", error.message);
                    });
                }
                else
                {
                  this.common.sendUpdate("showAlertDanger", "La password e la conferma password non coincidono.");
                }
              }
              else
              {
                this.common.sendUpdate("showAlertDanger", "La vecchia password e la conferma vecchia password non coincidono.");
              }
            }
          }
        }
      }

    this.common.sendUpdate("hideSpinner");
  }

  // VALIDATION
  getPasswordPrecedenteErrorMessage() {
    if(this.passwordPrecedenteCtrl.hasError('minlength'))
    {
      return "La password precedente deve contenere minimo 8 caratteri";
    }
    else if(this.passwordPrecedenteCtrl.hasError('maxlength'))
    {
      return "La password precedente deve contenere al massimo 250 caratteri";
    }
    else if(this.passwordPrecedenteCtrl.hasError('required'))
    {
      return "Password precedente non valida";
    }
    else
    {
      return "";
    }
  }

  getConfermaPasswordPrecedenteErrorMessage() {
    if(this.confermaPasswordPrecedenteCtrl.hasError('minlength'))
    {
      return "La conferma password precedente deve contenere minimo 8 caratteri";
    }
    else if(this.confermaPasswordPrecedenteCtrl.hasError('maxlength'))
    {
      return "La conferma password precedente deve contenere al massimo 250 caratteri";
    }
    else if(this.confermaPasswordPrecedenteCtrl.hasError('required'))
    {
      return "Conferma password precedente non valida";
    }
    else
    {
      return "";
    }
  }

  getPasswordErrorMessage() {
    if(this.passwordCtrl.hasError('minlength'))
    {
      return "La nuova password deve contenere minimo 8 caratteri";
    }
    else if(this.passwordCtrl.hasError('maxlength'))
    {
      return "La nuova password deve contenere al massimo 250 caratteri";
    }
    else if(this.passwordCtrl.hasError('required'))
    {
      return "Nuova password non valida";
    }
    else
    {
      return "";
    }
  }

  getConfermaPasswordErrorMessage() {
    if(this.confermaPasswordCtrl.hasError('minlength'))
    {
      return "La conferma nuova password deve contenere minimo 8 caratteri";
    }
    else if(this.confermaPasswordCtrl.hasError('maxlength'))
    {
      return "La conferma nuova password deve contenere al massimo 250 caratteri";
    }
    else if(this.confermaPasswordCtrl.hasError('required'))
    {
      return "Conferma nuova password non valida";
    }
    else
    {
      return "";
    }
  }

  ngOnDestroy(): void {
    ///qui viene distrutto il componente
    if(this.saveSubscription)
      this.saveSubscription.unsubscribe();
  }

}
