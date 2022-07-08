import { CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Articoli } from 'app/models/Articoli';
import { Corrispettivi } from 'app/models/Corrispettivi';
import { Fattura, Cliente } from 'app/models/Fatture';
import { ArticoliService } from 'app/shared/Service/Articoli/articoli.service';
import { AuthService } from 'app/shared/Service/AuthService/auth.service';
import { CommonService } from 'app/shared/Service/Common/common.service';
import { CorrispettiviService } from 'app/shared/Service/Corrispettivi/corrispettivi.service';
import { FattureService } from 'app/shared/Service/Fatture/fatture.service';
import { UserService } from 'app/shared/Service/User/user.service';
import * as moment from 'moment';
import { Observable, of, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';

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
  filteredOptionsCorrispettivi: Observable<string[]>;
  addForm: FormGroup;
  articoliList: Articoli[] = [];
  corrispettiviList: Corrispettivi[] = [];
  articoliListString: string[] = [];
  corrispettiviListString: string[] = [];
  rows: FormArray;
  itemForm: FormGroup;
  indexSelected = 0;
  searchCtrl = new FormControl();

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private common: CommonService,
    private fattureService: FattureService,
    private articoliService: ArticoliService,
    private fb: FormBuilder,
    private articoloService: ArticoliService,
    private corrispettiviService: CorrispettiviService,
    private currencyPipe: CurrencyPipe

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
    await this.getCorrispettiviList();

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
    }, error => {
      this.common.sendUpdate("hideSpinner");
    });
  }

  async getCorrispettiviList() {
    let authToken: string = this.authService.getAuthToken();

    await this.corrispettiviService.getCorrispettiviList(authToken).toPromise().then(res => {
      this.corrispettiviList = res;
      this.corrispettiviList.forEach(element => {
        this.corrispettiviListString.push(element.descrizione.toString())
      });

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
            let array = this.addForm.get('rows') as FormArray;
            array.controls.forEach(el => {
              let idCorrispettivo = this.corrispettiviList.filter(x => x.descrizione == el.value.codiceCorrispettivo)[0];
              if (el.value.codiceCorrispettivo == idCorrispettivo.descrizione) {
                el.patchValue({ codiceCorrispettivo: idCorrispettivo.codiceCorrispettivo });
              }
            });
            this.fattura.importo = 0.0;
            this.fattura.listaDettaglioFattura = array.value;
            this.fattura.dataFattura = moment().toDate();
            this.fattura.societa = this.userLogged.selectedSocieta;
            this.fattura.statoFattura = '';
            this.saveSubscription = this.fattureService.saveFattura(authToken, this.fattura, this.userLogged.name).subscribe((res: boolean) => {
              if (res) {
                //console.log(res);
                this.common.sendUpdate("showAlertInfo", "Fattura salvata correttamente!");

                this.common.sendUpdate("hideSpinner");
              }
              else {
                this.common.sendUpdate("hideSpinner");
                this.common.sendUpdate("showAlertDanger", "Impossibile salvare la fattura al momento.");
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


  getClientById(event: any) {
    let authToken: string = this.authService.getAuthToken();
    this.fattureService.getClienteById(authToken, event.target.value).subscribe(res => {
      let result = res as Cliente;
      this.denominazioneCtrl.setValue(result.ragioneSociale);
      this.pIvaCtrl.setValue(result.partitaIva);

    })
  }

  get formArr() {
    return (this.addForm.get('rows') as FormArray).controls;
  }

  getArticoloById(event: any, index) {
    let authToken: string = this.authService.getAuthToken();
    let value = this.articoliList.filter(x => x.codiceArticolo == event.source.value)[0];
    let array = this.addForm.get('rows') as FormArray;
    let findIndex = array.controls.findIndex(x => x.value.codiceArticolo == event.source.value && x.value.codiceCorrispettivo == array.controls[index].value.codiceCorrispettivo);
    if (findIndex >= 0) {
      this.common.sendUpdate("showAlertDanger", "La combinazione tra Articolo e Combinazione è già esistente");
      array.controls[index].patchValue({ codiceArticolo: null, codiceCorrispettivo: null })
    } else {
      this.articoloService.getArticoloById(authToken, value?.id).subscribe(res => {
        let result = res as Articoli;
        let array = this.addForm.get('rows') as FormArray;
        array.controls[index].patchValue({ 'descrizioneArticolo': result.descrizione })
      })
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }


  private _filterArticoli(object: any): string[] {
    let array = object != '' ? object.rows : null;
    let value = object != '' ? array[this.indexSelected]?.codiceArticolo : '';
    const filterValue = value ? value.toLowerCase() : '';
    return this.articoliListString.filter(option => option.toLowerCase().includes(filterValue));
  }


  private _filterCorrispettivi(object: any): string[] {
    let array = object != '' ? object.rows : null;
    let value = object != '' ? array[this.indexSelected]?.codiceCorrispettivo : '';
    const filterValue = value ? value.toLowerCase() : '';
    return this.corrispettiviListString.filter(option => option.toLowerCase().includes(filterValue));
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
    this.filteredOptionsArticoli = this.addForm.valueChanges.pipe(
      startWith(''),
      map(value => this._filterArticoli(value || '')),
    );
    this.filteredOptionsCorrispettivi = this.addForm.valueChanges.pipe(
      startWith(''),
      map(value => this._filterCorrispettivi(value || '')),
    );
    this.updateTable();

  }

  updateTable() {
    this.formArr$ = this.searchCtrl.valueChanges.pipe(
      startWith(''),
      distinctUntilChanged(),
      switchMap(val => {
        return of(this.formArr as AbstractControl[]).pipe(
          map((formArr: AbstractControl[]) =>
            formArr.filter((group: AbstractControl) => {
              return group.get('codiceArticolo').value
                .toLowerCase()
                .includes(val.toLowerCase());
            })
          )
        );
      })
    );
  }

  formArr$ = this.searchCtrl.valueChanges.pipe(
    startWith(''),
    distinctUntilChanged(),
    switchMap(val => {
      return of(this.formArr as AbstractControl[]).pipe(
        map((formArr: AbstractControl[]) =>
          formArr.filter((group: AbstractControl) => {
            return group.get('codiceArticolo').value
              .toLowerCase()
              .includes(val.toLowerCase());
          })
        )
      );
    })
  );

  onRemoveRow(rowIndex: number) {
    this.rows.removeAt(rowIndex);
    this.updateTable();
  }

  getCheckCorrispettivo(event: any, index) {
    let array = this.addForm.get('rows') as FormArray;
    let findIndex = array.controls.findIndex(x => x.value.codiceCorrispettivo == event.source.value && x.value.codiceArticolo == array.controls[index].value.codiceArticolo);
    if (findIndex >= 0) {
      this.common.sendUpdate("showAlertDanger", "La combinazione tra Articolo e Corrispettivo è già esistente");
      array.controls[index].patchValue({ codiceArticolo: null, codiceCorrispettivo: null, descrizioneArticolo: null })
    }
  }

  createItemFormGroup(): FormGroup {
    return this.fb.group({
      codiceArticolo: "",
      descrizioneArticolo: null,
      codiceCorrispettivo: null,
      importo: "",
      note: null,
      create_user: this.userLogged.createUser
    });
  }

  transformAmount(element, index) {
    let array = this.addForm.get('rows') as FormArray;
    let value = array.controls[index].value.importo;
    value = value.replace(',', '.');
    value = value.replace('€', '');
    value = parseFloat(value);
    array.controls[index].value.importo = this.currencyPipe.transform(value, 'EUR', true);
    return element.target.value = array.controls[index].value.importo;
  }

  getSumTotal() {
    let array = this.addForm.get('rows') as FormArray;
    let total = 0.0;
    let totalString = '';
    for (var i in array.controls) {
      if (array.controls[i].value.importo != '') {
        var value = array.controls[i].value.importo;
        value = value.replace('.', '');
        value = value.replace(',', '.');
        value = value.replace('€', '');
        value = parseFloat(value);
        total += value
      }
    }
    totalString = total ? this.currencyPipe.transform(total, 'EUR') : '';

    return totalString;
  }
}
