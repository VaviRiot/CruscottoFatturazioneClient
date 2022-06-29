import DataSource from 'devextreme/data/data_source';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Dictionary } from 'app/models/Dictionary';
import { Filter, FilterPayload, Sort } from 'app/models/FilterPayload';
import { OrderClause } from 'app/models/OrderClause';
import { ProspectListOverview } from 'app/models/Response/ProspectListOverview';
import { User } from 'app/models/User';
import * as Chartist from 'chartist';
import { DxDataGridComponent } from 'devextreme-angular';
import { DxoPagerComponent } from 'devextreme-angular/ui/nested';
import { Cliente } from 'app/models/Cliente';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from 'app/shared/Service/Common/common.service';
import { AuthService } from 'app/shared/Service/AuthService/auth.service';
import { DatePipe } from '@angular/common';
import { Helper } from 'app/utils/helper';
import { environment } from 'environments/environment';

import { exportDataGrid } from 'devextreme/excel_exporter';
import { Workbook } from 'exceljs';
import saveAs from 'file-saver';
import { InsolutiService } from 'app/shared/Service/Insoluti/insoluti.service';
import { InsolutiSummaryOverview } from 'app/models/Response/InsolutiSummaryOverview';

@Component({
  selector: 'app-insoluti',
  templateUrl: './insoluti.component.html',
  styleUrls: ['./insoluti.component.scss']
})
export class InsolutiComponent implements OnInit {

  public insolutiSumOverview = new InsolutiSummaryOverview(0, null);
  
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
  @ViewChild("PCIN") table: ElementRef;
  dataSource: DataSource;
  
  constructor(
                private insolutiService: InsolutiService,
                public dialog: MatDialog,
                private common: CommonService,
                private authService: AuthService
            )
  {

    this.dataSource = new DataSource(new Array<Cliente>());
  }

  ngOnInit() {
    let pipe = new DatePipe('it-IT');

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

        return this.insolutiService
          .getInsolutiSummaryDataTable(authToken, filterPost)
          .toPromise()
          .then((res) => {
              res.lines.forEach(insolutiApp =>
              {
                console.log(insolutiApp);

                if(insolutiApp.lastModDate)
                {
                  insolutiApp.lastModString = pipe.transform(insolutiApp.lastModDate, 'dd/MM/yyyy');
                }
                if(insolutiApp.dataRiferimento)
                {
                  insolutiApp.dataRiferimentoString = pipe.transform(insolutiApp.dataRiferimento, 'dd/MM/yyyy');
                }
                if(insolutiApp.scadenzaRendimento)
                {
                  insolutiApp.scadenzaRendimentoString = pipe.transform(insolutiApp.scadenzaRendimento, 'dd/MM/yyyy');
                }
              });

              this.insolutiSumOverview = res;
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

  resetGrid()
  {
    localStorage.removeItem(
                          environment.gmtInsolutiListFilter
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
          'Insoluti List.xlsx',
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
      localStorage.getItem(environment.gmtInsolutiListFilter),
    )
    return data
  }

  tableStateSave = (state) => {
    if (state) {
      localStorage.setItem(
        environment.gmtInsolutiListFilter,
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

  startAnimationForLineChart(chart)
  {
      let seq: any, delays: any, durations: any;
      seq = 0;
      delays = 80;
      durations = 500;

      chart.on('draw', function(data) {
        if(data.type === 'line' || data.type === 'area') {
          data.element.animate({
            d: {
              begin: 600,
              dur: 700,
              from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
              to: data.path.clone().stringify(),
              easing: Chartist.Svg.Easing.easeOutQuint
            }
          });
        } else if(data.type === 'point') {
              seq++;
              data.element.animate({
                opacity: {
                  begin: seq * delays,
                  dur: durations,
                  from: 0,
                  to: 1,
                  easing: 'ease'
                }
              });
          }
      });

      seq = 0;
  };
  
  startAnimationForBarChart(chart){
      let seq2: any, delays2: any, durations2: any;

      seq2 = 0;
      delays2 = 80;
      durations2 = 500;
      chart.on('draw', function(data) {
        if(data.type === 'bar'){
            seq2++;
            data.element.animate({
              opacity: {
                begin: seq2 * delays2,
                dur: durations2,
                from: 0,
                to: 1,
                easing: 'ease'
              }
            });
        }
      });

      seq2 = 0;
  };

}
