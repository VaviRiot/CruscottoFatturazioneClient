import { Component, OnInit } from '@angular/core';
import { User } from 'app/models/User';
import { NgxSpinnerService } from "ngx-spinner";
import { AlertService } from 'ngx-alerts';
import { AuthService } from 'app/shared/Service/AuthService/auth.service';
import { LoginRequest } from 'app/models/Request/LoginRquest';
import { Subscription } from 'rxjs';
import { CommonService } from 'app/shared/Service/Common/common.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  currentUser: User;
  
  username: string;
  password: string;
  
  private myLogSubscription: Subscription;
  private myRegSubscription: Subscription;

  constructor(private authService: AuthService,
              private spinner: NgxSpinnerService,
              private alertService: AlertService,
              private common: CommonService) { }

  ngOnInit() {
    this.spinner.show("pageSpinner");

    if (this.authService.isLoggedIn())
    {
      if(this.currentUser && this.currentUser.isNew)
      {
        this.common.redirectToUrl('/change_password');
      }
      else
      {
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
      }
    }

    this.spinner.hide("pageSpinner");

  }

  checkKeyDownPress(event) {
    if (event.keyCode === 13) {
      this.login();
    }
  }

  login()
  {
    this.spinner.show("pageSpinner");
    let logReq = new LoginRequest(this.username, this.password);

    // console.log(logReq);
    // debugger;

    this.myLogSubscription = this.authService.serverLogin(logReq).subscribe(res => {
      console.log(res);
      
      this.currentUser = res as User;
      
      // let authToken: string = this.currentUser.token.toString();

      this.myRegSubscription = this.authService.registerLogin(this.currentUser).subscribe(() =>
      {
        if (this.authService.isLoggedIn())
        {
          if(this.currentUser.isNew)
          {
            this.common.redirectToUrl('/change_password');
          }
          else
          {
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
          }
        }
          // console.log(this.currentUser.ruoloUtente.id);
          
          // switch (this.currentUser.ruoloUtente.id) 
          // {
          //   case UserRoleEnum.Admin:
          //   case UserRoleEnum.Manager:
          //   case UserRoleEnum.Ref_Area:
          //   case UserRoleEnum.Uff_Crediti:
          //   case UserRoleEnum.Uff_Garanzie:
          //     this.common.redirectToUrl('/dashboard');
          //     break;
          // }
      }, error => 
      {
        // console.log(error.error);
        // console.log(error);
        this.spinner.hide("pageSpinner");
        this.alertService.danger("Errore durante il recupero delle credenziali.");
      });

    }, error => 
    {
      // console.log(error.error);
      // console.log(error);
      this.spinner.hide("pageSpinner");
      this.alertService.danger("Errore durante il recupero delle credenziali.");
    });

    this.spinner.hide("pageSpinner");
  }

  ngOnDestroy(): void {
    ///qui viene distrutto il componente
    if(this.myLogSubscription)
    this.myLogSubscription.unsubscribe();

    if(this.myRegSubscription)
    this.myRegSubscription.unsubscribe();
  }

}
