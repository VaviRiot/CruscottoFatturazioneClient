import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';
import { CustomHttpService } from 'app/shared/Service/CustomHTTP/custom-http.service';
import { User } from 'app/models/User';
import { DeleteRequest } from 'app/models/Request/DeleteRequest';
import { UserSaveRequest } from 'app/models/Request/UserSaveRequest';
import { UtentiListOverview } from 'app/models/Response/UtentiListOverview';
import { Observable } from 'rxjs';
import { FilterPayload } from 'app/models/FilterPayload';
import { RuoliListOverview } from 'app/models/Response/RuoliListOverview';
import { UserBusinessRequest } from 'app/models/Request/UserBusinessRequest';
import { RoleVoceMenuOverview } from 'app/models/Response/RoleVoceMenuOverview';
import { RoleVoceMenu } from 'app/models/RoleVoceMenu';
import { RoleVoceMenuSaveRequest } from 'app/models/Request/RoleVoceMenuSaveRequest';
import { ChangePasswordRequest } from 'app/models/Request/ChangePasswordRequest';
import { UpdateGenericResponse } from 'app/models/Response/UpdateGenericResponse';

@Injectable({
  providedIn: 'root'
})
export class UserService
{
  constructor() { }

  getUserList(authToken: string)
  {
    const endpoint = environment.serverUrl + "user/getUserList";

    let headers = new HttpHeaders(
      {
        'Authorization': 'Bearer ' + authToken,
         'Content-Type': 'application/json'
      }
    );

    return CustomHttpService.get(endpoint, headers);
  }

  getUtentiDataTable(authToken: string, filterPost: FilterPayload): Observable<UtentiListOverview>
  {
    const endpoint = environment.serverUrl + "user/getUtentiDataTable";

    
    let my_headers = new HttpHeaders().set('Authorization', 'Bearer ' + authToken)
                      .append('Content-Type', 'application/json')
                      .append('Accept', 'application/json');

    return CustomHttpService.post(endpoint, filterPost, {headers: my_headers});
  }

  getRoleVoceMenuDataTable(authToken: string, filterPost: FilterPayload): Observable<RoleVoceMenuOverview>
  {
    const endpoint = environment.serverUrl + "user/getRoleVoceMenuDataTable";

    
    let my_headers = new HttpHeaders().set('Authorization', 'Bearer ' + authToken)
                      .append('Content-Type', 'application/json')
                      .append('Accept', 'application/json');

    return CustomHttpService.post(endpoint, filterPost, {headers: my_headers});
  }

  getUser(authToken: string, id_utente: number)
  {
    const endpoint = environment.serverUrl + "user/getUserById";

    let my_headers = new HttpHeaders().set('Authorization', 'Bearer ' + authToken)
                      .append('Content-Type', 'application/json')
                      .append('Accept', 'application/json');

    return CustomHttpService.post(endpoint, id_utente, {headers: my_headers});
  }

  saveUser(authToken: string, utente: User, utenteUpdate: string)
  {
    const endpoint = environment.serverUrl + "user/saveUser";

    let my_headers = new HttpHeaders().set('Authorization', 'Bearer ' + authToken)
                      .append('Content-Type', 'application/json')
                      .append('Accept', 'application/json');

    let saveReq = new UserSaveRequest(utente, utenteUpdate);

    return CustomHttpService.post(endpoint, saveReq, {headers: my_headers});
  }

  changeUserPassword(authToken: string, idUser: number, passwordPrecedente: string, passwordNuova: string, utenteUpdate: string): Observable<UpdateGenericResponse>
  {
    const endpoint = environment.serverUrl + "user/changeUserPassword";

    let my_headers = new HttpHeaders().set('Authorization', 'Bearer ' + authToken)
                      .append('Content-Type', 'application/json')
                      .append('Accept', 'application/json');

    let changeUserPassReq = new ChangePasswordRequest(idUser, passwordPrecedente, passwordNuova, utenteUpdate);

    return CustomHttpService.post(endpoint, changeUserPassReq, {headers: my_headers});
  }

  deleteUser(authToken: string, idUser: number, utenteUpdate: string)
  {
    const endpoint = environment.serverUrl + "user/deleteUser";

    let my_headers = new HttpHeaders().set('Authorization', 'Bearer ' + authToken)
                      .append('Content-Type', 'application/json')
                      .append('Accept', 'application/json');

    let deleteReq = new DeleteRequest(idUser, utenteUpdate);

    return CustomHttpService.post(endpoint, deleteReq, {headers: my_headers});
  }

  getRuoliList(authToken: string)
  {
    const endpoint = environment.serverUrl + "user/getRuoliList";

    let headers = new HttpHeaders(
      {
        'Authorization': 'Bearer ' + authToken,
         'Content-Type': 'application/json'
      }
    );

    return CustomHttpService.get(endpoint, headers);
  }

  getRuoliDataTable(authToken: string, filterPost: FilterPayload): Observable<RuoliListOverview>
  {
    const endpoint = environment.serverUrl + "user/getRuoliDataTable";

    
    let my_headers = new HttpHeaders().set('Authorization', 'Bearer ' + authToken)
                      .append('Content-Type', 'application/json')
                      .append('Accept', 'application/json');

    return CustomHttpService.post(endpoint, filterPost, {headers: my_headers});
  }

  getGruppiList(authToken: string)
  {
    const endpoint = environment.serverUrl + "user/getGruppiList";

    let headers = new HttpHeaders(
      {
        'Authorization': 'Bearer ' + authToken,
         'Content-Type': 'application/json'
      }
    );

    return CustomHttpService.get(endpoint, headers);
  }

  getAvaiableBusinessByUser(authToken: string, idUser: number, isAdmin: boolean): Observable<Array<string>>
  {
    const endpoint = environment.serverUrl + "user/getAvaiableBusinessByUser";

    let my_headers = new HttpHeaders().set('Authorization', 'Bearer ' + authToken)
                                      .append('Content-Type', 'application/json')
                                      .append('Accept', 'application/json');

    let busReq = new UserBusinessRequest(idUser, isAdmin);                                      

    return CustomHttpService.post(endpoint, busReq, {headers: my_headers});
  }

  deleteRoleVoceMenu(authToken: string, idRoleVoceMenu: number, utenteUpdate: string)
  {
    const endpoint = environment.serverUrl + "user/deleteRoleVoceMenu";

    let my_headers = new HttpHeaders().set('Authorization', 'Bearer ' + authToken)
                      .append('Content-Type', 'application/json')
                      .append('Accept', 'application/json');

    let deleteReq = new DeleteRequest(idRoleVoceMenu, utenteUpdate);

    return CustomHttpService.post(endpoint, deleteReq, {headers: my_headers});
  }

  getVociMenuList(authToken: string)
  {
    const endpoint = environment.serverUrl + "user/getVociMenuList";

    let headers = new HttpHeaders(
      {
        'Authorization': 'Bearer ' + authToken,
         'Content-Type': 'application/json'
      }
    );

    return CustomHttpService.get(endpoint, headers);
  }


  getSocietaList(authToken: string)
  {
    const endpoint = environment.serverUrl + "societa/getSocietaList";

    let headers = new HttpHeaders(
      {
        'Authorization': 'Bearer ' + authToken,
         'Content-Type': 'application/json'
      }
    );

    return CustomHttpService.get(endpoint, headers);
  }



  getRoleVoceMenuById(authToken: string, idRoleVoceMenu: number)
  {
    const endpoint = environment.serverUrl + "user/getRoleVoceMenuById";

    let my_headers = new HttpHeaders().set('Authorization', 'Bearer ' + authToken)
                                      .append('Content-Type', 'application/json')
                                      .append('Accept', 'application/json');

    return CustomHttpService.post(endpoint, idRoleVoceMenu, {headers: my_headers});
  }

  saveRoleVoceMenu(authToken: string, roleVoceMenu: RoleVoceMenu, utenteUpdate: string)
  {
    const endpoint = environment.serverUrl + "user/saveRoleVoceMenu";

    let my_headers = new HttpHeaders().set('Authorization', 'Bearer ' + authToken)
                      .append('Content-Type', 'application/json')
                      .append('Accept', 'application/json');

    let saveReq = new RoleVoceMenuSaveRequest(roleVoceMenu, utenteUpdate);

    return CustomHttpService.post(endpoint, saveReq, {headers: my_headers});
  }
}
