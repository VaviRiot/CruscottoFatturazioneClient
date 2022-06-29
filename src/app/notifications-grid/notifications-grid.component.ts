import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmMessageComponent } from 'app/modals/confirm_message/confirm_message.component';
import { Notifica } from 'app/models/Notifica';
import { User } from 'app/models/User';
import { Workflow } from 'app/models/Workflow';
import { AuthService } from 'app/shared/Service/AuthService/auth.service';
import { CommonService } from 'app/shared/Service/Common/common.service';
import { NotificheService } from 'app/shared/Service/Notifiche/notifiche.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notifications-grid',
  templateUrl: './notifications-grid.component.html',
  styleUrls: ['./notifications-grid.component.css']
})
export class NotificationsGridComponent implements OnInit {
  
  private listSubscription: Subscription;  
  public listNotifications: Array<User>;

  public userLogged: User;

  private deleteSubscription: Subscription;
  
  public dataAttuale: Date = new Date();

  constructor(private notificheService: NotificheService,
              private common: CommonService,
              public dialog: MatDialog,
              private authService: AuthService)
              { }

  ngOnInit(): void {
    this.loadNotificationsList();
  }

  loadNotificationsList()
  {
    this.common.sendUpdate("refreshNotify");
    this.common.sendUpdate("showSpinner");

    this.userLogged = this.authService.getUser();
    // console.log(this.userLogged);

    let auth_token: string = this.authService.getAuthToken();
    
    this.listSubscription = this.notificheService.getNotificheSetup(auth_token).subscribe(res =>{
      let appListNotification = res as Array<Notifica>;

      appListNotification.forEach(notify => {
        if(!notify.workflowStepNotifiche.workflow)
        {
          notify.workflowStepNotifiche.workflow = new Workflow(0, '', '', '', null, '', null);
        }
      });

      this.listNotifications = appListNotification;

      console.log(this.listNotifications);
    },
    error => {
      // console.log("getTopSummary");
      // console.log(error);
      
      this.common.sendUpdate("hideSpinner");
      this.common.sendUpdate("showAlertDanger", error.message);
    });

    this.common.sendUpdate("hideSpinner");
  }

  deleteNotification(notification_id: number)
  {
    const dialogConfig = new MatDialogConfig()
    dialogConfig.id = 'confirm-message-modal'
    dialogConfig.height = 'fit-content'
    dialogConfig.width = '25rem';

    const modalDialog = this.dialog.open(ConfirmMessageComponent, dialogConfig);
    modalDialog.componentInstance.messageText = "Sei sicuro di voler cancellare la notifica?";

    modalDialog.afterClosed().subscribe(res => 
    {
      if (res == true)
      {
        this.common.sendUpdate("showSpinner");
        
        let auth_token: string = this.authService.getAuthToken();
        this.deleteSubscription = this.notificheService.deleteNotifica(auth_token, notification_id, this.userLogged.name).subscribe((res: boolean) => 
        {
          if(res)
          {
            //console.log(res);
            this.common.sendUpdate("showAlertInfo", "Notifica rimosso correttamente!");

            this.loadNotificationsList();

            this.common.sendUpdate("hideSpinner");
          }
          else
          {
            this.common.sendUpdate("hideSpinner");
            this.common.sendUpdate("showAlertDanger", "Impossibile rimuovere la notifica al momento.");
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
    if(this.listSubscription)
    this.listSubscription.unsubscribe();
    
    if(this.deleteSubscription)
    this.deleteSubscription.unsubscribe();
  }

}
