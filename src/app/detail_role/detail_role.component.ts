import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'app/models/User';
import { UserRole } from 'app/models/UserRole';
import { AuthService } from 'app/shared/Service/AuthService/auth.service';
import { CommonService } from 'app/shared/Service/Common/common.service';
import { RolesService } from 'app/shared/Service/Roles/roles.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-detail-role',
  templateUrl: './detail_role.component.html',
  styleUrls: ['./detail_role.component.css']
})
export class DetailRoleComponent implements OnInit {
  
  // Init Param
  public action: string = "";
  public id: number = -1;

  public buttonTitle: string = "Aggiorna Ruolo";
  public isEdit: boolean = false;

  public role = new UserRole(-1, "", "", false, "", "", null, "", null);
  public userLogged: User;

  private mySubscription: Subscription;
  private saveSubscription: Subscription;

  public nameCtrl = new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]);
  public emailCtrl = new FormControl('', [Validators.email, Validators.maxLength(250)]);
  public descrizioneCtrl = new FormControl('', [Validators.maxLength(500)]);
  
  constructor(private router: Router,
              private route: ActivatedRoute,
              private authService: AuthService,
              private common: CommonService,
              private roleService: RolesService
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
      this.buttonTitle = "Crea Ruolo";
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
      this.descrizioneCtrl.disable();
    }

    let auth_token: string = this.authService.getAuthToken();

    this.mySubscription = this.roleService.getRole(auth_token, this.id).subscribe(res => 
    {
        this.role = res as UserRole;

        // console.log(this.role);
        this.common.sendUpdate("hideSpinner");
    },
    error => {
      // console.log("getTopSummary");
      // console.log(error);

      this.common.sendUpdate("hideSpinner");
      this.common.sendUpdate("showAlertDanger", error.message);
    });
  }

  salvaRuolo()
  {
    this.common.sendUpdate("showSpinner");

    if(this.nameCtrl.valid == true)
    {
      if(this.emailCtrl.valid == true)
      {
        if(this.descrizioneCtrl.valid == true)
        {
          let auth_token: string = this.authService.getAuthToken();

          if(this.role.isAdmin == null)
          {
            this.role.isAdmin = false;
          }

          this.saveSubscription = this.roleService.saveRole(auth_token, this.role, this.userLogged.name).subscribe((res: boolean) => 
            {
              if(res)
              {
                //console.log(res);
                this.common.sendUpdate("showAlertInfo", "Ruolo salvato correttamente!");

                this.common.redirectToUrl('/roles');
                this.common.sendUpdate("hideSpinner");
              }
              else
              {
                this.common.sendUpdate("hideSpinner");
                this.common.sendUpdate("showAlertDanger", "Impossibile salvare il ruolo al momento.");
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

    this.common.sendUpdate("hideSpinner");
  }

  toggleChange(value: boolean) {
    // console.log(value);
        
    this.role.isAdmin = value;
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
    else if(this.emailCtrl.hasError('email'))
    {
      return "Email non valida";
    }
    else
    {
      return "";
    }
  }

  getDescrizioneErrorMessage() {
    if(this.descrizioneCtrl.hasError('maxlength'))
    {
      return "La descrizione deve contenere al massimo 500 caratteri";
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
