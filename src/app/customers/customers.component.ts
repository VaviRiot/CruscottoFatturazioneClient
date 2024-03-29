import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { MatCheckboxChange } from '@angular/material/checkbox'
import { MatDialog, MatDialogConfig } from '@angular/material/dialog'
import { MatSnackBar } from '@angular/material/snack-bar'
import { DxDataGridComponent, DxDrawerComponent } from 'devextreme-angular'
import { DxoPagerComponent } from 'devextreme-angular/ui/nested'
import DataSource from 'devextreme/data/data_source'
import 'devextreme/data/odata/store'
import { exportDataGrid } from 'devextreme/excel_exporter'
import 'devextreme/integration/jquery'

import { Workbook } from 'exceljs'
import saveAs from 'file-saver'

import { Cliente } from 'app/models/Cliente';
import { ProspectService } from 'app/shared/Service/Prospect/prospect.service';

import { AuthService } from 'app/shared/Service/AuthService/auth.service'
import { Subscription } from 'rxjs'
import { CommonService } from 'app/shared/Service/Common/common.service'

import { Filter, FilterPayload, Sort } from 'app/models/FilterPayload';
import { environment } from 'environments/environment'
import { Helper } from 'app/utils/helper'
import { OrderClause } from 'app/models/OrderClause'
import { Dictionary } from 'app/models/Dictionary'
import { ProspectListOverview } from 'app/models/Response/ProspectListOverview'
import { User } from 'app/models/User'
import { DatePipe } from '@angular/common'
import { PresaInCaricoRequest } from 'app/models/Request/PresaInCaricoRequest'

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {
  
  public clientiListOverview = new ProspectListOverview(0, null);
  
  public userLogged: User;
  public defIsAdmin: boolean = false;
  
  todayDate = new Date();

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
  @ViewChild("PCCL") table: ElementRef;
  dataSource: DataSource;

  constructor(
    private prospectService: ProspectService,
    public dialog: MatDialog,
    private common: CommonService,
    private authService: AuthService) {

      // this.dataSource.reload()
  
      this.dataSource = new DataSource(new Array<Cliente>());
    }

  ngOnInit(): void 
  {
    let pipe = new DatePipe('it-IT');

    this.userLogged = this.authService.getUser();

    this.dataSource = new DataSource({
      key: 'codiceCliente',
      load: (loadOptions) => {

        let sorts = new Array<Sort>();

        if(loadOptions.sort)
        {
          (loadOptions.sort as any).forEach(element => {

            if(element.selector == 'lastModString')
            {
              element.selector = 'lastMod';
            }

            sorts.push(new Sort(element.selector, element.desc ? 'DESC' : 'ASC'));
          });
          
        }

        this.common.sendUpdate("refreshNotify");
        this.common.sendUpdate("showSpinner");
    
        let authToken: string = this.authService.getAuthToken();

        let preFilter: string = this.authService.getCustomerPreFilter();
        let preFilterArray: Array<string> = null;
        if(preFilter)
        {
          if(preFilter != "")
          {
            this.resetGrid(false);

            if(preFilter != "state_eq_reset")
            {
              preFilterArray = preFilter.split("_");
            }

            this.authService.setCustomerPreFilter("");
          }
        }

        let filterPost = new FilterPayload(
                                            this.dataGrid.instance.pageIndex(),
                                            this.dataGrid.instance.pageSize(),
                                            Helper.makeAdditionalsFilters(loadOptions, this.dateFilters),
                                            sorts);


        let filtRole = new Filter("role.filter", "eq", this.userLogged.ruoloUtente.id.toString(), null);
        filterPost.filters.push(filtRole);

        if(preFilterArray != null)
        {
          let preFilt = new Filter(preFilterArray[0], preFilterArray[1], preFilterArray[2], null);
          filterPost.filters.push(preFilt);
        }

        if(this.userLogged.ruoloUtente)
        {
          if(this.userLogged.ruoloUtente.isAdmin)
          {
            this.defIsAdmin = this.userLogged.ruoloUtente.isAdmin;
          }
        }

        let filtAdmin = new Filter("role.admin", "eq", this.defIsAdmin.toString(), null);
        filterPost.filters.push(filtAdmin);

        return this.prospectService
          .getClientiDataTable(authToken, filterPost)
          .toPromise()
          .then((res) => {
              res.lines.forEach(prospectApp =>
              {
                if(prospectApp.lastMod)
                {
                  prospectApp.lastModString = pipe.transform(prospectApp.lastMod, 'dd/MM/yyyy HH:mm');
                }
              });

              this.clientiListOverview = res;

              // console.log(this.clientiListOverview);

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

  resetGrid(reload: boolean = true)
  {
    localStorage.removeItem(
                          environment.gmtCliListFilter
                        );
    
    this.dataGrid.instance.clearFilter();
    this.dataGrid.instance.clearSorting();

    if(reload)
    {
      this.dataSource.reload();
    }
  }

  public presaInCarico(prospect: Cliente)
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
          'Customers List.xlsx',
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
      localStorage.getItem(environment.gmtCliListFilter),
    )
    return data
  }

  tableStateSave = (state) => {
    if (state) {
      localStorage.setItem(
        environment.gmtCliListFilter,
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
