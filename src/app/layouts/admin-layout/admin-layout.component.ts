import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy, PopStateEvent } from '@angular/common';
import 'rxjs/add/operator/filter';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import PerfectScrollbar from 'perfect-scrollbar';
import * as $ from "jquery";
import { CommonService } from 'app/shared/Service/Common/common.service';
import { InternalMessage } from 'app/models/InternalMessage';


@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit {
  private _router: Subscription;
  private mySubscription: Subscription;
  private lastPoppedUrl: string;
  private yScrollStack: number[] = [];
  public menuItems: any[];
  test: Date = new Date();
  closeResult: string;
  public sidebarColor: string = "red";
  public isCollapsed = true;
  mobile_menu_visible: any = 0;
  private toggleButton: any;
  public sidebarVisible: boolean = true;

  constructor(
              public location: Location,
              private common: CommonService,
              private router: Router
            )
   { }

  ngOnInit() {
      const isWindows = navigator.platform.indexOf('Win') > -1 ? true : false;

      if (isWindows && !document.getElementsByTagName('body')[0].classList.contains('sidebar-mini')) {
          // if we are on windows OS we activate the perfectScrollbar function

          document.getElementsByTagName('body')[0].classList.add('perfect-scrollbar-on');
      } else {
          document.getElementsByTagName('body')[0].classList.remove('perfect-scrollbar-off');
      }
      const elemMainPanel = <HTMLElement>document.querySelector('.main-panel');
      const elemSidebar = <HTMLElement>document.querySelector('.sidebar .sidebar-wrapper');

      this.location.subscribe((ev:PopStateEvent) => {
          this.lastPoppedUrl = ev.url;
      });
       this.router.events.subscribe((event:any) => {
          if (event instanceof NavigationStart) {
             if (event.url != this.lastPoppedUrl)
                 this.yScrollStack.push(window.scrollY);
         } else if (event instanceof NavigationEnd) {
             if (event.url == this.lastPoppedUrl) {
                 this.lastPoppedUrl = undefined;
                 window.scrollTo(0, this.yScrollStack.pop());
             } else
                 window.scrollTo(0, 0);
         }
      });
      this._router = this.router.events.filter(event => event instanceof NavigationEnd).subscribe((event: NavigationEnd) => {
           elemMainPanel.scrollTop = 0;
           elemSidebar.scrollTop = 0;
      });
      if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
          let ps = new PerfectScrollbar(elemMainPanel);
          ps = new PerfectScrollbar(elemSidebar);
      }

      const window_width = $(window).width();
      let $sidebar = $('.sidebar');
      let $sidebar_responsive = $('body > .navbar-collapse');
      let $sidebar_img_container = $sidebar.find('.sidebar-background');


      if(window_width > 767){
          if($('.fixed-plugin .dropdown').hasClass('show-dropdown')){
              $('.fixed-plugin .dropdown').addClass('open');
          }

      }

      $('.fixed-plugin a').click(function(event){
        // Alex if we click on switch, stop propagation of the event, so the dropdown will not be hide, otherwise we set the  section active
          if($(this).hasClass('switch-trigger')){
              if(event.stopPropagation){
                  event.stopPropagation();
              }
              else if(window.event){
                 window.event.cancelBubble = true;
              }
          }
      });

      $('.fixed-plugin .badge').click(function(){
          let $full_page_background = $('.full-page-background');


          $(this).siblings().removeClass('active');
          $(this).addClass('active');

          var new_color = $(this).data('color');

          if($sidebar.length !== 0){
              $sidebar.attr('data-color', new_color);
          }

          if($sidebar_responsive.length != 0){
              $sidebar_responsive.attr('data-color',new_color);
          }
      });

      $('.fixed-plugin .img-holder').click(function(){
          let $full_page_background = $('.full-page-background');

          $(this).parent('li').siblings().removeClass('active');
          $(this).parent('li').addClass('active');


          var new_image = $(this).find("img").attr('src');

          if($sidebar_img_container.length !=0 ){
              $sidebar_img_container.fadeOut('fast', function(){
                 $sidebar_img_container.css('background-image','url("' + new_image + '")');
                 $sidebar_img_container.fadeIn('fast');
              });
          }

          if($full_page_background.length != 0){

              $full_page_background.fadeOut('fast', function(){
                 $full_page_background.css('background-image','url("' + new_image + '")');
                 $full_page_background.fadeIn('fast');
              });
          }

          if($sidebar_responsive.length != 0){
              $sidebar_responsive.css('background-image','url("' + new_image + '")');
          }
      });

  }
  
  ngAfterViewInit() {
      this.runOnRouteChange();
      this.mySubscription = this.common.getUpdate().subscribe(res => {
  
        let json_obj: InternalMessage = JSON.parse(res.text);
        // console.log(json_obj.command);
  
        if (json_obj.command == "sidebarToggle") 
        {
          this.mySidebarToggle();
        }
      });
  }
  
  isMaps(path){
      var titlee = this.location.prepareExternalUrl(this.location.path());
      titlee = titlee.slice( 1 );
      if(path == titlee){
          return false;
      }
      else {
          return true;
      }
  }
  runOnRouteChange(): void {
    if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
      const elemMainPanel = <HTMLElement>document.querySelector('.main-panel');
      const ps = new PerfectScrollbar(elemMainPanel);
      ps.update();
    }
  }
  isMac(): boolean {
      let bool = false;
      if (navigator.platform.toUpperCase().indexOf('MAC') >= 0 || navigator.platform.toUpperCase().indexOf('IPAD') >= 0) {
          bool = true;
      }
      return bool;
  }

  
  sidebarOpen() {
    const toggleButton = this.toggleButton;
    const mainPanel = <HTMLElement>(
      document.getElementsByClassName("main-panel")[0]
    );

    console.log(mainPanel);

    const html = document.getElementsByTagName("html")[0];
    if (window.innerWidth < 991) {
      mainPanel.style.position = "fixed";
    }

    /*setTimeout(function() {
      toggleButton.classList.add("toggled");
    }, 500);*/

    html.classList.add("nav-open");

    this.sidebarVisible = true;
  }

  mySidebarToggle()
  {
    var sideBarObj = document.getElementsByClassName("sidebar")[0];
    var mainObj = document.getElementsByClassName("main-panel")[0];

    if(this.sidebarVisible == false)
    {
      sideBarObj.classList.remove('hideSidebar');
      sideBarObj.classList.add('showSidebar');
      mainObj.classList.remove('width100');
      this.sidebarVisible = true;
    }
    else
    {
      sideBarObj.classList.remove('showSidebar');
      sideBarObj.classList.add('hideSidebar');
      mainObj.classList.add('width100');
      this.sidebarVisible = false;
    }
  }

  sidebarClose() {
    const html = document.getElementsByTagName("html")[0];
    // this.toggleButton.classList.remove("toggled");
    const mainPanel = <HTMLElement>(
      document.getElementsByClassName("main-panel")[0]
    );

    if (window.innerWidth < 991) {
      setTimeout(function() {
        mainPanel.style.position = "";
      }, 500);
    }
    this.sidebarVisible = false;
    html.classList.remove("nav-open");
  }

  // sidebarToggle() {
  //   // const toggleButton = this.toggleButton;
  //   // const html = document.getElementsByTagName('html')[0];
  //   var $toggle = document.getElementsByClassName("navbar-toggler")[0];

  //   if (this.sidebarVisible === false) {
  //     this.sidebarOpen();
  //   } else {
  //     this.sidebarClose();
  //   }
  //   const html = document.getElementsByTagName("html")[0];

  //   if (this.mobile_menu_visible == 1) {
  //     // $('html').removeClass('nav-open');
  //     html.classList.remove("nav-open");
  //     if ($layer) {
  //       $layer.remove();
  //     }
  //     setTimeout(function() {
  //       $toggle.classList.remove("toggled");
  //     }, 400);

  //     this.mobile_menu_visible = 0;
  //   } else {
  //     setTimeout(function() {
  //       $toggle.classList.add("toggled");
  //     }, 430);

  //     var $layer = document.createElement("div");
  //     $layer.setAttribute("class", "close-layer");

  //     if (html.querySelectorAll(".main-panel")) {
  //       document.getElementsByClassName("main-panel")[0].appendChild($layer);
  //     } else if (html.classList.contains("off-canvas-sidebar")) {
  //       document
  //         .getElementsByClassName("wrapper-full-page")[0]
  //         .appendChild($layer);
  //     }

  //     setTimeout(function() {
  //       $layer.classList.add("visible");
  //     }, 100);

  //     $layer.onclick = function() {
  //       //asign a function
  //       html.classList.remove("nav-open");
  //       this.mobile_menu_visible = 0;
  //       $layer.classList.remove("visible");
  //       setTimeout(function() {
  //         $layer.remove();
  //         $toggle.classList.remove("toggled");
  //       }, 400);
  //     }.bind(this);

  //     html.classList.add("nav-open");
  //     this.mobile_menu_visible = 1;
  //   }
  // }

  ngOnDestroy(): void {
    ///qui viene distrutto il componente
    if(this.mySubscription)
    {
      this.mySubscription.unsubscribe();
    }
  }

}
