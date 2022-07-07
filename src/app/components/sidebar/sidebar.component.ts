import { Component, OnInit } from '@angular/core';
import { InternalMessage } from 'app/models/InternalMessage';
import { User } from 'app/models/User';
import { VoceMenu } from 'app/models/VoceMenu';
import { AuthService } from 'app/shared/Service/AuthService/auth.service';
import { CommonService } from 'app/shared/Service/Common/common.service';
import { RolesService } from 'app/shared/Service/Roles/roles.service';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { UserService } from 'app/shared/Service/User/user.service';
import { Societa } from 'app/models/Societa';
declare const $: any;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  public userLogged: User;
  public defListVociMenu = new Array<VoceMenu>();

  private mySubscription: Subscription;
  private menuSubscription: Subscription;
  public sidebarVisible: boolean = true;
  public isChildUrl: boolean = false;
  public societaName: string;
  menuItems: any[];

  constructor(private common: CommonService,
    private authService: AuthService,
    private roleService: RolesService,
    private userService: UserService) { }

  ngOnInit() {
    let authToken: string = this.authService.getAuthToken();
    this.userLogged = this.authService.getUser();
    console.log(this.userLogged)
    let roleId: number = -1;
    let isAdmin: boolean = false;
    if (this.userLogged.ruoloUtente) {
      roleId = this.userLogged.ruoloUtente.id;
      isAdmin = this.userLogged.ruoloUtente.isAdmin;
    }

    this.menuSubscription = this.roleService.getVociMenuByRoleId(authToken, roleId, isAdmin).subscribe(res => {
      this.defListVociMenu = res;
      this.userService.getSocietaList(authToken).subscribe(soc => {
        let result = soc as Societa[];
        result.forEach(element => {
            if(element.codiceSocieta == this.userLogged.selectedSocieta) {
              this.societaName = element.descrizione;
            }
        });
    
      });
      this.manageChildUrl();
      this.cleanDetailUrl();
      this.common.sendUpdate("titleMenuRefresh", JSON.stringify(this.defListVociMenu));
    });


    //this.menuItems = ROUTES.filter(menuItem => menuItem);
  }

  manageChildUrl() {
    let actualUrl = this.common.getActualUrl();
    let found = false;

    for (let index = 0; index < this.defListVociMenu.length && found != true; index++) {
      const element = this.defListVociMenu[index];

      if (element.path == actualUrl) {
        this.isChildUrl = false;
        found = true;

        if (!element.cssClass || element.cssClass == null) {
          element.cssClass = "active";
        }
        else {
          element.cssClass += " active";
        }
      }
      else if (element.child) {
        for (let indexChild = 0; indexChild < element.child.length; indexChild++) {
          const elementChild = element.child[indexChild];
          if (actualUrl.startsWith(elementChild.path) || (elementChild.isDettaglio == true && actualUrl.startsWith(elementChild.path + "/"))) {
            this.isChildUrl = true;
            found = true;

            if (!elementChild.cssClass || elementChild.cssClass == null) {
              elementChild.cssClass = "active";
            }
            else {
              elementChild.cssClass += " active";
            }

            if (elementChild.isDettaglio == true) {
              if (!element.cssClass || element.cssClass == null) {
                element.cssClass = "active";
              }
              else {
                element.cssClass += " active";
              }
            }
          }
          else if (elementChild.child) {
            for (let indexGrandSon = 0; indexGrandSon < elementChild.child.length; indexGrandSon++) {
              const elementGrandSon = elementChild.child[indexGrandSon];

              if (elementGrandSon) {
                console.log(actualUrl);
                console.log(elementGrandSon.path);
                if (actualUrl.startsWith(elementGrandSon.path) || (elementGrandSon.isDettaglio == true && actualUrl.startsWith(elementGrandSon.path + "/"))) {
                  console.log("trovato " + elementGrandSon.path);
                  this.isChildUrl = true;
                  if (!elementChild.cssClass || elementChild.cssClass == null) {
                    elementChild.cssClass = "active";
                  }
                  else {
                    elementChild.cssClass += " active";
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  cleanDetailUrl() {
    for (let index = 0; index < this.defListVociMenu.length; index++) {
      const element = this.defListVociMenu[index];

      if (element.isDettaglio == true) {
        this.defListVociMenu.splice(index, 1);
      }
      else if (element.child) {
        for (let indexChild = 0; indexChild < element.child.length; indexChild++) {
          const elementChild = element.child[indexChild];

          if (elementChild.isDettaglio == true) {
            element.child.splice(indexChild, 1);
          }
          else if (elementChild.child) {
            for (let indexGrandSon = 0; indexGrandSon < elementChild.child.length; indexGrandSon++) {
              const elementGrandSon = elementChild.child[indexChild];
              // console.log(elementGrandSon);

              if (elementGrandSon) {
                if (elementGrandSon.isDettaglio == true) {
                  elementChild.child.splice(indexChild, 1);
                }
              }
            }
          }
        }
      }
    }
  }

  get menuExport() {
    return this.defListVociMenu;
  }

  ngAfterViewInit() {
    this.mySubscription = this.common.getUpdate().subscribe(res => {

      let json_obj: InternalMessage = JSON.parse(res.text);
      // console.log(json_obj.command);

      if (json_obj.command == "sidebarToggle") {
        this.mySidebarToggle();
      }
    });
  }

  redirectTo(urlToOpen: string) {
    this.common.redirectToUrl(urlToOpen);
  }

  mySidebarToggle() {
    var sideBarObj = document.getElementsByClassName("sidebar-wrapper")[0];
    var sideBarLogo = document.getElementsByClassName("logo")[0];

    // console.log(sideBarObj);

    if (this.sidebarVisible == false) {
      sideBarObj.classList.remove('compactSidebar');
      sideBarLogo.classList.remove('compactTitleSidebar');
      this.sidebarVisible = true;
    }
    else {
      sideBarObj.classList.add('compactSidebar');
      sideBarLogo.classList.add('compactTitleSidebar');
      this.sidebarVisible = false;
    }
  }

  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  };

  onDestroy() {
    if (this.mySubscription)
      this.mySubscription.unsubscribe();

    if (this.menuSubscription)
      this.menuSubscription.unsubscribe();
  }
}
