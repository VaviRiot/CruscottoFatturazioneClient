import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DashboardTopSummary } from 'app/models/DashboardTopSummary';
import { Cliente, Fatture } from 'app/models/Cliente';
import { AuthService } from 'app/shared/Service/AuthService/auth.service';
import { DashboardService } from 'app/shared/Service/Dashboard/dashboard.service';
import { CommonService } from 'app/shared/Service/Common/common.service';
import * as Chartist from 'chartist';
import { Subscription } from 'rxjs';
import { DashboardNuoviProspectChart } from 'app/models/DashboardNuoviProspectChart';
import { DashboardClientiAttiviChart } from 'app/models/DashboardClientiAttiviChart';
import { DashboardGaranzieScadenzaChart } from 'app/models/DashboardGaranzieScadenzeChart';
import { User } from 'app/models/User';
import { InternalMessage } from 'app/models/InternalMessage';
import * as moment from 'moment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public todayDate = new Date();
  public userLogged: User;
  public defIdRole: number = -1;
  public defIsAdmin: boolean = false;
  public defAdminView: boolean = false;
  public defSelectedBusiness = new Array<string>();
  public topSummary = new DashboardTopSummary(0, new Date(), 0, new Date(), 0, 0, 0, new Date());
  public dashNuoviProspect = new DashboardNuoviProspectChart();
  public dashClientiAttivi = new DashboardClientiAttiviChart();
  public dashClientiGaranziaScadenza = new DashboardGaranzieScadenzaChart();
  public listBottomClienti: Array<Cliente>;
  public listBottomProspect: Array<Fatture>;
  public aumentoNuoviProspect: number = 0;
  public nuoviProspectDate = new Date();
  public clientiAttiviDate = new Date();
  public garanzieScadenzaDate = new Date();
  private myTopSubscription: Subscription;
  private myBotCliSubscription: Subscription;
  private myBotProSubscription: Subscription;
  private myDashProspectSubscription: Subscription;
  private myDashClientiSubscription: Subscription;
  private myDashGaranzieSubscription: Subscription;
  private myUpdateSubscription: Subscription;

  constructor(private authService: AuthService,
    private dashService: DashboardService,
    private common: CommonService,
    private datePipe: DatePipe) { }

  startAnimationForLineChart(chart) {
    let seq: any, delays: any, durations: any;
    seq = 0;
    delays = 80;
    durations = 500;

    chart.on('draw', function (data) {
      if (data.type === 'line' || data.type === 'area') {
        data.element.animate({
          d: {
            begin: 600,
            dur: 700,
            from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
            to: data.path.clone().stringify(),
            easing: Chartist.Svg.Easing.easeOutQuint
          }
        });
      } else if (data.type === 'point') {
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

  startAnimationForBarChart(chart) {
    let seq2: any, delays2: any, durations2: any;

    seq2 = 0;
    delays2 = 80;
    durations2 = 500;
    chart.on('draw', function (data) {
      if (data.type === 'bar') {
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

  ngOnInit() {
    this.defSelectedBusiness = this.authService.getAvaiableBusiness();
    this.authService.setSelectedBusiness(this.defSelectedBusiness);

    // Aggiorno le notifiche
    // non viene eseguita al route
    this.common.sendUpdate("refreshNotify");

    this.loadDashboard();
  }

  ngAfterViewInit() {
    this.myUpdateSubscription = this.common.getUpdate().subscribe(res => {

      let json_obj: InternalMessage = JSON.parse(res.text);

      // console.log("Welcome to dash");
      // console.log(json_obj);    
      if (json_obj.command == "refreshDashboardBusiness") {
        this.defSelectedBusiness = this.authService.getSelectedBusiness();

        // console.log(this.defSelectedBusiness);
        this.loadDashboard();
      }
    });
  }

  loadDashboard() {

    this.common.sendUpdate("showSpinner");

    /* ----------==========     Daily Sales Chart initialization For Documentation    ==========---------- */

    let authToken: string = this.authService.getAuthToken();
    this.userLogged = this.authService.getUser();
    if (this.userLogged.ruoloUtente) {
      this.defIdRole = this.userLogged.ruoloUtente.id;
      this.defIsAdmin = this.userLogged.ruoloUtente.isAdmin;
    }

    if (this.defSelectedBusiness == null) {
      this.defSelectedBusiness = new Array<string>();
    }

    this.myDashProspectSubscription = this.dashService.getDashboardNuoviProspectChart(authToken, this.defIdRole, this.defIsAdmin, this.defAdminView, this.defSelectedBusiness, this.userLogged.selectedSocieta).subscribe(res => {
      this.dashNuoviProspect = res as DashboardNuoviProspectChart;
      let seriesX = [];
      let seriesY = [];
      this.dashNuoviProspect.giorni.forEach(element => {
        seriesX.push(element.numero);
        seriesY.push(element.giornoSettimana[0].toString().toUpperCase())
      });
      const dataDailySalesChart: any = {
        labels: seriesY,
        series: [seriesX]

      };


      const optionsDailySalesChart: any = {
        lineSmooth: Chartist.Interpolation.cardinal({
          tension: 0
        }),
        low: 0,
        chartPadding: { top: 0, right: 0, bottom: 0, left: 0 },
      }

      var dailySalesChart = new Chartist.Line('#dailySalesChart', dataDailySalesChart, optionsDailySalesChart);

      this.startAnimationForLineChart(dailySalesChart);
    },
      error => {
        // console.log("getTopSummary");
        // console.log(error);
        this.common.sendUpdate("showAlertDanger", error.message);
      });

    this.createScadenzeChart(authToken);

    /* ----------==========     Emails Subscription Chart initialization    ==========---------- */

    this.myDashClientiSubscription = this.dashService.getDashboardYearChart(authToken, this.defIdRole, this.defIsAdmin, this.defAdminView, this.defSelectedBusiness, this.userLogged.selectedSocieta).subscribe(res => {
      this.dashClientiAttivi = res as DashboardClientiAttiviChart;
      var datawebsiteViewsChart = {
        labels: ['G', 'F', 'M', 'A', 'M', 'G', 'L', 'A', 'S', 'O', 'N', 'D'],
        series: [
          [
            this.dashClientiAttivi.gennaio,
            this.dashClientiAttivi.febbraio,
            this.dashClientiAttivi.marzo,
            this.dashClientiAttivi.aprile,
            this.dashClientiAttivi.maggio,
            this.dashClientiAttivi.giugno,
            this.dashClientiAttivi.luglio,
            this.dashClientiAttivi.agosto,
            this.dashClientiAttivi.settembre,
            this.dashClientiAttivi.ottobre,
            this.dashClientiAttivi.novembre,
            this.dashClientiAttivi.dicembre
          ]
        ]
      };

      let maxClientiAttivi = 50;
      if (this.dashClientiAttivi.maxValue) {
        maxClientiAttivi = this.dashClientiAttivi.maxValue;
      }

      var optionswebsiteViewsChart = {
        axisX: {
          showGrid: false,
          labelOffset: {
            x: 11,
            y: 0
          }
        },
        low: 0,
        high: maxClientiAttivi,
        chartPadding: { top: 0, right: 12, bottom: 0, left: 5 }
      };


      var responsiveOptions: any[] = [
        ['screen and (max-width: 640px)', {
          seriesBarDistance: 5,
          axisX: {
            labelInterpolationFnc: function (value) {
              return value[0];
            }
          }
        }]
      ];

      if (this.dashClientiAttivi.lastModDate) {
        this.clientiAttiviDate = this.dashClientiAttivi.lastModDate;
      }

      var websiteViewsChart = new Chartist.Bar('#websiteViewsChart', datawebsiteViewsChart, optionswebsiteViewsChart, responsiveOptions);

      //start animation for the Emails Subscription Chart
      this.startAnimationForBarChart(websiteViewsChart);
    },
      error => {
        // console.log("getTopSummary");
        // console.log(error);
        this.common.sendUpdate("showAlertDanger", error.message);
      });

    this.myTopSubscription = this.dashService.getTopSummary(authToken, this.defIdRole, this.defIsAdmin, this.defAdminView, this.defSelectedBusiness, this.userLogged.selectedSocieta).subscribe(res => {
      this.topSummary = res as DashboardTopSummary;
    },
      error => {
        // console.log("getTopSummary");
        // console.log(error);

        this.common.sendUpdate("showAlertDanger", error.message);
      });

    //SOSTITUIRE CON FATTURE
    this.myBotProSubscription = this.dashService.getListBottomProspect(authToken, this.defIdRole, this.defIsAdmin, this.defAdminView, this.defSelectedBusiness, this.userLogged.selectedSocieta).subscribe(res => {
      this.listBottomProspect = res as Array<Fatture>;
    },
      error => {
     
        // console.log("getBotPro");
        // console.log(error);

        this.common.sendUpdate("showAlertDanger", error.message);
      });

    this.common.sendUpdate("hideSpinner");
  }

  openPreFilterCustomer(operation: string) {
    let redirectToUrl: string = "customers";
    switch (operation) {
      case 'cleanCust':
        this.authService.setCustomerPreFilter("state_eq_reset");
        break;
      case 'cleanProsp':
        redirectToUrl = "prospect";
        this.authService.setCustomerPreFilter("state_eq_reset");
        break;
      case 'inScadGar':
        this.authService.setCustomerPreFilter("inScadenza_eq_true");
        break;
      case 'scadGar':
        this.authService.setCustomerPreFilter("scaduta_eq_true");
        break;
      case 'rinGar':
        this.authService.setCustomerPreFilter("rinnovo_eq_true");
        break;
    }

    this.common.redirectToUrl(redirectToUrl);
  }

  createScadenzeChart(authToken: string) {
    /* ----------==========     Completed Tasks Chart initialization    ==========---------- */

    var dt = new Date();
    var month = dt.getMonth() + 1;
    var year = dt.getFullYear();
    var daysInMonth = new Date(year, month, 0).getDate();

    this.myDashGaranzieSubscription = this.dashService.getDashboardGaranzieScadenze(authToken, this.defIdRole, this.defIsAdmin, this.defAdminView, this.defSelectedBusiness, this.userLogged.selectedSocieta).subscribe(res => {
      this.dashClientiGaranziaScadenza = res as DashboardGaranzieScadenzaChart;
      let labelsArray = ['1', '2', '3', '4', '5', '6'];
      let seriesX = [];
      this.dashClientiGaranziaScadenza.settimane.forEach(element => {
        seriesX.push(element.numero);
      });
      const dataCompletedTasksChart: any =
      {
        labels: labelsArray,
        series: [
          seriesX
        ],
        
      };

      if (this.dashClientiGaranziaScadenza.lastDate) {
        this.garanzieScadenzaDate = this.dashClientiGaranziaScadenza.lastDate;
      }

      const optionsCompletedTasksChart: any = {
        lineSmooth: Chartist.Interpolation.cardinal({
          tension: 0
        }),
        low: 0,
        chartPadding: { top: 0, right: 0, bottom: 0, left: 0 }
      }

      var completedTasksChart = new Chartist.Line('#completedTasksChart', dataCompletedTasksChart, optionsCompletedTasksChart);

      // start animation for the Completed Tasks Chart - Line Chart
      this.startAnimationForLineChart(completedTasksChart);
    },
      error => {
        this.common.sendUpdate("showAlertDanger", error.message);
      });
  }

  ngOnDestroy(): void {
    ///qui viene distrutto il componente
    if (this.myTopSubscription)
      this.myTopSubscription.unsubscribe();

    if (this.myBotCliSubscription)
      this.myBotCliSubscription.unsubscribe();

    if (this.myBotProSubscription)
      this.myBotProSubscription.unsubscribe();

    if (this.myDashProspectSubscription)
      this.myDashProspectSubscription.unsubscribe();

    if (this.myDashClientiSubscription)
      this.myDashClientiSubscription.unsubscribe();


    if (this.myDashGaranzieSubscription)
      this.myDashGaranzieSubscription.unsubscribe();

    if (this.myUpdateSubscription)
      this.myUpdateSubscription.unsubscribe();
  }

}
