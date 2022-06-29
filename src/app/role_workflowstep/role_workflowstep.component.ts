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

import { AuthService } from 'app/shared/Service/AuthService/auth.service';
import { Subscription } from 'rxjs';
import { CommonService } from 'app/shared/Service/Common/common.service';

import { ConfirmMessageComponent } from 'app/modals/confirm_message/confirm_message.component';

import { Filter, FilterPayload, Sort } from 'app/models/FilterPayload';
import { environment } from 'environments/environment';
import { Helper } from 'app/utils/helper';
import { OrderClause } from 'app/models/OrderClause';
import { Dictionary } from 'app/models/Dictionary';
import { User } from 'app/models/User';
import { DatePipe } from '@angular/common'
import { ProspectService } from 'app/shared/Service/Prospect/prospect.service'
import { WorkflowStepRoleOverview } from 'app/models/Response/WorkflowStepRoleOverview'

@Component({
  selector: 'app-role-workflowstep',
  templateUrl: './role_workflowstep.component.html',
  styleUrls: ['./role_workflowstep.component.scss']
})
export class RoleWorkflowstepComponent implements OnInit {
  
  public listOverview = new WorkflowStepRoleOverview(0, null);

  public userLogged: User;
  private deleteSubscription: Subscription;

  ///Lista dei filtri di tipo data da utilizzare nel makeAdditionalsFilter
  dateFilters: string[] = ['lastModDate'];

  listFilters: Array<Array<string>> = [
    ['name', 'lke'],
    ['description', 'lke'],
    ['email', 'lke'],
    ['lastModDate', 'lke']
  ]

  listInFilters: string[] = ['name'];
  
  /* SERVER SIDE FILTERS*/ 
  nameFilter: string;
  descriptionFilter: string;
  emailFilter: string;
  lastModDateFilter: string;

  /* SERVER SORT CLAUSES */
  orderClause: OrderClause[]
  sorts: Dictionary<string>

  /* DATAGRID COMPONENT */
  @ViewChild(DxDataGridComponent, { static: false })
  dataGrid: DxDataGridComponent
  @ViewChild(DxoPagerComponent, { static: false }) pager: DxoPagerComponent
  @ViewChild("PCRW") table: ElementRef;
  dataSource: DataSource;

  constructor(
    private prospectService: ProspectService,
    public dialog: MatDialog,
    private common: CommonService,
    private authService: AuthService) { }

  ngOnInit(): void {

    let pipe = new DatePipe('it-IT');

    this.userLogged = this.authService.getUser();
    
    this.dataSource = new DataSource({
      key: 'id',
      load: (loadOptions) => {

        let sorts = new Array<Sort>();

        if(loadOptions.sort)
        {
          (loadOptions.sort as any).forEach(element => {
            if(element.selector == 'lastModString')
            {
              element.selector = 'lastModDate';
            }
            else if(element.selector == 'createDateString')
            {
              element.selector = 'createDate';
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

        return this.prospectService
          .getWorkflowStepRoleDataTable(authToken, filterPost)
          .toPromise()
          .then((res) => {

            res.lines.forEach(stepApp => 
            {
              if(stepApp.createDate)
              {
                stepApp.createDateString = pipe.transform(stepApp.createDate, 'dd/MM/yyyy HH:mm');
              }

              if(stepApp.lastModDate)
              {
                stepApp.lastModString = pipe.transform(stepApp.lastModDate, 'dd/MM/yyyy HH:mm');
              }
            });

              this.listOverview = res;
              // console.log(this.ruoliListOverview);

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

  resetGrid()
  {
    localStorage.removeItem(
                          environment.gmtRoleWorkflowListFilter
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
          'Autorizzazioni List.xlsx',
        )
      })
    })
    e.cancel = true
  }

  tableStateLoad = () => {
    var data = JSON.parse(
      localStorage.getItem(environment.gmtRoleWorkflowListFilter),
    )
    return data
  }

  tableStateSave = (state) => {
    if (state) {
      localStorage.setItem(
        environment.gmtRoleWorkflowListFilter,
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

  deleteWorkflowStepRole(workflowStepRoleId: number)
  {
    const dialogConfig = new MatDialogConfig()
    dialogConfig.id = 'confirm-message-modal'
    dialogConfig.height = 'fit-content'
    dialogConfig.width = '25rem';

    const modalDialog = this.dialog.open(ConfirmMessageComponent, dialogConfig);
    modalDialog.componentInstance.messageText = "Sei sicuro di voler rimuovere l'autorizzazione?";

    modalDialog.afterClosed().subscribe(res => 
    {
      if (res == true)
      {
        this.common.sendUpdate("showSpinner");
        
        let auth_token: string = this.authService.getAuthToken();
        this.deleteSubscription = this.prospectService.deleteWorkflowStepRole(auth_token, workflowStepRoleId, this.userLogged.name).subscribe((res: boolean) => 
        {
          if(res)
          {
            //console.log(res);
            this.common.sendUpdate("showAlertInfo", "Autorizzazione rimossa correttamente!");

            this.dataSource.reload();

            this.common.sendUpdate("hideSpinner");
          }
          else
          {
            this.common.sendUpdate("hideSpinner");
            this.common.sendUpdate("showAlertDanger", "Impossibile rimuovere l'autorizzazione al momento.");
          }
        },
        error => {
          // console.log("getTopSummary");
          // console.log(error);

          this.common.sendUpdate("hideSpinner");
          this.common.sendUpdate("showAlertDanger", error.message);
        });
      }
    });
  }

  ngOnDestroy(): void
  {
    ///qui viene distrutto il componente
    if(this.deleteSubscription)
    this.deleteSubscription.unsubscribe();
  }

}
