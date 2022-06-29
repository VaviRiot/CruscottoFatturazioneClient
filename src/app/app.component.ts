import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonService } from 'app/shared/Service/Common/common.service';
import { NgxSpinnerService } from "ngx-spinner";
import { AlertService } from 'ngx-alerts';
import { NotificheService } from 'app/shared/Service/Notifiche/notifiche.service';
import { SummaryNotificheUtente } from 'app/models/SummaryNotificheUtente';
import { Subscription } from 'rxjs';
import { InternalMessage } from 'app/models/InternalMessage';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {

  private mySubscription: Subscription;
  private mySubscriptionNot: Subscription;

  constructor(
    private common: CommonService,
    private spinner: NgxSpinnerService,
    private notifiche: NotificheService,
    private alertService: AlertService
  ) {
    ///qui è istanziato il componente
  }

  ngAfterViewInit(): void {
    ///qui sono "ready" i componenti figli
    this.mySubscription = this.common.getUpdate().subscribe(res => {

      let json_obj: InternalMessage = JSON.parse(res.text);
      // console.log(json_obj.command);

      if (json_obj.command == "showSpinner") 
      {
        this.spinner.show("mainSpinner");
      }
      if (json_obj.command == "hideSpinner") 
      {
        this.spinner.hide("mainSpinner");
      }
      if (json_obj.command == "refreshNotify") 
      {
        this.mySubscriptionNot = this.notifiche.getNotificationByServer().subscribe((res: SummaryNotificheUtente) => 
        {
          this.notifiche.setSummaryNotificheUtente(res);
          // console.log(res);

          this.common.sendUpdate("refreshNotifyPanel");
          
          this.common.sendUpdate("refreshBusinessButton");
        });
      }
      if(json_obj.command == "showAlertInfo")
      {
        this.alertService.info(json_obj.message);
      }
      if(json_obj.command == "showAlertWarning")
      {
        this.alertService.warning(json_obj.message);
      }
      if(json_obj.command == "showAlertDanger"){
        this.alertService.danger(json_obj.message);
      }
    });
  }

  ngOnInit(): void {
    ///qui è ready se stesso
    
  }

  ngOnDestroy(): void {
    ///qui viene distrutto il componente
    if(this.mySubscription)
    {
      this.mySubscription.unsubscribe();
    }

    if(this.mySubscriptionNot)
    {
      this.mySubscriptionNot.unsubscribe();
    }
  }
}
