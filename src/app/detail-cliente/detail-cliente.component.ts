import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Articoli } from 'app/models/Articoli';
import { ArticoliService } from 'app/shared/Service/Articoli/articoli.service';
import { AuthService } from 'app/shared/Service/AuthService/auth.service';
import { CommonService } from 'app/shared/Service/Common/common.service';
import { UserService } from 'app/shared/Service/User/user.service';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { Cliente } from 'app/models/Fatture';
import { ProspectService } from 'app/shared/Service/Prospect/prospect.service';
import { FattureService } from 'app/shared/Service/Fatture/fatture.service';

@Component({
  selector: 'app-detail-cliente',
  templateUrl: './detail-cliente.component.html',
  styleUrls: ['./detail-cliente.component.css']
})
export class DetailClienteComponent implements OnInit {

  // Init Param
  public action: string = "";
  public id: number = -1;

  public buttonTitle: string = "Aggiorna Cliente";
  public isEdit: boolean = false;

  public cliente = new Cliente('', null, null, null, null, null, null, null, null, null, null, null, null, null, null);
  public userLogged;

  private mySubscription: Subscription;
  private saveSubscription: Subscription;

  public codiceClienteCtrl = new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(10)]);

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private common: CommonService,
    private fattureService: FattureService,
    private prospectService: ProspectService

  ) { }

  ngOnInit() {
    this.common.sendUpdate("showSpinner");

    this.userLogged = this.authService.getUser();

    this.action = this.route.snapshot.paramMap.get('action');
    this.id = +this.route.snapshot.paramMap.get('id');

    if (this.action == "create") {
      this.isEdit = true;
      this.buttonTitle = "Crea Cliente";
      this.common.sendUpdate("hideSpinner");
    }
    else if (this.action == "edit") {
      this.isEdit = true;
      this.getDetail();

    }
    else {
      this.isEdit = false;
      this.getDetail();

    }
  }


  getDetail() {
    let authToken: string = this.authService.getAuthToken();
    //this.isEdit = true;
    this.mySubscription = this.fattureService.getClienteById(authToken, this.id).subscribe(res => {
      this.cliente = res as Cliente;
      this.common.sendUpdate("hideSpinner");
    },
      error => {
        // console.log("getTopSummary");
        // console.log(error);
        this.common.sendUpdate("hideSpinner");
        this.common.sendUpdate("showAlertDanger", error.message);
      });
  };

  salvaCliente() {
    this.common.sendUpdate("showSpinner");
    let authToken: string = this.authService.getAuthToken();
    if (this.codiceClienteCtrl.valid == true) {
      this.cliente.societa = this.userLogged.selectedSocieta;
      this.cliente.codiceCliente = this.cliente.codiceCliente;
      if (this.action == "create") {
        this.saveSubscription = this.prospectService.saveCliente(authToken, this.cliente, this.userLogged.name).subscribe((res) => {
          if (!res['errore']) {
            //console.log(res);
            this.common.sendUpdate("showAlertInfo", "Cliente salvato correttamente!");

            this.common.redirectToUrl('/customers');
            this.common.sendUpdate("hideSpinner");
          }
          else {
            this.codiceClienteCtrl.setErrors({ codice: true })
            this.common.sendUpdate("hideSpinner");
            this.common.sendUpdate("showAlertDanger", !res['errore'] ? "Impossibile salvare il cliente al momento." : res['errore']);
          }
        },
          error => {
            // console.log("getTopSummary");
            // console.log(error);

            this.common.sendUpdate("hideSpinner");
            this.common.sendUpdate("showAlertDanger", error.message);
          });
      }
    } else {
      this.saveSubscription = this.prospectService.updateCliente(authToken, this.cliente, this.userLogged.name).subscribe((res: boolean) => {
        if (res) {
          //console.log(res);
          this.common.sendUpdate("showAlertInfo", "Cliente salvato correttamente!");

          this.common.redirectToUrl('/customers');
          this.common.sendUpdate("hideSpinner");
        }
        else {
          this.common.sendUpdate("hideSpinner");
          this.common.sendUpdate("showAlertDanger", "Impossibile salvare il cliente al momento.");
        }
      },
        error => {
          this.common.sendUpdate("hideSpinner");
          this.common.sendUpdate("showAlertDanger", error.message);
        });
    }
    this.common.sendUpdate("hideSpinner");
  }


  // VALIDATION
  getCodiceArticoloErrorMessage() {
    if (this.codiceClienteCtrl.hasError('minlength')) {
      return "Il codice deve contenere minimo 1 caratteri";
    }
    else if (this.codiceClienteCtrl.hasError('maxlength')) {
      return "Il codice deve contenere al massimo 10 caratteri";
    }
    else if (this.codiceClienteCtrl.hasError('required')) {
      return "Codice non valido";
    } else if (this.codiceClienteCtrl.hasError('codice')) {
      return "Codice cliente già esistente";
    }
    else {
      return "";
    }
  }


  ngOnDestroy(): void {
    ///qui viene distrutto il componente
    if (this.mySubscription)
      this.mySubscription.unsubscribe();

    if (this.saveSubscription)
      this.saveSubscription.unsubscribe();

  }
}
