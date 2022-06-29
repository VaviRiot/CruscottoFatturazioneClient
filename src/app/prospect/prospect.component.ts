import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DxDataGridComponent, DxDrawerComponent } from 'devextreme-angular';
import { DxoPagerComponent } from 'devextreme-angular/ui/nested';
import DataSource from 'devextreme/data/data_source';
import 'devextreme/data/odata/store';
import { exportDataGrid } from 'devextreme/excel_exporter';
import 'devextreme/integration/jquery';

import { Workbook } from 'exceljs';
import saveAs from 'file-saver';

import { Cliente } from 'app/models/Cliente';
import { ProspectService } from 'app/shared/Service/Prospect/prospect.service';

import { AuthService } from 'app/shared/Service/AuthService/auth.service';
import { Subscription } from 'rxjs';
import { CommonService } from 'app/shared/Service/Common/common.service';

import { Filter, FilterPayload, Sort } from 'app/models/FilterPayload';
import { environment } from 'environments/environment';
import { Helper } from 'app/utils/helper';
import { OrderClause } from 'app/models/OrderClause';
import { Dictionary } from 'app/models/Dictionary';
import { ProspectListOverview } from 'app/models/Response/ProspectListOverview';
import { DatePipe } from '@angular/common';
import { User } from 'app/models/User';
import { useFunc } from 'ajv/dist/compile/util';
import { DxGridColumn } from 'app/models/DxGridColumn';
import { dxDataGridColumn } from 'devextreme/ui/data_grid';
import { PresaInCaricoRequest } from 'app/models/Request/PresaInCaricoRequest';
import { ConfirmMessageComponent } from 'app/modals/confirm_message/confirm_message.component';

@Component({
  selector: 'app-prospect',
  templateUrl: './prospect.component.html',
  styleUrls: ['./prospect.component.scss']
})
export class ProspectComponent implements OnInit {
  
  public prospectListOverview = new ProspectListOverview(0, null);
  
  public userLogged: User;
  public defIsAdmin: boolean = false;
  
  public todayDate = new Date();

  public defFilterPost: FilterPayload;

  ///Lista dei filtri di tipo data da utilizzare nel makeAdditionalsFilter
  dateFilters: string[] = ['lastMod']; 

  listFilters: Array<Array<string>> = [
    ['codiceCliente', 'lke'],
    ['nomeCliente', 'lke'],
    ['business', 'lke'],
    ['nomeStep', 'lke'],
    ['lastMod', 'lke']
  ]

  listInFilters: string[] = ['codiceCliente'];

/* Esempio filtro dropdown
  statusListFilter: any = [
    {
      text: 'Confermato',
      value: ['status', 'in', 'Confermato'],
    },
    {
      text: 'Da Confermare',
      value: ['status', 'in', 'Da Confermare'],
    },
  ]
*/

  /* SERVER SIDE FILTERS*/ 
  codiceClienteFilter: string;
  nomeClienteFilter: string;
  businessFilter: string;
  nomeStepFilter: string;
  lastModFilter: string;

  /* SERVER SORT CLAUSES */
  orderClause: OrderClause[]
  sorts: Dictionary<string>

  /* DATAGRID COMPONENT */
  @ViewChild(DxDataGridComponent, { static: false })
  dataGrid: DxDataGridComponent
  @ViewChild(DxoPagerComponent, { static: false }) pager: DxoPagerComponent
  @ViewChild("PCPR") table: ElementRef;
  dataSource: DataSource;

  constructor(
    private prospectService: ProspectService,
    public dialog: MatDialog,
    private common: CommonService,
    private authService: AuthService
  ) {

    // this.dataSource.reload()

    this.dataSource = new DataSource(new Array<Cliente>());
  }

  ngOnInit(): void
  {
    let pipe = new DatePipe('it-IT');

    // this.exportAll();

    this.userLogged = this.authService.getUser();
    
    this.dataSource = new DataSource({
      key: 'codiceCliente',
      load: (loadOptions) => {

        let sorts = new Array<Sort>();

        if(loadOptions.sort)
        {
          (loadOptions.sort as any).forEach(element =>
          {
            if(element.selector == 'lastModString')
            {
              element.selector = 'lastMod';
            }

            sorts.push(new Sort(element.selector, element.desc ? 'DESC' : 'ASC'));

          });
        }

        this.common.sendUpdate("refreshNotify");

        // Aggiorno la visualizzazione del pulsante business
        //this.common.sendUpdate("refreshBusinessButton");

        this.common.sendUpdate("showSpinner");
    
        let authToken: string = this.authService.getAuthToken();

        let filterPost = new FilterPayload(
                                            this.dataGrid.instance.pageIndex(),
                                            this.dataGrid.instance.pageSize(),
                                            Helper.makeAdditionalsFilters(loadOptions, this.dateFilters),
                                            sorts);


        let filtRole = new Filter("role.filter", "eq", this.userLogged.ruoloUtente.id.toString(), null);
        filterPost.filters.push(filtRole);

        if(this.userLogged.ruoloUtente)
        {
          if(this.userLogged.ruoloUtente.isAdmin)
          {
            this.defIsAdmin = this.userLogged.ruoloUtente.isAdmin;
          }
        }

        let filtAdmin = new Filter("role.admin", "eq", this.defIsAdmin.toString(), null);
        filterPost.filters.push(filtAdmin);

        this.defFilterPost = filterPost;

        return this.prospectService
          .getProspectDataTable(authToken, filterPost)
          .toPromise()
          .then((res) => {
              res.lines.forEach(prospectApp =>
              {
                if(prospectApp.lastMod)
                {
                  prospectApp.lastModString = pipe.transform(prospectApp.lastMod, 'dd/MM/yyyy HH:mm');
                }
              });

              this.prospectListOverview = res;
              // console.log(this.prospectListOverview);

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

  exportAll()
  {
    this.common.sendUpdate("showSpinner");
    
    let authToken: string = this.authService.getAuthToken();

    try
    {
      let listObject: { columns: Array<DxGridColumn> }  = JSON.parse(localStorage.getItem(environment.gmtProspListFilter));

      listObject.columns.filter(a => a.visible == true).sort((a,b) => (a.visibleIndex - b.visibleIndex));

      listObject.columns.forEach(element =>
      {
          if(element.dataField == 'lastModString')
          {
            element.dataField = 'lastMod';
            element.name = 'lastMod';
          }
      });
 
      // console.log(listObject);

      this.prospectService.export(authToken, listObject.columns, this.defFilterPost)
        .subscribe((res: BlobPart) => 
          {
            // console.log(res);
            const file = new Blob([res], { type: 'application / vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            saveAs(file, `Prospect List.xls`);
            this.common.sendUpdate("hideSpinner");
          }
        );
    }
    catch (e) {
      console.log(e);
      this.common.sendUpdate("hideSpinner");
    }

  }

  public presaInCarico(prospect: Cliente)
  {
    
    const dialogConfig = new MatDialogConfig()
    dialogConfig.id = 'confirm-message-modal'
    dialogConfig.height = 'fit-content'
    dialogConfig.width = '25rem';

    const modalDialog = this.dialog.open(ConfirmMessageComponent, dialogConfig);
    modalDialog.componentInstance.messageText = "Sei sicuro di voler prendere in carico il prospect?";

    modalDialog.afterClosed().subscribe(res => 
    {
      if (res == true)
      {
        this.common.sendUpdate("showSpinner");
    
        let authToken: string = this.authService.getAuthToken();

        let presaInCaricoRequest = new PresaInCaricoRequest(
                                                              prospect.id,
                                                              this.userLogged.id,
                                                              this.userLogged.name
                                                          );

        // console.log(presaInCaricoRequest);

        this.prospectService.savePresaInCarico(authToken, presaInCaricoRequest).subscribe(
          res =>
          {
            prospect.workUserId = this.userLogged.id;

            this.common.sendUpdate("hideSpinner");
          },
          err => {
              this.common.sendUpdate("hideSpinner");
              this.common.sendUpdate("showAlertDanger", err.message);
              console.log(err)
          }
        );
      }
    });
  }

  resetGrid()
  {
    localStorage.removeItem(
                          environment.gmtProspListFilter
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

    const workbook = new Workbook()
    const worksheet = workbook.addWorksheet('Main')
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
          'Prospect List.xlsx',
        )
      })
    })
    e.cancel = true
  }

  // getImage(brand: string) {
  //   return brand.toLowerCase() == 'toyota'
  //     ? 'toyota-logo-dark'
  //     : 'Lexus-Logo-dark'
  // }

  tableStateLoad = () => {
    var data = JSON.parse(
      localStorage.getItem(environment.gmtProspListFilter),
    )
    return data
  }

  tableStateSave = (state) => {
    if (state) {
      localStorage.setItem(
        environment.gmtProspListFilter,
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
}