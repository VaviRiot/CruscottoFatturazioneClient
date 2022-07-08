import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Articoli } from 'app/models/Articoli';
import { Corrispettivi } from 'app/models/Corrispettivi';
import { ArticoliService } from 'app/shared/Service/Articoli/articoli.service';
import { AuthService } from 'app/shared/Service/AuthService/auth.service';
import { CommonService } from 'app/shared/Service/Common/common.service';
import { CorrispettiviService } from 'app/shared/Service/Corrispettivi/corrispettivi.service';
import { Subscription } from 'rxjs';
import * as moment from 'moment';

@Component({
  selector: 'app-detail-corrispettivo',
  templateUrl: './detail-corrispettivo.component.html',
  styleUrls: ['./detail-corrispettivo.component.css']
})
export class DetailCorrispettivoComponent implements OnInit {
  // Init Param
  public action: string = "";
  public id: number = -1;

  public buttonTitle: string = "Aggiorna Corrispettivo";
  public isEdit: boolean = false;

  public corrispettivo = new Corrispettivi(-1, null, "", moment("31/12/2050", "DD/MM/YYYY").toDate(), "", moment().toDate(), "", null, "");
  public userLogged;

  private mySubscription: Subscription;
  private saveSubscription: Subscription;

  public codiceCorrispettivoCtrl = new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(3)]);
  public descrizioneCtrl = new FormControl('', [Validators.required, Validators.maxLength(35)]);
  public validToCtrl = new FormControl('', [Validators.required]);
  public validFromCtrl = new FormControl('', [Validators.required]);


  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private common: CommonService,
    private corrispettivoService: CorrispettiviService

  ) { }

  ngOnInit() {
    this.common.sendUpdate("showSpinner");

    this.userLogged = this.authService.getUser();

    this.action = this.route.snapshot.paramMap.get('action');
    this.id = +this.route.snapshot.paramMap.get('id');

    if (this.action == "create") {
      this.isEdit = true;
      this.buttonTitle = "Crea Corrispettivo";
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
    this.mySubscription = this.corrispettivoService.getcorrispettivoById(authToken, this.id).subscribe(res => {
      this.corrispettivo = res as Corrispettivi;
      this.common.sendUpdate("hideSpinner");

      // console.log(this.user);
    },
      error => {
        // console.log("getTopSummary");
        // console.log(error);
        this.common.sendUpdate("hideSpinner");
        this.common.sendUpdate("showAlertDanger", error.message);
      });
  }

  salvaCorrispettivo() {
    this.common.sendUpdate("showSpinner");

    if (this.codiceCorrispettivoCtrl.valid == true) {
      if (this.descrizioneCtrl.valid == true) {
        if (this.validFromCtrl.valid == true) {
          if (this.validToCtrl.valid == true) {
            let authToken: string = this.authService.getAuthToken();
            this.saveSubscription = this.corrispettivoService.saveCorrispettivo(authToken, this.corrispettivo, this.userLogged.name).subscribe((res: boolean) => {
              if (res) {
                //console.log(res);
                this.common.sendUpdate("showAlertInfo", "Corrispettivo salvato correttamente!");

                this.common.redirectToUrl('/corrispettivi');
                this.common.sendUpdate("hideSpinner");
              }
              else {
                this.common.sendUpdate("hideSpinner");
                this.common.sendUpdate("showAlertDanger", "Impossibile salvare il corrispettivo al momento.");
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

    this.common.sendUpdate("hideSpinner");
  }


  // VALIDATION
  getCodiceCorispettivoErrorMessage() {
    if (this.codiceCorrispettivoCtrl.hasError('minlength')) {
      return "Il codice deve contenere minimo 1 caratteri";
    }
    else if (this.codiceCorrispettivoCtrl.hasError('maxlength')) {
      return "Il codice deve contenere al massimo 3 caratteri";
    }
    else if (this.codiceCorrispettivoCtrl.hasError('required')) {
      return "Codice non valido";
    }
    else {
      return "";
    }
  }

  getValidFromErrorMessage() {
    if (this.validFromCtrl.hasError('required')) {
      return "Data Inizio Validità non valida";
    }
    else {
      return "";
    }
  }

  getValidToErrorMessage() {
    if (this.validToCtrl.hasError('required')) {
      return "Data Fine Validità non valida";
    }
    else {
      return "";
    }
  }

  getDescrizioneErrorMessage() {
    if (this.descrizioneCtrl.hasError('maxlength')) {
      return "La descrizione deve contenere al massimo 35 caratteri";
    }
    else if (this.descrizioneCtrl.hasError('required')) {
      return "La descrizione non valida";
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
