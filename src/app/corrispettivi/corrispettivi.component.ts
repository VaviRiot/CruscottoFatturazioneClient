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
import { DatePipe } from '@angular/common';
import { CorrispettiviListOverview } from 'app/models/Response/CorrispettiviListOverview'
import { CorrispettiviService } from 'app/shared/Service/Corrispettivi/corrispettivi.service'

@Component({
  selector: 'app-corrispettivi',
  templateUrl: './corrispettivi.component.html',
  styleUrls: ['./corrispettivi.component.scss']
})
export class CorrispettiviComponent implements OnInit {
  public corrispettivoListOverview = new CorrispettiviListOverview(0, null);

  public validToListFilter: any = [
    {
      text: 'Attivo',
      value: ['validTo', 'gte', new Date()],
    },
    {
      text: 'Disattivo',
      value: ['validTo', 'lt', new Date()],
    }
  ];

  public userLogged: User;
  private deleteSubscription: Subscription;

  ///Lista dei filtri di tipo data da utilizzare nel makeAdditionalsFilter
  dateFilters: string[] = ['lastModDate', 'validTo'];

  listFilters: Array<Array<string>> = [
    ['codiceCorrispettivo', 'lke'],
    ['descrizione', 'lke'],
    ['lastModDate', 'lke'],
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

  constructor(
    private corrispettivoService: CorrispettiviService,
    public dialog: MatDialog,
    private common: CommonService,
    private authService: AuthService
  ) {
  }

  ngOnInit(): void {
    this.userLogged = this.authService.getUser();
    this.loadDataTable();
  }


  loadDataTable() {
    let pipe = new DatePipe('it-IT');

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

        // console.log(filterPost);

        return this.corrispettivoService
          .getCorrispettiviDataTable(authToken, filterPost)
          .toPromise()
          .then((res) => {

            res.lines.forEach(corrispettivo => {
              if (this.corrispettivoAttivo(corrispettivo.dataValidita)) {
                corrispettivo.status = "Attivo";
              }
              else {
                corrispettivo.status = "Disattivato";
              }

              if (corrispettivo.last_mod_user) {
                corrispettivo.last_mod_user = pipe.transform(corrispettivo.last_mod_date, 'dd/MM/yyyy HH:mm');
              }

              if (corrispettivo.last_mod_date) {
                corrispettivo.last_mod_date = pipe.transform(corrispettivo.last_mod_date, 'dd/MM/yyyy HH:mm');
              }

            });

            this.corrispettivoListOverview = res;
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

  corrispettivoAttivo(valid_to: Date): boolean {
    if (new Date(valid_to) > new Date()) {
      return true;
    }
    else {
      return false;
    }
  }

  deleteCorr(idCorr: number) {
    const dialogConfig = new MatDialogConfig()
    dialogConfig.id = 'confirm-message-modal'
    dialogConfig.height = 'fit-content'
    dialogConfig.width = '25rem';

    const modalDialog = this.dialog.open(ConfirmMessageComponent, dialogConfig);
    modalDialog.componentInstance.messageText = "Sei sicuro di voler eliminare il corrispettivo?";

    modalDialog.afterClosed().subscribe(res => {
      if (res == true) {
        this.common.sendUpdate("showSpinner");
        let auth_token: string = this.authService.getAuthToken();
        this.deleteSubscription = this.corrispettivoService.deleteCorrispettivo(auth_token, idCorr, this.userLogged.name).subscribe((res: boolean) => {
          if (res) {
            //console.log(res);
            this.common.sendUpdate("showAlertInfo", "Corrispettivo rimosso correttamente!");

            // this.dataSource.reload();
            this.loadDataTable();
            this.common.sendUpdate("hideSpinner");
          }
          else {
            this.common.sendUpdate("hideSpinner");
            this.common.sendUpdate("showAlertDanger", "Impossibile rimuovere il corrispettivo al momento.");
          }
        },
          error => {
            this.common.sendUpdate("hideSpinner");
            this.common.sendUpdate("showAlertDanger", error.message);
          });
      }
    });
  }

  ngOnDestroy(): void {
    ///qui viene distrutto il componente
    if (this.deleteSubscription)
      this.deleteSubscription.unsubscribe();
  }


}
