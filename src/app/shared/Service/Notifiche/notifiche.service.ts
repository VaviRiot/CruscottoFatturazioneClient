import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'environments/environment';
import { AuthService } from 'app/shared/Service/AuthService/auth.service';
import { SummaryNotificheUtente } from "app/models/SummaryNotificheUtente";
import { CustomHttpService } from '../CustomHTTP/custom-http.service';
import { SetReadedNotifyRequest } from 'app/models/Request/SetReadedNotifyRequest';
import { DeleteRequest } from 'app/models/Request/DeleteRequest';
import { NotificaSaveRequest } from 'app/models/Request/NotificaSaveRequest';
import { Notifica } from 'app/models/Notifica';
import { FilterPayload } from 'app/models/FilterPayload';
import { Observable } from 'rxjs';
import { NotificheListOverview } from 'app/models/Response/NotificheListOverview';

@Injectable({
  providedIn: 'root'
})
export class NotificheService {

  constructor(private httpClient: HttpClient,
              private authService: AuthService) { }

  getSummaryNotificheUtente(): SummaryNotificheUtente
  {
    //console.log(sessionStorage.getItem(environment.keyNotify));
    return JSON.parse(sessionStorage.getItem(environment.keyNotify));
  }

  getNotificationByServer()
  {
      const endpointNot = environment.serverUrl + "notifiche/getNotificheUtenteSummary";
        
      let auth_token: string = this.authService.getAuthToken();
      let id_utente: number = this.authService.getUserId();

      let my_headers = new HttpHeaders().set('Authorization', 'Bearer ' + auth_token)
                      .append('Content-Type', 'application/json')
                      .append('Accept', 'application/json');

      return CustomHttpService.post(endpointNot, id_utente, {headers: my_headers});
  }  

  setSummaryNotificheUtente(obj: SummaryNotificheUtente)
  {
    sessionStorage.setItem(environment.keyNotify, JSON.stringify(obj));
  }

  setReadedNotificaUtente(idNotifica: number)
  {
    const endpoint = environment.serverUrl + "notifiche/setReadedNotificaUtente";
    let authToken: string = this.authService.getAuthToken();
    let idUtente: number = this.authService.getUserId();

    let my_headers = new HttpHeaders().set('Authorization', 'Bearer ' + authToken)
                      .append('Content-Type', 'application/json')
                      .append('Accept', 'application/json');

    let setNotReq = new SetReadedNotifyRequest(idNotifica, idUtente);

    return CustomHttpService.post(endpoint, setNotReq, {headers: my_headers});
  }

  setReadedAllNotificheUtente(idUtente: number)
  {
    const endpoint = environment.serverUrl + "notifiche/setReadedAllNotificheUtente";
    let authToken: string = this.authService.getAuthToken();

    let my_headers = new HttpHeaders().set('Authorization', 'Bearer ' + authToken)
                      .append('Content-Type', 'application/json')
                      .append('Accept', 'application/json');

    return CustomHttpService.post(endpoint, idUtente, {headers: my_headers});
  }

  getNotificheSetup(auth_token: string)
  {
    const endpoint = environment.serverUrl + "notifiche/getNotificheSetup";

    let headers = new HttpHeaders(
      {
        'Authorization': 'Bearer ' + auth_token,
         'Content-Type': 'application/json'
      }
    );

    return CustomHttpService.get(endpoint, headers);
  }

  getNotificheDataTable(authToken: string, filterPost: FilterPayload): Observable<NotificheListOverview>
  {
    const endpoint = environment.serverUrl + "notifiche/getNotificheSetupDataTable";

    
    let my_headers = new HttpHeaders().set('Authorization', 'Bearer ' + authToken)
                      .append('Content-Type', 'application/json')
                      .append('Accept', 'application/json');

    return CustomHttpService.post(endpoint, filterPost, {headers: my_headers});
  }

  getNotificheSetupById(auth_token: string, id_notifica: number)
  {
    const endpoint = environment.serverUrl + "notifiche/getNotificaSetupById";

    let my_headers = new HttpHeaders().set('Authorization', 'Bearer ' + auth_token)
                                      .append('Content-Type', 'application/json')
                                      .append('Accept', 'application/json');

    return CustomHttpService.post(endpoint, id_notifica, {headers: my_headers});
  }

  getTipologieNotificheList(auth_token: string)
  {
    const endpoint = environment.serverUrl + "notifiche/getTipologieNotificheList";

    let headers = new HttpHeaders(
      {
        'Authorization': 'Bearer ' + auth_token,
         'Content-Type': 'application/json'
      }
    );

    return CustomHttpService.get(endpoint, headers);
  }

  saveNotifica(auth_token: string, notifica: Notifica, utenteUpdate: string)
  {
    const endpoint = environment.serverUrl + "notifiche/saveNotifica";

    let my_headers = new HttpHeaders().set('Authorization', 'Bearer ' + auth_token)
                      .append('Content-Type', 'application/json')
                      .append('Accept', 'application/json');

    let saveReq = new NotificaSaveRequest(notifica, utenteUpdate);

    return CustomHttpService.post(endpoint, saveReq, {headers: my_headers});
  }

  deleteNotifica(auth_token: string, idNotifica: number, utenteUpdate: string)
  {
    const endpoint = environment.serverUrl + "notifiche/deleteNotifica";

    let my_headers = new HttpHeaders().set('Authorization', 'Bearer ' + auth_token)
                      .append('Content-Type', 'application/json')
                      .append('Accept', 'application/json');

    let deleteReq = new DeleteRequest(idNotifica, utenteUpdate);

    return CustomHttpService.post(endpoint, deleteReq, {headers: my_headers});
  }
}
