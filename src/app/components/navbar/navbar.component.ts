import { Component, OnInit, ElementRef, ChangeDetectorRef } from '@angular/core';
//import { ROUTE } from '../sidebar/sidebar.component';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import { Router } from '@angular/router';
import { NotificheService } from 'app/shared/Service/Notifiche/notifiche.service';
import { SummaryNotificheUtente } from "app/models/SummaryNotificheUtente";
import { CommonService } from 'app/shared/Service/Common/common.service';
import { Subscription } from 'rxjs';
import { NotificaUtente } from 'app/models/NotificaUtente';
import { InternalMessage } from 'app/models/InternalMessage';
import { environment } from 'environments/environment';
import { AuthService } from 'app/shared/Service/AuthService/auth.service';
import { User } from 'app/models/User';
import { UserService } from 'app/shared/Service/User/user.service';
import { Business } from 'app/models/Business';
import { VoceMenu } from 'app/models/VoceMenu';
import { i18nMetaToJSDoc } from '@angular/compiler/src/render3/view/i18n/meta';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

    ///use for expand notify bug fix
    public notifyExpanded = false;

    private listTitles: any[];
    public location: Location;
    public mobile_menu_visible: any = 0;
    private toggleButton: any;
    private sidebarVisible: boolean;
    public notNumber: number = 0;

    public userLogged: User;
    public userId: number = -1;

    public showDropDownNotify: boolean = false;
    public showButtonBusiness: boolean = false;
    public showDropDownBusiness: boolean = false;
    public defListUnreaded = new Array<NotificaUtente>();
    public sumNotUtente = new SummaryNotificheUtente(0, 0, 0, new Array<NotificaUtente>(), new Array<NotificaUtente>());

    public defListVociMenu = new Array<VoceMenu>();
    
    public defAvaiableBusiness = new Array<Business>();
    public defSelectedBusiness = null;
    
    private mySubscription: Subscription;
    private myUpdateSubscription: Subscription;
    private mySetSubscription: Subscription;
    private myLogoutSubscription: Subscription;
    private myBusSubscription: Subscription;

    private extraUrl: any[];

    constructor(location: Location, 
                private element: ElementRef,
                private router: Router,
                private notifiche: NotificheService,
                private common: CommonService,
                private cdr: ChangeDetectorRef,
                private authService: AuthService,
                private userService: UserService)
    {
        this.location = location;
        this.sidebarVisible = true;
    }

    ngOnInit()
    {
        this.extraUrl = [
            { path: "/detail_prospect", title: "Dettaglio Prospect" }
          ];

        this.userId = +sessionStorage.getItem(environment.keyUserId);

        this.sumNotUtente = this.notifiche.getSummaryNotificheUtente();

        if(this.notifiche.getSummaryNotificheUtente())
        {
            this.defListUnreaded = this.notifiche.getSummaryNotificheUtente().listUnreaded;
        }

        //this.listTitles = ROUTE.filter(listTitle => listTitle);
        const navbar: HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0];
        this.mySubscription = this.router.events.subscribe((event) =>
        {
            this.sidebarClose();
            var $layer: any = document.getElementsByClassName('close-layer')[0];
            if ($layer)
            {
            $layer.remove();
            this.mobile_menu_visible = 0;
            }
        });
    }
  
    ngAfterViewInit()
    {
        this.myUpdateSubscription = this.common.getUpdate().subscribe(res => {
    
          let json_obj: InternalMessage = JSON.parse(res.text);

          // console.log(json_obj);

          if(json_obj.command == "refreshBusinessButton")
          {
            if(this.router.url == "/dashboard")
            {
                this.refreshBusinessList();
                this.showButtonBusiness = true;
                this.cdr.detectChanges();
            }
            else
            {
                this.showButtonBusiness = false;
                this.cdr.detectChanges();
            }
          }
          else if(json_obj.command == "refreshNotifyPanel")
          {
            this.sumNotUtente = this.notifiche.getSummaryNotificheUtente();
            this.defListUnreaded = this.notifiche.getSummaryNotificheUtente().listUnreaded;

            // console.log(this.defListUnreaded);
            this.showDropDownNotify = false;
            this.cdr.detectChanges();
          }
          else if (json_obj.command == "titleMenuRefresh") 
          {
            this.refreshMenuTitle(JSON.parse(json_obj.message));
          }
        });
    }

    public refreshMenuTitle(menuList: Array<VoceMenu>)
    {
        this.listTitles = menuList.filter(listTitle => listTitle);
    }

    public changeBusiness(checked: boolean, business: string)
    {
        if(checked)
        {
            this.addBusinessSelected(business);
        }
        else
        {
            this.remBusinessSelected(business);
        }
        
        this.authService.setSelectedBusiness(this.defSelectedBusiness);
        this.common.sendUpdate("refreshDashboardBusiness");
    }

    public addBusinessSelected(business: string)
    {
        let present: boolean = false;
        this.defSelectedBusiness.forEach(element => {
            if(element == business)
            {
                present = true;
            }
        });

        if(!present)
        {
            this.defSelectedBusiness.push(business);
        }
    }

    public remBusinessSelected(business: string)
    {
        let busString = business.toString();

        if(this.defSelectedBusiness)
        {
            this.defSelectedBusiness.forEach((element,index) => {
                if(element == busString)
                {
                    this.defSelectedBusiness.splice(index, 1)
                }
            });
        }
    }

    public refreshBusinessList()
    {
        let authToken: string = this.authService.getAuthToken();
        let refreshDash = false;

        this.userLogged = this.authService.getUser();
        let isAdmin: boolean = false;
        if(this.userLogged.ruoloUtente)
        {
          isAdmin = this.userLogged.ruoloUtente.isAdmin;
        }

        // impongo il refresh della dash dopo il login dove i business non sono ancora caricati
        if(this.authService.getAvaiableBusiness() == null)
        {
            refreshDash = true;
        }

        this.myBusSubscription = this.userService.getAvaiableBusinessByUser(authToken, this.userLogged.id, isAdmin).subscribe(res =>
        {
            //console.log(res);
            let resString = JSON.stringify(res);
            this.userLogged.avaiableBusiness = JSON.parse(resString);
            
            this.authService.setAvaiableBusiness(JSON.parse(resString));

            // console.log(this.defSelectedBusiness);
            if(this.defSelectedBusiness == null)
            {
                let appSelectList: Array<string> = this.authService.getSelectedBusiness();

                // console.log(appSelectList);
                if(appSelectList && appSelectList != new Array<string>())
                {
                    this.defSelectedBusiness = appSelectList;
                }
                else
                {
                    this.defSelectedBusiness = JSON.parse(resString);
                    this.authService.setSelectedBusiness(JSON.parse(resString));
                }
            }
            // console.log(this.defSelectedBusiness);

            this.defAvaiableBusiness = this.addBusinessClass(JSON.parse(resString));

            if(refreshDash == true)
            {
                this.common.sendUpdate("refreshDashboardBusiness");
            }
            
            // debugger;
        });
    }

    addBusinessClass(busList: Array<string>): Array<Business>
    {
        let resultList = new Array<Business>();
        busList.forEach(element => {
            let busItem = new Business(element);
            switch(element)
            {
                case "AWP":
                    busItem.className = "text-info";
                    break;
                case "VLT":
                    busItem.className = "text-success";
                    break;
                case "PAT":
                    busItem.className = "text-warning";
                    break;
                case "ZA":
                    busItem.className = "text-danger";
                    break;
                case "ZC":
                    busItem.className = "text-primary";
                    break;
            }

            resultList.push(busItem);
        });

        return resultList;
    }

    public toggleBusiness()
    {
        if(this.showDropDownBusiness == true)
        {
            this.showDropDownBusiness = false;
        }
        else
        {
            this.showDropDownBusiness = true;
        }
    }

    public toggleNotifiche()
    {
        if(this.defListUnreaded.length > 0)
        {
            if(this.showDropDownNotify == true)
            {
                this.showDropDownNotify = false;
            }
            else
            {
                this.showDropDownNotify = true;
            }
        }
        else
        {
            this.showDropDownNotify = false;
        }
    }

    setReadNotifica(notifica: NotificaUtente)
    {
        this.common.sendUpdate("showSpinner");

        this.mySetSubscription = this.notifiche.setReadedNotificaUtente(notifica.id).subscribe((res:SummaryNotificheUtente) => 
        {
            this.sumNotUtente = res;
            this.showDropDownNotify = false;

            if(this.sumNotUtente.unreadedCount)
            {
                this.notNumber = this.sumNotUtente.unreadedCount;
            }
            this.notifiche.setSummaryNotificheUtente(res);
            
            if(this.sumNotUtente.listUnreaded)
            {
                this.defListUnreaded = this.sumNotUtente.listUnreaded;
            }

            if(notifica.urlToOpen)
            {
                if(notifica.urlToOpen != "")
                {
                    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
                    this.router.onSameUrlNavigation = 'reload';
                    this.router.navigate(['/' + notifica.urlToOpen]);
                }
            }

            this.common.sendUpdate("hideSpinner");            
        },
        error => 
        {
            // console.log(error);
            this.common.sendUpdate("hideSpinner");
            this.common.sendUpdate("showAlertDanger", error.message);
        });
    }

    readAllNotify()
    {
        this.common.sendUpdate("showSpinner");

        this.mySetSubscription = this.notifiche.setReadedAllNotificheUtente(this.userId).subscribe((res:SummaryNotificheUtente) => 
        {
            this.sumNotUtente = res;
            this.showDropDownNotify = false;

            if(this.sumNotUtente.unreadedCount)
            {
                this.notNumber = this.sumNotUtente.unreadedCount;
            }
            this.notifiche.setSummaryNotificheUtente(res);
            
            if(this.sumNotUtente.listUnreaded)
            {
                this.defListUnreaded = this.sumNotUtente.listUnreaded;
            }

            this.common.sendUpdate("hideSpinner");            
        },
        error => 
        {
            // console.log(error);
            this.common.sendUpdate("hideSpinner");
            this.common.sendUpdate("showAlertDanger", error.message);
        });
    }

    public trackItem(index: number, item: NotificaUtente){
        return item.id;
    }

    callSideBarToggle()
    {      
      this.common.sendUpdate("sidebarToggle");

      this.myMenuButtonToggle();
    }

    myMenuButtonToggle()
    {
        var buttonMenu = document.getElementsByClassName("navbar-toggle")[0];

        // console.log(sideBarObj);

        if(this.sidebarVisible == false)
        {
            buttonMenu.classList.remove('compactSidebar');
            this.sidebarVisible = true;
        }
        else
        {
            buttonMenu.classList.add('compactSidebar');
            this.sidebarVisible = false;
        }
    }

    sidebarOpen()
    {
        const toggleButton = this.toggleButton;
        const body = document.getElementsByTagName('body')[0];
        // setTimeout(function(){
        //     toggleButton.classList.add('toggled');
        // }, 500);

        // body.classList.add('nav-open');

        // this.sidebarVisible = true;
    };

    sidebarClose()
    {
        const body = document.getElementsByTagName('body')[0];
        // this.toggleButton.classList.remove('toggled');
        // this.sidebarVisible = false;
        // body.classList.remove('nav-open');
    };

    getTitle()
    {
        var title = this.location.prepareExternalUrl(this.location.path());

        if(title.charAt(0) === '#')
        {
            title = title.slice( 1 );
        }

        if(this.listTitles)
        {
            for(var item = 0; item < this.listTitles.length; item++){
                if(this.listTitles[item].path === title)
                {
                    return this.listTitles[item].title;
                }
                else if(this.listTitles[item].child)
                {
                    for(var subItem = 0; subItem < this.listTitles[item].child.length; subItem++)
                    {
                        if(this.listTitles[item].child[subItem].path === title)
                        {
                            return this.listTitles[item].title;
                        }
                    }
                }
            }
        }

        for(var item = 0; item < this.extraUrl.length; item++)
        {
          if(this.extraUrl[item].path == title.substring(0, this.extraUrl[item].path.length))
          {
              return this.extraUrl[item].title;
          }
        }

      return 'Dashboard';
    }

    getNotificationNumber(): number
    {
        try
        {
            /*console.log(this.notifiche.getSummaryNotificheUtente().unreadedCount);
            console.log(this.sumNotUtente.unreadedCount);
            
            console.log(this.notifiche.getSummaryNotificheUtente().listUnreaded);
            console.log(this.sumNotUtente.listUnreaded);*/

            if(this.notifiche.getSummaryNotificheUtente())
            {
                return this.notifiche.getSummaryNotificheUtente().unreadedCount;
            }
            else
            {
                return 0;
            }
            /*this.sumNotUtente = this.notifiche.getSummaryNotificheUtente();
    
            return this.sumNotUtente.unreadedCount;*/
        }
        catch(Exception)
        {
            console.log(Exception);
            return 0;
        }
    }

    logout()
    {
        this.common.sendUpdate("showSpinner");

        let auth_token: string = this.authService.getAuthToken();

        this.myLogoutSubscription = this.authService.serverLogout(auth_token, this.userId).subscribe(res => 
        {
            this.authService.logout().subscribe(() =>{

                
                this.common.sendUpdate("hideSpinner");
    
                // this.common.redirectToUrl('/login');
                this.router.navigate(["/login"])
                .then(() => {
                  window.location.reload();
                });

            });
        },
        error => {
            // console.log("getTopSummary");
            // console.log(error);

            this.common.sendUpdate("hideSpinner");
            this.common.sendUpdate("showAlertDanger", error.message);
        });
    }

    ngOnDestroy(): void
    {
      // Qui viene distrutto il componente
      if(this.mySetSubscription)
        this.mySetSubscription.unsubscribe();

      if(this.mySubscription)
        this.mySubscription.unsubscribe();

      if(this.myUpdateSubscription)
        this.myUpdateSubscription.unsubscribe();

      if(this.myLogoutSubscription)
        this.myLogoutSubscription.unsubscribe();

      if(this.myBusSubscription)
        this.myBusSubscription.unsubscribe();
    }
}
