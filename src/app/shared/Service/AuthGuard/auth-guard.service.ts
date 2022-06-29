import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, CanDeactivate, CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserRoleEnum } from 'app/models/Enum/UserRoleEnum';
import { AuthService } from 'app/shared/Service/AuthService/auth.service';
import { CommonService } from '../Common/common.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate, CanActivateChild, CanDeactivate<unknown>, CanLoad {

  constructor(private authService: AuthService,
              private router: Router,
              private commonService: CommonService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let url: string = state.url;
    return this.checkUserLogin(next, url);
  }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.canActivate(next, state);
  }

  canDeactivate(
    component: unknown,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }

  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    return true;
  }

  checkUserLogin(route: ActivatedRouteSnapshot, url: any): boolean
  {
    // console.log(url);
    
    if (this.authService.isLoggedIn())
    {
      const userRole: UserRoleEnum = UserRoleEnum[this.authService.getRole()];
      const allowedRoles: UserRoleEnum[] = route.data.role as UserRoleEnum[];
      
      if (allowedRoles && allowedRoles.indexOf(userRole) === -1)
      {
        if(url != "")
        {
          this.authService.setRedirectUrl(url);
        }

        this.router.navigate(['/login'], { skipLocationChange: true });
        return false;
      }
      else if(!this.authService.isUrlAvaiable(url))
      {
        this.commonService.redirectToUrl("/dashboard");
        return false;
      }
      return true;
    }

    if(url != "")
    {
      this.authService.setRedirectUrl(url);
    }

    this.router.navigate(['/login'], { skipLocationChange: true });
    return false;
  }
}
