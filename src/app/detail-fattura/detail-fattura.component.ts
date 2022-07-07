import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
  filteredOptionsArticoli: Observable<string[]>;

  addForm: FormGroup;
  articoliList: Articoli[] = [];
  articoliListString: string[] = [];
  rows: FormArray;
  itemForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private common: CommonService,
    private fattureService: FattureService,
    private articoliService: ArticoliService,
    private fb: FormBuilder

  ) {
    this.addForm = this.fb.group({
      items: [null, Validators.required],
      items_value: ['on', Validators.required]
    });

    this.rows = this.fb.array([]);
  }

  ngOnInit() {
    this.initialRequest();
  }


  async initialRequest() {
    this.common.sendUpdate("showSpinner");
    this.userLogged = this.authService.getUser();
    this.action = this.route.snapshot.paramMap.get('action');
    this.id = +this.route.snapshot.paramMap.get('id');
    this.addForm.addControl('rows', this.rows);
    await this.getListaClienti();
    await this.getArticoliList();

    if (this.action == "create") {
      this.isEdit = true;
      this.buttonTitle = "Crea Fattura";
    }
    else if (this.action == "edit") {
      this.isEdit = true;
      await this.getFatturaById();
    }
    else {
      this.isEdit = false;
    }
    this.common.sendUpdate("hideSpinner");
  }

  async getArticoliList() {
    let authToken: string = this.authService.getAuthToken();

    await this.articoliService.getArticoliList(authToken).toPromise().then(res => {
      this.articoliList = res;
      this.articoliList.forEach(element => {
          this.articoliListString.push(element.codiceArticolo.toString())
      });
      this.filteredOptionsArticoli = this.addForm.valueChanges.pipe(
        startWith(''),
        map(value => this._filterArticoli(value || '')),
      );

    }, error => {
      this.common.sendUpdate("hideSpinner");

    });
  }

  async getFatturaById() {
    let authToken: string = this.authService.getAuthToken();
    await this.fattureService.getFatturaById(authToken, this.id).toPromise().then(res => {
      this.fattura = res as Fattura;
    },
      error => {
        this.common.sendUpdate("showAlertDanger", error.message);
      });
  }

  async getListaClienti() {
    let authToken: string = this.authService.getAuthToken();
    this.common.sendUpdate("showSpinner");
    this.userLogged = this.authService.getUser();
    this.action = this.route.snapshot.paramMap.get('action');
    this.id = +this.route.snapshot.paramMap.get('id');
    await this.fattureService.getListClienti(authToken, this.userLogged.selectedSocieta).toPromise().then(client => {
      let result = client as Array<Cliente>;
      result.forEach(elm => {
        this.options.push(elm.codiceCliente);
        this.filteredOptions = this.codiceClienteCtrl.valueChanges.pipe(
          startWith(''),
          map(value => this._filter(value || '')),
        );
      });
    }, error => {
    });
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


  private _filterArticoli(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.articoliListString.filter(option => option.toLowerCase().includes(filterValue));
  }

  ngOnDestroy(): void {
    ///qui viene distrutto il componente
    if (this.mySubscription)
      this.mySubscription.unsubscribe();

    if (this.saveSubscription)
      this.saveSubscription.unsubscribe();
  }

  onAddRow() {
    this.rows.push(this.createItemFormGroup());
  }

  onRemoveRow(rowIndex: number) {
    this.rows.removeAt(rowIndex);
  }

  createItemFormGroup(): FormGroup {
    return this.fb.group({
      idArticolo: null,
      descrizioneArticolo: null,
      corrispettivo: null,
      importo: null,
      note: null
    });
  }

}
