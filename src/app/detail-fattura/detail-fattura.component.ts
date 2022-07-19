import { CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmMessageComponent } from 'app/modals/confirm_message/confirm_message.component';
import { Articoli } from 'app/models/Articoli';
import { Corrispettivi } from 'app/models/Corrispettivi';
import { Fattura, Cliente } from 'app/models/Fatture';
import { ArticoliService } from 'app/shared/Service/Articoli/articoli.service';
import { AuthService } from 'app/shared/Service/AuthService/auth.service';
import { CommonService } from 'app/shared/Service/Common/common.service';
import { CorrispettiviService } from 'app/shared/Service/Corrispettivi/corrispettivi.service';
import { FattureService } from 'app/shared/Service/Fatture/fatture.service';
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
  public cliente = new Cliente('', '', '', '', '', '', '', '', '', '', '', '', '', '', '');
  public fattura = new Fattura(null, null, null, null, this.cliente, null, '', null, null, null, null, null, null, null);
  public userLogged;

  private mySubscription: Subscription;
  private saveSubscription: Subscription;

  public idFatturaCtrl = new FormControl('');
  public codiceClienteCtrl = new FormControl('', [Validators.required, Validators.maxLength(12)]);
  public denominazioneCtrl = new FormControl('',);
  public pIvaCtrl = new FormControl('', [Validators.maxLength(9)]);
  public tipoFatturaCtrl = new FormControl('', [Validators.required]);;
  options: string[] = [];
  filteredOptions: Observable<string[]>;
  filteredOptionsPiva: Observable<string[]>;
  filteredOptionsDenominazione: Observable<string[]>;
  filteredOptionsArticoli: Observable<string[]>;
  filteredOptionsCorrispettivi: Observable<string[]>;
  filteredOptionsDescrizioneArticoli: Observable<string[]>;
  addForm: FormGroup;
  articoliList: Articoli[] = [];
  articoliDecrizioneListString: any[] = [];
  optionsPiva = [];
  optionsDenominazione = [];
  corrispettiviList: Corrispettivi[] = [];
  articoliListString: string[] = [];
  corrispettiviListString: string[] = [];
  rows: FormArray;
  itemForm: FormGroup;
  indexSelected = 0;
  searchCtrl = new FormControl();
  isApproved = false;
  disabledField: boolean;
  listClient: Cliente[] = [];
  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private common: CommonService,
    private fattureService: FattureService,
    private articoliService: ArticoliService,
    private fb: FormBuilder,
    private articoloService: ArticoliService,
    private corrispettiviService: CorrispettiviService,
    private currencyPipe: CurrencyPipe,
    private dialog: MatDialog

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
    if (this.userLogged.ruoloUtente.name == 'Approvatore') {
      this.isApproved = true;
    }
    this.action = this.route.snapshot.paramMap.get('action');
    this.id = +this.route.snapshot.paramMap.get('id');
    this.addForm.addControl('rows', this.rows);
    await this.getListaClienti();
    await this.getArticoliList();
    await this.getCorrispettiviList();

    if (this.action == "create") {
      this.isEdit = true;
      this.buttonTitle = "Crea Fattura";
      this.disabledField = this.disabledFieldValue();
    }
    else if (this.action == "edit") {
      this.isEdit = true;
      await this.getFatturaById();
      this.disabledField = this.disabledFieldValue();

    }
    else {
      this.isEdit = false;
      await this.getFatturaById();
      this.disabledField = this.disabledFieldValue();

    }
    this.common.sendUpdate("hideSpinner");
  }

  async getArticoliList() {
    let authToken: string = this.authService.getAuthToken();
    await this.articoliService.getArticoliList(authToken).toPromise().then(res => {
      this.articoliList = res;
      this.articoliList.forEach(element => {
        this.articoliListString.push(element.codiceArticolo.toString())
        this.articoliDecrizioneListString.push(element.descrizione)

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
      this.tipoFatturaCtrl.setValue(this.fattura.tipologiaFattura);
      this.fattura.listaDettaglioFattura.forEach(el => {
        let element = this.fb.group({
          codiceArticolo: new FormControl(el.codiceArticolo, Validators.required),
          descrizioneArticolo: new FormControl(el.descrizioneArticolo, Validators.required),
          codiceCorrispettivo: new FormControl(el.descrizioneCorrispettivo, Validators.required),
          importo: new FormControl(this.currencyPipe.transform(el.importo, 'EUR'), Validators.required),
          note: new FormControl(el.note, Validators.required),
          create_user: this.userLogged.createUser
        });

        this.rows.push(element);
      });
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
    await this.fattureService.getClienti(authToken, this.userLogged.selectedSocieta).toPromise().then(client => {
      this.listClient = client as Array<Cliente>
      let result = client as Array<Cliente>;
      result.forEach(elm => {
        this.options.push(elm.codiceCliente);
        this.optionsDenominazione.push(elm.ragioneSociale);
        this.optionsPiva.push(elm.partitaIva);
      });

      this.filteredOptions = this.codiceClienteCtrl.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value || '')),
      );
      this.filteredOptionsDenominazione = this.denominazioneCtrl.valueChanges.pipe(
        startWith(''),
        map(value => this._filterDenominazione(value || '')),
      );
      this.filteredOptionsPiva = this.pIvaCtrl.valueChanges.pipe(
        startWith(''),
        map(value => this._filterPiva(value || '')),
      );

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

            array.value.forEach(element => {
              element.importo = element.importo.replace('.', '');
              element.importo = element.importo.replace(',', '.');
              element.importo = element.importo.replace('€', '');
              element.importo = parseFloat(element.importo);
            });

            this.fattura.importo = 0.0;
            this.fattura.listaDettaglioFattura = array.value;
            this.fattura.dataFattura = moment().toDate();
            this.fattura.societa = this.userLogged.selectedSocieta;
            this.fattura.statoFattura = '';
            this.saveSubscription = this.fattureService.saveFattura(authToken, this.fattura, this.userLogged.name).subscribe((res: Fattura) => {
              if (!res['errore']) {
                this.fattura = res;
                this.tipoFatturaCtrl.setValue(this.fattura.tipologiaFattura);
                this.rows.clear();
                setTimeout(() => {
                  this.fattura.listaDettaglioFattura.forEach(el => {
                    let element = this.fb.group({
                      codiceArticolo: new FormControl(el.codiceArticolo, Validators.required),
                      descrizioneArticolo: new FormControl(el.descrizioneArticolo, Validators.required),
                      codiceCorrispettivo: new FormControl(el.descrizioneCorrispettivo, Validators.required),
                      importo: new FormControl(this.currencyPipe.transform(el.importo, 'EUR'), Validators.required),
                      note: new FormControl(el.note, Validators.required),
                      create_user: this.userLogged.createUser
                    });
                    this.rows.push(element);
                  });
                }, 200);

                //console.log(res);
                this.common.sendUpdate("showAlertInfo", "Fattura salvata correttamente!");

                this.common.sendUpdate("hideSpinner");
              }
              else {
                this.common.sendUpdate("hideSpinner");
                this.common.sendUpdate("showAlertDanger", !res['errore'] ? "Impossibile salvare la fattura al momento." : res['errore']);
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



  clearFilterDescription(index) {
    this.indexSelected = index;
    this.filteredOptionsDescrizioneArticoli = this.addForm.valueChanges.pipe(
      startWith(''),
      map(value => this._filterArticoliDescrizione(value || '')),
    );
  }


  clearFilterCodiceArticolo(index) {
    this.indexSelected = index;
    this.filteredOptionsArticoli = this.addForm.valueChanges.pipe(
      startWith(''),
      map(value => this._filterArticoli(value || '')),
    );
  }


  clearFilterCorrispettivo(index) {
    this.indexSelected = index;
    this.filteredOptionsCorrispettivi = this.addForm.valueChanges.pipe(
      startWith(''),
      map(value => this._filterCorrispettivi(value || '')),
    );
  }

  getClientById(event: any, type: any) {
    let authToken: string = this.authService.getAuthToken();
    let findIndex = this.listClient.findIndex(x => x[type] == event.target.value)
    console.log(findIndex);
    if (findIndex >= 0) {
      let value = this.listClient[findIndex].codiceCliente;
      this.fattureService.getClienteById(authToken, value).subscribe(res => {
        let result = res as Cliente;
        this.codiceClienteCtrl.setValue(result.codiceCliente);
        this.denominazioneCtrl.setValue(result.ragioneSociale);
        this.pIvaCtrl.setValue(result.partitaIva);
      }, error => {
        this.codiceClienteCtrl.setErrors({ 'incorrect': true });
        this.denominazioneCtrl.setErrors({ 'incorrect': true });
        this.pIvaCtrl.setErrors({ 'incorrect': true });
      })
    } else {
      this.codiceClienteCtrl.setErrors({ 'incorrect': true });
      this.denominazioneCtrl.setErrors({ 'incorrect': true });
      this.pIvaCtrl.setErrors({ 'incorrect': true });
    }

  }

  get formArr() {
    return (this.addForm.get('rows') as FormArray).controls;
  }

  getArticoloById(event: any, index, type) {
    let authToken: string = this.authService.getAuthToken();
    let value = this.articoliList.filter(x => x[type] == (event?.source ? event.source.value : event.target.value))[0];
    let array = this.addForm.get('rows') as any;
    if (type == 'descrizione') {
      this.articoloService.getArticoloById(authToken, value?.id).subscribe(res => {
        let result = res as Articoli;
        let array = this.addForm.get('rows') as any;
        array.controls[index].patchValue({ 'descrizioneArticolo': result.descrizione, 'codiceArticolo': result.codiceArticolo })
        let findIndex = array.controls.findIndex((x, j) => j != index && x.value.codiceArticolo == (type == 'descrizione' ? array.controls[index].value.codiceArticolo : (event.source ? event.source.value : event.target.value)) && (x.value.codiceCorrispettivo && x.value.codiceCorrispettivo == array.controls[index].value.codiceCorrispettivo));
        if (findIndex >= 0) {
          this.common.sendUpdate("showAlertDanger", "La combinazione tra Articolo e Corrispettivo è già esistente");
          array.controls[index].controls.codiceArticolo.setErrors({ 'corrispettivo': true });
          array.controls[index].controls.descrizioneArticolo.setErrors({ 'corrispettivo': true });
          array.controls[index].controls.codiceCorrispettivo.setErrors({ 'corrispettivo': true });
        } else {
          array.controls[index].controls.codiceArticolo.setErrors(null);
          array.controls[index].controls.descrizioneArticolo.setErrors(null);
          array.controls[index].controls.codiceCorrispettivo.setErrors(null);
        }
      })
    } else {
      let findIndex = array.controls.findIndex((x, j) => j != index && x.value.codiceArticolo == (event.source ? event.source.value : event.target.value) && (x.value.codiceCorrispettivo && x.value.codiceCorrispettivo == array.controls[index].value.codiceCorrispettivo));
      if (findIndex >= 0) {
        this.common.sendUpdate("showAlertDanger", "La combinazione tra Articolo e Corrispettivo è già esistente");
        array.controls[index].controls.codiceArticolo.setErrors({ 'corrispettivo': true });
        array.controls[index].controls.descrizioneArticolo.setErrors({ 'corrispettivo': true });
        array.controls[index].controls.codiceCorrispettivo.setErrors({ 'corrispettivo': true });
      } else {
        this.articoloService.getArticoloById(authToken, value?.id).subscribe(res => {
          let result = res as Articoli;
          let array = this.addForm.get('rows') as any;
          array.controls[index].patchValue({ 'descrizioneArticolo': result.descrizione, 'codiceArticolo': result.codiceArticolo })
          array.controls[index].controls.codiceArticolo.setErrors(null);
          array.controls[index].controls.descrizioneArticolo.setErrors(null);
          array.controls[index].controls.codiceCorrispettivo.setErrors(null);
        })
      }
    }

  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }



  private _filterDenominazione(value: string): string[] {
    const filterValue = value ? value.toLowerCase() : value;
    return this.optionsDenominazione.filter(option => option ? option.toLowerCase().includes(filterValue) : '');
  }

  private _filterPiva(value: string): string[] {
    const filterValue = value ? value.toLowerCase() : value;
    return this.optionsPiva.filter(option => option ? option.toLowerCase().includes(filterValue) : '');
  }

  private _filterArticoli(object: any): string[] {
    let array = object != '' ? object.rows : null;
    let value = object != '' ? array[this.indexSelected]?.codiceArticolo : '';
    const filterValue = value ? value.toLowerCase() : '';
    return this.articoliListString.filter(option => option.toLowerCase().includes(filterValue));
  }

  private _filterArticoliDescrizione(object: any): string[] {
    let array = object != '' ? object.rows : null;
    let value = object != '' ? array[this.indexSelected]?.descrizioneArticolo : '';
    const filterValue = value ? value.toLowerCase() : '';
    return this.articoliDecrizioneListString.filter(option => option.toLowerCase().includes(filterValue));
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

    setTimeout(() => {
      this.filteredOptionsArticoli = this.addForm.valueChanges.pipe(
        startWith(''),
        map(value => this._filterArticoli(value || '')),
      );

      this.filteredOptionsDescrizioneArticoli = this.addForm.valueChanges.pipe(
        startWith(''),
        map(value => this._filterArticoliDescrizione(value || '')),
      );

      this.filteredOptionsCorrispettivi = this.addForm.valueChanges.pipe(
        startWith(''),
        map(value => this._filterCorrispettivi(value || '')),
      );
      if (this.rows.length > 1) {
        this.rows.markAllAsTouched();
      }
    }, 200);
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
    const dialogConfig = new MatDialogConfig()
    dialogConfig.id = 'confirm-message-modal'
    dialogConfig.height = 'fit-content'
    dialogConfig.width = '25rem';
    const modalDialog = this.dialog.open(ConfirmMessageComponent, dialogConfig);
    modalDialog.componentInstance.messageText = "Sei sicuro di voler eliminare la riga di dettaglio fattura?";
    modalDialog.afterClosed().subscribe(res => {
      if (res == true) {
        this.common.sendUpdate("showSpinner");
        this.rows.removeAt(rowIndex);
        this.updateTable();
        this.common.sendUpdate("showAlertInfo", "Dettaglio rimosso correttamente!");
        this.common.sendUpdate("hideSpinner");
      }
    });

  }

  getCheckCorrispettivo(event: any, index) {
    let array = this.addForm.get('rows') as any;
    let findIndex = array.controls.findIndex((x, j) => j != index && x.value.codiceCorrispettivo == event.option.value && (x.value.codiceArticolo && x.value.codiceArticolo == array.controls[index].value.codiceArticolo));
    if (findIndex >= 0) {
      this.common.sendUpdate("showAlertDanger", "La combinazione tra Articolo e Corrispettivo è già esistente");
      array.controls[index].controls.codiceArticolo.setErrors({ 'corrispettivo': true });
      array.controls[index].controls.descrizioneArticolo.setErrors({ 'corrispettivo': true });
      array.controls[index].controls.codiceCorrispettivo.setErrors({ 'corrispettivo': true });
    } else {
      array.controls[index].controls.codiceArticolo.setErrors(null);
      array.controls[index].controls.descrizioneArticolo.setErrors(null);
      array.controls[index].controls.codiceCorrispettivo.setErrors(null);
    }
  }

  createItemFormGroup(): FormGroup {
    return this.fb.group({
      codiceArticolo: new FormControl('', Validators.required),
      descrizioneArticolo: new FormControl('', Validators.required),
      codiceCorrispettivo: new FormControl('', Validators.required),
      importo: new FormControl('', Validators.required),
      note: new FormControl('', Validators.required),
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
      if (array.controls[i].value.importo != '' && array.controls[i].value.importo) {
        var value = array.controls[i].value.importo.toString();
        if (value) {
          value = value.replace('.', '');
          value = value.replace(',', '.');
          value = value.replace('€', '');
          value = parseFloat(value);
          total += value
        }
      }
    }
    totalString = total ? this.currencyPipe.transform(total, 'EUR') : '';

    return totalString;
  }


  disabledFieldValue() {
    if (this.action == 'create' || (this.action != 'view' && this.fattura.statoFattura == '' || this.fattura.statoFattura == 'R' || this.fattura.statoFattura == 'G')) {
      return false;
    } else if (this.isApproved || this.action == 'view') {
      return true;
    }
    return true;
  }

  getFattureState(state) {
    switch (state) {
      case 'V':
        return 'Validata';
      case 'R':
        return 'Rifiutata';
      case 'D':
        return 'Da Approvare';
      case 'C':
        return 'Contabilizzata';
      case 'G':
        return 'Rifiutata da SAP';
      case 'S':
        return 'Validata da SAP';
      default:
        return 'In Compilazione';
    }
  }

  inoltraFattura() {
    this.common.sendUpdate("showSpinner");
    let authToken: string = this.authService.getAuthToken();

    this.fattureService.inoltraFattura(authToken, this.fattura.id, this.userLogged.name).subscribe(res => {
      if (res) {
        this.common.sendUpdate("showAlertInfo", "Fattura inoltrata correttamente!");
        this.common.sendUpdate("hideSpinner");
        this.common.redirectToUrl('/fatture');

      }
      else {
        this.common.sendUpdate("hideSpinner");
        this.common.sendUpdate("showAlertDanger", "Impossibile inoltrare la fattura al momento.");
      }
    },
      error => {
        // console.log("getTopSummary");
        // console.log(error);

        this.common.sendUpdate("hideSpinner");
        this.common.sendUpdate("showAlertDanger", error.message);
      });
  }


  rifiutaFattura() {
    this.common.sendUpdate("showSpinner");
    let authToken: string = this.authService.getAuthToken();

    this.fattureService.rifiutaFattura(authToken, this.fattura.id, this.userLogged.name).subscribe(res => {
      if (res) {
        this.common.sendUpdate("showAlertInfo", "Fattura rifiutata correttamente!");
        this.common.sendUpdate("hideSpinner");
        this.common.redirectToUrl('/fatture');

      }
      else {
        this.common.sendUpdate("hideSpinner");
        this.common.sendUpdate("showAlertDanger", "Impossibile rifiutare la fattura al momento.");
      }
    },
      error => {
        // console.log("getTopSummary");
        // console.log(error);

        this.common.sendUpdate("hideSpinner");
        this.common.sendUpdate("showAlertDanger", error.message);
      });
  }


  validaFattura() {
    this.common.sendUpdate("showSpinner");
    let authToken: string = this.authService.getAuthToken();

    this.fattureService.validaFattura(authToken, this.fattura.id, this.userLogged.name).subscribe(res => {
      if (res) {
        this.common.sendUpdate("showAlertInfo", "Fattura approvata correttamente!");
        this.common.sendUpdate("hideSpinner");
        this.common.redirectToUrl('/fatture');

      }
      else {
        this.common.sendUpdate("hideSpinner");
        this.common.sendUpdate("showAlertDanger", "Impossibile approvare la fattura al momento.");
      }
    },
      error => {
        // console.log("getTopSummary");
        // console.log(error);

        this.common.sendUpdate("hideSpinner");
        this.common.sendUpdate("showAlertDanger", error.message);
      });
  }


  checkCodiceArticolo(index, type, event) {
    let value = this.formArr as any;
    let findIndex = this.articoliListString.findIndex(x => x == value[index].value.codiceArticolo);
    if (findIndex < 0) {
      value[index].controls.descrizioneArticolo.setErrors({ 'invalid': true });
      value[index].controls.codiceArticolo.setErrors({ 'invalid': true });
    } else {
      this.getArticoloById(event, index, type);
    }
  }


  checkCorrispettivo(index, event) {
    setTimeout(() => {
      let value = this.formArr as any;
      let findIndex = this.corrispettiviListString.findIndex(x => x == value[index].value.codiceCorrispettivo);
      if (findIndex < 0) {
        value[index].controls.codiceCorrispettivo.setErrors({ 'invalid': true });
      }
    }, 500);

  }

  getValidFromErrorMessage(element) {
    if (element.hasError('required')) {
      return "Il valore è obbligatorio";
    }
    if (element.hasError('corrispettivo')) {
      return "La combinazione già esistente";
    }
    else {
      return "";
    }
  }

}
