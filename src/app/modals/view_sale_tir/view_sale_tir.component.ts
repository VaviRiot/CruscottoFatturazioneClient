import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { environment } from 'environments/environment';

import { DxDataGridComponent, DxDrawerComponent } from 'devextreme-angular'
import { DxoPagerComponent } from 'devextreme-angular/ui/nested'
import DataSource from 'devextreme/data/data_source'
import 'devextreme/data/odata/store'
import { exportDataGrid } from 'devextreme/excel_exporter'
import 'devextreme/integration/jquery'

import { Workbook } from 'exceljs'
import saveAs from 'file-saver'
import { SaleTirListOverview } from 'app/models/Response/SaleTirListOverview';

import { OrderClause } from 'app/models/OrderClause';
import { Dictionary } from 'app/models/Dictionary';
import { Helper } from 'app/utils/helper';
import { CommonService } from 'app/shared/Service/Common/common.service';
import { Filter, FilterPayload, Sort } from 'app/models/FilterPayload';
import { AuthService } from 'app/shared/Service/AuthService/auth.service';
import { ProspectService } from 'app/shared/Service/Prospect/prospect.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-view-sale-tir',
  templateUrl: './view_sale_tir.component.html',
  styleUrls: ['./view_sale_tir.component.scss']
})
export class ViewSaleTirComponent implements OnInit {
  
  public richiestaId: number = -1;
  public saleTirListOverview = new SaleTirListOverview(0, null);

  ///Lista dei filtri di tipo data da utilizzare nel makeAdditionalsFilter
  dateFilters: string[] = [];

  listFilters: Array<Array<string>> = [
    ['codiceSala', 'lke'],
    ['codiceTir', 'lke'],
    ['numeroMacchine', 'lke']
  ]

  listInFilters: string[] = ['codiceSala'];
  
  /* SERVER SIDE FILTERS*/ 
  codiceSalaFilter: string;
  codiceTirFilter: string;
  numeroMacchineFilter: string;

  /* SERVER SORT CLAUSES */
  orderClause: OrderClause[]
  sorts: Dictionary<string>

  /* DATAGRID COMPONENT */
  @ViewChild(DxDataGridComponent, { static: false })
  dataGrid: DxDataGridComponent
  @ViewChild(DxoPagerComponent, { static: false }) pager: DxoPagerComponent
  @ViewChild("PCST") table: ElementRef;
  dataSource: DataSource;

  constructor(
                private prospectService: ProspectService,
                private common: CommonService,
                private authService: AuthService,
                private dialogRef: MatDialogRef<ViewSaleTirComponent>
            ) { }

  ngOnInit(): void {
  }

  resetGrid()
  {
    localStorage.removeItem(
                          environment.gmtSaleTirListFilter
                        );
    
    this.dataGrid.instance.clearFilter();
    this.dataGrid.instance.clearSorting();
    this.dataSource.reload();
  }

  loadTable(idRichiesta: number): void {
    
    this.dataSource = new DataSource({
      key: 'codiceTir',
      load: (loadOptions) => {

        let sorts = new Array<Sort>();

        if(loadOptions.sort)
        {
          (loadOptions.sort as any).forEach(element => {
            sorts.push(new Sort(element.selector, element.desc ? 'DESC' : 'ASC'));
          });
        }

        this.common.sendUpdate("showSpinner");    
        let authToken: string = this.authService.getAuthToken();

        let filterPost = new FilterPayload(
                                            this.dataGrid.instance.pageIndex(),
                                            this.dataGrid.instance.pageSize(),
                                            Helper.makeAdditionalsFilters(loadOptions, this.dateFilters),
                                            sorts);


        let filtRic = new Filter("saleTir.richiestaId", "eq", idRichiesta.toString(), null);
        filterPost.filters.push(filtRic);

        // console.log(filterPost);

        return this.prospectService
        .getSaleTirDataTable(authToken, filterPost)
        .toPromise()
        .then((res) => {

            this.saleTirListOverview = res;
            // console.log(this.ruoliListOverview);

            this.common.sendUpdate("hideSpinner");

            return {
              data: res.lines,
              totalCount: res.totalCount,
            }

      });
      },
      onLoadError: (error) => {
          //gestione errore
          this.common.sendUpdate("hideSpinner");
      }
    });
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
          'Sale TIR List.xlsx',
        )
      })
    })
    e.cancel = true
  }

  tableStateLoad = () => {
    var data = JSON.parse(
      localStorage.getItem(environment.gmtSaleTirListFilter),
    )
    return data
  }

  tableStateSave = (state) => {
    if (state) {
      localStorage.setItem(
        environment.gmtSaleTirListFilter,
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

  close() {
    this.dialogRef.close();
  }

}
