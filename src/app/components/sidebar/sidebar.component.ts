import { Component, OnInit } from '@angular/core';
import { InternalMessage } from 'app/models/InternalMessage';
import { User } from 'app/models/User';
import { VoceMenu } from 'app/models/VoceMenu';
import { AuthService } from 'app/shared/Service/AuthService/auth.service';
import { CommonService } from 'app/shared/Service/Common/common.service';
import { RolesService } from 'app/shared/Service/Roles/roles.service';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
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

  menuItems: any[];

  constructor(private common: CommonService,
    private authService: AuthService,
    private roleService: RolesService) { }

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
      //this is mock
      // this.defListVociMenu = [{ "id": 1, "path": "/dashboard", "title": "Dashboard", "icon": "dashboard", "orderNumber": 1, "cssClass": null, "identifier": "dashboard", "isDettaglio": null, "child": [], "createUser": "Diego Capone", "createDate": moment("2022-04-11T10:55:00.000+00:00").toDate(), "lastModUser": null, "lastModDate": null }, 
      // { "id": 2, "path": "/fatture", "title": "Fatture", "icon": "content_copy", "orderNumber": 2, "cssClass": null, "identifier": "fatture", "isDettaglio": null, "child": [{ "id": 13, "path": "/detail_prospect", "title": "Dettaglio Prospect", "icon": "content_copy", "orderNumber": 2, "cssClass": null, "identifier": "detail_prospect", "isDettaglio": true, "child": [], "createUser": "Diego Capone", "createDate": moment("2022-04-11T10:55:00.000+00:00").toDate(), "lastModUser": null, "lastModDate": null }], "createUser": "Diego Capone", "createDate": moment("2022-04-11T10:55:00.000+00:00").toDate(), "lastModUser": null, "lastModDate": null }, { "id": 3, "path": "/customers", "title": "Clienti", "icon": "perm_contact_calendar", "orderNumber": 3, "cssClass": null, "identifier": "customers", "isDettaglio": null, "child": [], "createUser": "Diego Capone", "createDate": moment("2022-04-11T10:55:00.000+00:00").toDate(), "lastModUser": null, "lastModDate": null }, {
      //   "id": 4, "path": "", "title": "Setup", "icon": "settings", "orderNumber": 4, "cssClass": null, "identifier": "setup", "isDettaglio": null, "child": [{ "id": 5, "path": "/users", "title": "Gestione Utenti", "icon": "manage_accounts", "orderNumber": 5, "cssClass": null, "identifier": "users", "isDettaglio": null, "child": [{ "id": 20, "path": "/detail_user", "title": "Dettaglio Utente", "icon": "manage_accounts", "orderNumber": 5, "cssClass": null, "identifier": "detail_user", "isDettaglio": true, "child": null, "createUser": "Diego Capone", "createDate": moment("2022-04-11T10:55:00.000+00:00").toDate(), "lastModUser": null, "lastModDate": null }], "createUser": "Diego Capone", "createDate": moment("2022-04-11T10:55:00.000+00:00").toDate(), "lastModUser": null, "lastModDate": null }, { "id": 6, "path": "/roles", "title": "Gestione Ruoli", "icon": "supervisor_account", "orderNumber": 6, "cssClass": null, "identifier": "roles", "isDettaglio": null, "child": [{ "id": 16, "path": "/detail_role", "title": "Dettaglio Ruolo", "icon": "supervisor_account", "orderNumber": 6, "cssClass": null, "identifier": "detail_role", "isDettaglio": true, "child": null, "createUser": "Diego Capone", "createDate": moment("2022-04-11T10:55:00.000+00:00").toDate(), "lastModUser": null, "lastModDate": null }], "createUser": "Diego Capone", "createDate": moment("2022-04-11T10:55:00.000+00:00").toDate(), "lastModUser": null, "lastModDate": null }, { "id": 8, "path": "/articoli", "title": "Gestione Articoli.", "icon": "article", "orderNumber": 8, "cssClass": null, "identifier": "role_workflowstep", "isDettaglio": null, "child": [{ "id": 18, "path": "/detail_role_workflowstep", "title": "Dettaglio Iter Approvativo", "icon": "timeline", "orderNumber": 8, "cssClass": null, "identifier": "detail_role_workflowstep", "isDettaglio": true, "child": null, "createUser": "Diego Capone", "createDate": moment("2022-04-11T10:55:00.000+00:00").toDate(), "lastModUser": null, "lastModDate": null }], "createUser": "Diego Capone", "createDate": moment("2022-04-11T10:55:00.000+00:00").toDate(), "lastModUser": null, "lastModDate": null }, { "id": 9, "path": "/corrispettivi", "title": "Gestione Corrispettivi", "icon": "density_small", "orderNumber": 9, "cssClass": null, "identifier": "role_vocimenu", "isDettaglio": null, "child": [{ "id": 17, "path": "/detail_role_vocimenu", "title": "Dettaglio Ruolo Voci Menù", "icon": "reorder", "orderNumber": 9, "cssClass": null, "identifier": "detail_role_vocimenu", "isDettaglio": true, "child": null, "createUser": "Diego Capone", "createDate": moment("2022-04-11T10:55:00.000+00:00").toDate(), "lastModUser": null, "lastModDate": null }], "createUser": "Diego Capone", "createDate": moment("2022-04-11T10:55:00.000+00:00").toDate(), "lastModUser": null, "lastModDate": null },
      //   ], "createUser": "Diego Capone", "createDate": moment("2022-04-11T10:55:00.000+00:00").toDate(), "lastModUser": null, "lastModDate": null
      // },]
      // Funzione che lascia il menu aperto se è una voce figlia
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
