import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { MatDialog, MatDialogConfig } from '@angular/material/dialog'
import { DxDataGridComponent, DxDrawerComponent } from 'devextreme-angular'
import { DxoPagerComponent } from 'devextreme-angular/ui/nested'
import DataSource from 'devextreme/data/data_source'
import 'devextreme/data/odata/store'
import { exportDataGrid } from 'devextreme/excel_exporter'
import 'devextreme/integration/jquery'
import { Workbook } from 'exceljs'
import saveAs from 'file-saver'
import { AuthService } from 'app/shared/Service/AuthService/auth.service';
import { Subscription } from 'rxjs';
import { CommonService } from 'app/shared/Service/Common/common.service';
import { ConfirmMessageComponent } from 'app/modals/confirm_message/confirm_message.component';
import { Filter, FilterPayload, Sort } from 'app/models/FilterPayload';
import { environment } from 'environments/environment'
import { Helper } from 'app/utils/helper'
import { OrderClause } from 'app/models/OrderClause'
import { Dictionary } from 'app/models/Dictionary'
import { User } from 'app/models/User';
import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { FatturaListOverview } from 'app/models/Response/FatturaListOverview'
import { FattureService } from 'app/shared/Service/Fatture/fatture.service'
import { FatturaLog } from 'app/models/Fatture'
import { ViewLogFatturaComponent } from 'app/modals/view_log_fattura/view-log-fattura.component'

@Component({
  selector: 'app-fatture',
  templateUrl: './fatture.component.html',
  styleUrls: ['./fatture.component.scss']
})
export class FattureComponent implements OnInit {

  public fattureListOverview = new FatturaListOverview(0, null);

  public validToListFilter: any = [
    {
      text: 'Rifiutata',
      value: ['statoFattura', 'in', 'R'],
    },
    {
      text: 'Rigettata da SAP',
      value: ['statoFattura', 'in', 'G'],
    },
    {
      text: 'Da approvare',
      value: ['statoFattura', 'in', 'D'],
    },
    {
      text: 'Contabilizzata',
      value: ['statoFattura', 'in', 'C'],
    },
    {
      text: 'In compilazione',
      value: ['statoFattura', 'in', ''],
    },
    {
      text: 'Validata',
      value: ['statoFattura', 'in', 'V'],
    },
    {
      text: 'Validata da SAP',
      value: ['statoFattura', 'in', 'S'],
    }

  ];

  public userLogged: User;
  private deleteSubscription: Subscription;

  ///Lista dei filtri di tipo data da utilizzare nel makeAdditionalsFilter
  dateFilters: string[] = ['lastModDate', 'validTo'];

  listFilters: Array<Array<string>> = [
    ['codiceCliente', 'lke'],
    ['codiceFiscale', 'lke'],
    ['partitaIva', 'lke'],
    ['denominazione', 'lke'],
    ['tipo', 'lke'],
    ['importo', 'eq'],

  ]

  listInFilters: string[] = ['name'];


  /* SERVER SORT CLAUSES */
  orderClause: OrderClause[]
  elements: Element[]
  sorts: Dictionary<string>

  /* DATAGRID COMPONENT */
  @ViewChild(DxDataGridComponent, { static: false })
  dataGrid: DxDataGridComponent
  @ViewChild(DxoPagerComponent, { static: false }) pager: DxoPagerComponent
  @ViewChild("PCUT") table: ElementRef;
  dataSource: DataSource;
  todayDate;

  constructor(
    private fattureService: FattureService,
    public dialog: MatDialog,
    private common: CommonService,
    private authService: AuthService,
    private _decimalPipe: DecimalPipe,
    private _currencyPipe: CurrencyPipe
  ) {
  }

  ngOnInit(): void {
    this.userLogged = this.authService.getUser();
    this.loadDataTable();
  }


  loadDataTable() {
    let pipe = new DatePipe('it-IT');
    this.todayDate = pipe.transform(new Date(), 'dd/MM/yyyy HH:mm')
    this.dataSource = new DataSource({
      key: 'id',
      load: (loadOptions) => {

        let sorts = new Array<Sort>();

        if (loadOptions.sort) {
          (loadOptions.sort as any).forEach(element => {
            if (element.selector == 'lastModString') {
              element.selector = 'lastModDate';
            }
            sorts.push(new Sort(element.selector, element.desc ? 'DESC' : 'ASC'));
          });
        }

        this.common.sendUpdate("refreshNotify");
        this.common.sendUpdate("showSpinner");

        let authToken: string = this.authService.getAuthToken();

        let filterPost = new FilterPayload(
          this.dataGrid.instance.pageIndex(),
          this.dataGrid.instance.pageSize(),
          Helper.makeAdditionalsFilters(loadOptions, this.dateFilters),
          sorts);

        this.dataGrid.noDataText = this.userLogged.ruoloUtente.name == 'Approvatore' ? ' Non sono presenti fatture da approvare' : 'Non sono presenti fatture';

        // console.log(filterPost);

        return this.fattureService
          .getFattureDataTable(authToken, filterPost, this.userLogged.selectedSocieta)
          .toPromise()
          .then((res) => {
            res.lines.forEach(fattura => {
              fattura.importo = this._currencyPipe.transform(fattura.importo, 'EUR', 'symbol');
              fattura.statoFattura = this.getFattureState(fattura.statoFattura);
            });
            this.fattureListOverview = res;
            // console.log(this.utentiListOverview);

            this.common.sendUpdate("hideSpinner");

            return {
              data: res.lines,
              totalCount: res.totalCount,
            }

          })
      },
      onLoadError: (error) => {
        //gestione errore
        this.common.sendUpdate("hideSpinner");
      }
    });
  }

  resetGrid() {
    localStorage.removeItem(
      environment.gmtUserListFilter
    );

    this.dataGrid.instance.clearFilter();
    this.dataGrid.instance.clearSorting();
    this.dataSource.reload();
  }

  contentReady = (e) => {
    var pager = e.component.getView('pagerView').element().dxPager('instance')
    pager.option('lightModeEnabled', true)
  }

  onToolbarPreparing(e) {
    e.toolbarOptions.items.unshift(
      {
        location: 'before',
        template: 'totalCount',
      }
    )
  }

  onExporting(e) {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Main');

    exportDataGrid({
      component: e.component,
      worksheet: worksheet,
      customizeCell: function (options) {
        const excelCell = options.excelCell
        excelCell.font = { name: 'Arial', size: 12 }
        excelCell.alignment = { horizontal: 'left' }
      },
    }).then(function () {
      workbook.xlsx.writeBuffer().then(function (buffer: BlobPart) {
        saveAs(
          new Blob([buffer], { type: 'application/octet-stream' }),
          'Utenti List.xlsx',
        )
      })
    })
    e.cancel = true
  }

  cleanGridFilter() {
    localStorage.removeItem(environment.gmtUserListFilter);
  }

  tableStateLoad = () => {

    var data = JSON.parse(
      localStorage.getItem(environment.gmtUserListFilter),
    )
    return data
  }

  tableStateSave = (state) => {
    if (state) {
      localStorage.setItem(
        environment.gmtNotListFilter,
        JSON.stringify({ columns: state.columns }),
      )
    }
  }

  hasFilter(name) {
    try {
      if (this.dataGrid.instance.getCombinedFilter().find(x => x == name))
        return true;

      if ([].concat.apply([], this.dataGrid.instance.getCombinedFilter()).find(x => x == name))
        return true;

      var arrays = [].concat.apply([], this.dataGrid.instance.getCombinedFilter()).filter(function (item) { return Array.isArray(item) })
      if (arrays && [].concat.apply([], arrays).find(x => x == name))
        return true;

      return false;
    }
    catch {
      return false;
    }
  }

  fatturaAttivo(valid_to: Date): boolean {
    if (new Date(valid_to) > new Date()) {
      return true;
    }
    else {
      return false;
    }
  }

  ngOnDestroy(): void {
    ///qui viene distrutto il componente
    if (this.deleteSubscription)
      this.deleteSubscription.unsubscribe();
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
        return 'G';
      case 'S':
        return 'S';
      default:
        return 'compilazione';
    }
  }

  editFattura(state) {
    switch (state) {
      case 'Rifiutata':
      case 'G':
        return true
      case 'compilazione':
        return true;
      case 'G':
        return true;
      default:
        return false
    }

  }

  openLogFattura(idFattura): void {
    let authToken: string = this.authService.getAuthToken();
    this.fattureService.getLogStatoFattura(authToken, idFattura).subscribe(res => {
      let result = res;
      const dialogRef = this.dialog.open(ViewLogFatturaComponent, {
        width: '100%',
        data: result,
      });

      dialogRef.afterClosed().subscribe(result => {
      });
    }, error => {
      console.log(error);
    })
  }

}
