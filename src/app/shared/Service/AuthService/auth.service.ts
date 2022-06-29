import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from 'app/models/User';
import { environment } from 'environments/environment';
import { of } from 'rxjs';
import { LoginRequest } from 'app/models/Request/LoginRquest';
import { CustomHttpService } from 'app/shared/Service/CustomHTTP/custom-http.service';
import { VoceMenu } from 'app/models/VoceMenu';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLogin = false;
  roleAs: string;
  tokenUsr: string;
  userId: number;

  constructor(private httpClient: HttpClient) { }

  registerLogin(user: User)
  {
    this.isLogin = true;
    this.roleAs = user.ruoloUtente.name.toString();
    this.tokenUsr = user.token.toString();
    sessionStorage.setItem(environment.keyUser, JSON.stringify(user));
    sessionStorage.setItem(environment.keyUserId, user.id.toString());
    sessionStorage.setItem(environment.keyState, 'true');
    sessionStorage.setItem(environment.keyRole, this.roleAs);
    sessionStorage.setItem(environment.keyToken, this.tokenUsr);
    //sessionStorage.setItem(environment.keyBusiness, JSON.stringify(user.avaiableBusiness));
    return of({ success: this.isLogin, role: this.roleAs });
  }

  logout()
  {
    this.isLogin = false;
    this.roleAs = '';
    this.tokenUsr = '';
    sessionStorage.removeItem(environment.keyUser);
    sessionStorage.removeItem(environment.keyUserId);
    sessionStorage.removeItem(environment.keyState);
    sessionStorage.removeItem(environment.keyRole);
    sessionStorage.removeItem(environment.keyToken);
    sessionStorage.removeItem(environment.keyNotify);
    sessionStorage.removeItem(environment.keyBusiness);
    sessionStorage.removeItem(environment.keySelectBusiness);
    return of({ success: true, role: '' });
  }

  isLoggedIn() 
  {
    const loggedIn = sessionStorage.getItem(environment.keyState);
    if (loggedIn == 'true')
      this.isLogin = true;
    else
      this.isLogin = false;
    return this.isLogin;
  }

  getRole(): string
  {
    this.roleAs = sessionStorage.getItem(environment.keyRole);
    return this.roleAs;
  }

  getUserId(): number
  {
    this.userId = +sessionStorage.getItem(environment.keyUserId);
    return this.userId;
  }

  getAuthToken(): string
  {
    this.tokenUsr = sessionStorage.getItem(environment.keyToken);
    return this.tokenUsr;
  }

  getUser(): User
  {
    return JSON.parse(sessionStorage.getItem(environment.keyUser));
  }

  getRedirectUrl(): string
  {
    let returnString: string = "";
    if(sessionStorage.getItem(environment.keyRedirectUrl))
    {
      returnString = JSON.parse(sessionStorage.getItem(environment.keyRedirectUrl));
    }
    return returnString;
  }

  setRedirectUrl(urlRequirect: string)
  {
    sessionStorage.setItem(environment.keyRedirectUrl, JSON.stringify(urlRequirect));
  }

  setAvaiableBusiness(avaiableBusiness: Array<string>)
  {
    sessionStorage.setItem(environment.keyBusiness, JSON.stringify(avaiableBusiness));
  }

  getAvaiableBusiness(): Array<string>
  {
    return JSON.parse(sessionStorage.getItem(environment.keyBusiness));
  }

  setSelectedBusiness(selectedBusiness: Array<string>)
  {
    sessionStorage.setItem(environment.keySelectBusiness, JSON.stringify(selectedBusiness));
  }

  getSelectedBusiness(): Array<string>
  {
    return JSON.parse(sessionStorage.getItem(environment.keySelectBusiness));
  }

  setCustomerPreFilter(customerPreFilter: string)
  {
    sessionStorage.setItem(environment.gmtCliPreListFilter, JSON.stringify(customerPreFilter));
  }

  getCustomerPreFilter(): string
  {
    return JSON.parse(sessionStorage.getItem(environment.gmtCliPreListFilter));
  }

  isUrlAvaiable(url: string): boolean
  {
    if(this.isPublicUrl(url))
    {
      return true;
    }
    else
    {
      let userLogged: User = this.getUser();

      //console.log(userLogged.vociMenu);
  
      let vociUtente: Array<VoceMenu> = userLogged.vociUtente;
  
      if(vociUtente)
      {
        for (let index = 0; index < vociUtente.length; index++) {
          const voceApp = vociUtente[index];
  
          // console.log('-----------');
          // console.log(voceApp.path);
          // console.log(url);
  
          if(voceApp.path == url)
          {
            // console.log('return true');
            return true;
          }
          else if(voceApp.child)
          {
            for (let index = 0; index < voceApp.child.length; index++) {
              const elementChild = voceApp.child[index];
              
              if(elementChild.path = url)
              {
                return true;
              }
            }
          }
        }
      }
      // console.log('return false');
      return false;
    }
  }

  isPublicUrl(url:string): boolean
  {
    let publicUrls = environment.publicUrls;

    for (let index = 0; index < publicUrls.length; index++) {
      const pubUrl = publicUrls[index];
      
      if(url.startsWith(pubUrl))
      {
        return true;
      }
    }

    return false;
  }

  serverLogin(logRequest: LoginRequest)
  {
    const endpoint = environment.serverUrl + "login";
    
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    
    let options = { headers: headers };

    // console.log(options);

    return this.httpClient.post(endpoint, logRequest, options);
  }

  serverLogout(authToken: string, id_utente: number)
  {
    const endpoint = environment.serverUrl + "user/logout";

    let my_headers = new HttpHeaders().set('Authorization', 'Bearer ' + authToken)
                      .append('Content-Type', 'application/json')
                      .append('Accept', 'application/json');

    return CustomHttpService.post(endpoint, id_utente, {headers: my_headers});
  }
}
