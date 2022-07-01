import { HttpClient, HttpHandler, HttpHeaders, HttpXhrBackend } from "@angular/common/http";
import { Injector } from "@angular/core";
import { Observable, from } from "rxjs";
import { switchMap } from "rxjs/operators";
import { environment } from "environments/environment";
import { VerifyTokenResponse } from "app/models/VerifyTokenResponse";
import { User } from "app/models/User";
import { VerifyTokenRequest } from "app/models/Request/VerifyTokenRequest";



const InjectorInstance = Injector.create({
    providers: [
        { provide: HttpClient, deps: [HttpHandler] },
        { provide: HttpHandler, useValue: new HttpXhrBackend({ build: () => new XMLHttpRequest }) }
    ]
});

export abstract class CustomHttpService {
    
  public static post<T>(endpoint: string, object: any, headers?: any): Observable<T>{
      const http = InjectorInstance.get<HttpClient>(HttpClient);

      // console.log(headers);

      return from(this.verifyToken<VerifyTokenResponse>()).pipe(switchMap((value) => 
      {
        // console.log(value);
        if(value.isValid == true)
          {
            if(value.isRefresh == true)
            {
                sessionStorage.setItem(environment.keyToken, value.token);

                headers = new HttpHeaders(
                    {
                      'Authorization': 'Bearer ' + value.token,
                      'Content-Type': 'application/json',
                      'Accept': 'application/json'
                    }
                );
            }
        }
        else
        {
          // redirect to login            
          this.logout();

          headers = new HttpHeaders(
                {
                'Authorization': 'Bearer ',
                'Content-Type': 'application/json',
                'Accept': 'application/json'
                }
            );
        }

        return http.post<T>(endpoint, object, {headers: headers.headers});
      }));
      
  }

  public static blobWitHeaders(endpoint: string, object: any, headers?: any): Observable<ArrayBuffer>
  {
    const http = InjectorInstance.get<HttpClient>(HttpClient);

    return from(this.verifyToken<VerifyTokenResponse>()).pipe(switchMap((value) => 
    {
        // console.log(value);
        if(value.isValid == true)
          {
            if(value.isRefresh == true)
            {
                sessionStorage.setItem(environment.keyToken, value.token);

                headers = new HttpHeaders(
                    {
                      'Authorization': 'Bearer ' + value.token,
                      'Content-Type': 'application/json',
                      'Accept': 'application/json'
                    }
                );
            }
      }
      else
      {
          // redirect to login            
          this.logout();

          headers = new HttpHeaders(
                {
                'Authorization': 'Bearer ',
                'Content-Type': 'application/json',
                'Accept': 'application/json'
                }
            );
      }
    
      return http.post(`${endpoint}`, object, { headers: headers.headers, responseType: 'arraybuffer' });
    }));
  }
    
  public static get<T>(endpoint: string, headers?: any): Observable<T>{
      const http = InjectorInstance.get<HttpClient>(HttpClient);

      return from(this.verifyToken<VerifyTokenResponse>()).pipe(switchMap((value) => 
      {
          if(value.isValid == true)
          {
            if(value.isRefresh == true)
            {
                sessionStorage.setItem(environment.keyToken, value.token);

                headers = new HttpHeaders(
                    {
                      'Authorization': 'Bearer ' + value.token,
                       'Content-Type': 'application/json',
                       'Accept': 'application/json'
                    }
                );
            }

          }
          else
          {
            // redirect to login            
            this.logout();

            headers = new HttpHeaders(
                  {
                  'Authorization': 'Bearer ',
                  'Content-Type': 'application/json',
                  'Accept': 'application/json'
                  }
              );
          }

          return http.get<T>(endpoint, {headers : headers});

      }));
      
  } 

  public static logout()
  {
    sessionStorage.removeItem(environment.keyUser);
    sessionStorage.setItem(environment.keyUserId, '');
    sessionStorage.setItem(environment.keyState, 'false');
    sessionStorage.setItem(environment.keyRole, '');
    sessionStorage.setItem(environment.keyToken, '');
  }

  public static verifyToken<VerifyTokenResponse>(): Observable<VerifyTokenResponse>
  {
        const http = InjectorInstance.get<HttpClient>(HttpClient);
        const endpointNot = environment.serverUrl + "verifyToken";
        
        let token: string = sessionStorage.getItem(environment.keyToken);
        let user: User = JSON.parse(sessionStorage.getItem(environment.keyUser));
        sessionStorage.setItem(environment.keyUser, JSON.stringify(user));
        let verTokReq = new VerifyTokenRequest(token, user.username);

        return http.post<VerifyTokenResponse>(endpointNot, verTokReq);
  }  
}
