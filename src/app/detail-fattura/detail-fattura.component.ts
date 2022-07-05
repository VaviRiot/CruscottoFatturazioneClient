import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Articoli } from 'app/models/Articoli';
import { Corrispettivi } from 'app/models/Corrispettivi';
import { Fattura, Cliente } from 'app/models/Fatture';
import { ArticoliService } from 'app/shared/Service/Articoli/articoli.service';
import { AuthService } from 'app/shared/Service/AuthService/auth.service';
import { CommonService } from 'app/shared/Service/Common/common.service';
import { CorrispettiviService } from 'app/shared/Service/Corrispettivi/corrispettivi.service';
import { FattureService } from 'app/shared/Service/Fatture/fatture.service';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
@Component({
  selector: 'app-detail-fattura',
  templateUrl: './detail-fattura.component.html',
  styleUrls: ['./detail-fattura.component.css']
})
export class DetailFatturaComponent implements OnInit {
  // Init Param
  public action: string = "";
  public id: number = -1;

  public buttonTitle: string = "Aggiorna Corrispettivo";
  public isEdit: boolean = false;
  public cliente = new Cliente(null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
  public fattura = new Fattura(null, null, null, null, this.cliente, null, 'In Compilazione', null, null, null, null, null, null, null);
  public userLogged;

  private mySubscription: Subscription;
  private saveSubscription: Subscription;

  public idFatturaCtrl = new FormControl('');
  public codiceClienteCtrl = new FormControl('', [Validators.required, Validators.maxLength(9)]);
  public denominazioneCtrl = new FormControl('', [Validators.required]);
  public pIvaCtrl = new FormControl('', [Validators.required, Validators.maxLength(9)]);
  public tipoFatturaCtrl = new FormControl('', [Validators.required]);;
  options: string[] = []; 
  filteredOptions: Observable<string[]>;
  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private common: CommonService,
    private fattureService: FattureService

  ) { }

  ngOnInit() {
    let authToken: string = this.authService.getAuthToken();

    this.common.sendUpdate("showSpinner");
    this.userLogged = this.authService.getUser();
    this.action = this.route.snapshot.paramMap.get('action');
    this.id = +this.route.snapshot.paramMap.get('id');
    this.fattureService.getListClienti(authToken, this.userLogged.selectedSocieta).subscribe(client => {
      let result = client as Array<Cliente>;
      result.forEach(elm => {
        this.options.push(elm.codiceCliente);
        this.filteredOptions = this.codiceClienteCtrl.valueChanges.pipe(
          startWith(''),
          map(value => this._filter(value || '')),
        );

      });
      this.common.sendUpdate("hideSpinner");

    }, error => {

    })

    if (this.action == "create") {
      this.isEdit = true;
      this.buttonTitle = "Crea Fattura";
      this.common.sendUpdate("hideSpinner");
    }
    else if (this.action == "edit") {
      this.isEdit = true;
      this.mySubscription = this.fattureService.getFatturaById(authToken, this.id).subscribe(res => {
        this.common.sendUpdate("hideSpinner");

        this.fattura = res as Fattura;

        // console.log(this.user);
      },
        error => {
          // console.log("getTopSummary");
          // console.log(error);
          this.common.sendUpdate("hideSpinner");
          this.common.sendUpdate("showAlertDanger", error.message);
        });
    }
    else {
      this.isEdit = false;
      this.common.sendUpdate("hideSpinner");

    }
  }

  salvaFattura() {
    this.common.sendUpdate("showSpinner");

    if (this.idFatturaCtrl.valid == true) {
      if (this.codiceClienteCtrl.valid == true) {
        if (this.denominazioneCtrl.valid == true) {
          if (this.pIvaCtrl.valid == true) {
            let authToken: string = this.authService.getAuthToken();
            this.saveSubscription = this.fattureService.saveFattura(authToken, this.fattura, this.userLogged.name).subscribe((res: boolean) => {
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
  // getCodiceCorispettivoErrorMessage() {
  //   if (this.codiceCorrispettivoCtrl.hasError('minlength')) {
  //     return "Il codice deve contenere minimo 1 caratteri";
  //   }
  //   else if (this.codiceCorrispettivoCtrl.hasError('maxlength')) {
  //     return "Il codice deve contenere al massimo 3 caratteri";
  //   }
  //   else if (this.codiceCorrispettivoCtrl.hasError('required')) {
  //     return "Codice non valido";
  //   }
  //   else {
  //     return "";
  //   }
  // }


  getClientById(event: any) {
    let authToken: string = this.authService.getAuthToken();

    this.fattureService.getClienteById(authToken, event.target.value).subscribe(res => {
      let result = res as Cliente;
      this.denominazioneCtrl.setValue(result.ragioneSociale);
      this.pIvaCtrl.setValue(result.partitaIva);

    })
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }


  ngOnDestroy(): void {
    ///qui viene distrutto il componente
    if (this.mySubscription)
      this.mySubscription.unsubscribe();

    if (this.saveSubscription)
      this.saveSubscription.unsubscribe();

  }
}
