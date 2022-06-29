import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';
import { CustomHttpService } from 'app/shared/Service/CustomHTTP/custom-http.service';
import { DeleteRequest } from 'app/models/Request/DeleteRequest';
import { RoleSaveRequest } from 'app/models/Request/RoleSaveRequest';
import { UserRole } from 'app/models/UserRole';
import { VoceMenu } from 'app/models/VoceMenu';
import { Observable } from 'rxjs';
import { RoleMenuRequest } from 'app/models/Request/RoleMenuRequest';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  constructor() { }

  getRole(authToken: string, idRuolo: number)
  {
    const endpoint = environment.serverUrl + "user/getRoleById";

    let my_headers = new HttpHeaders().set('Authorization', 'Bearer ' + authToken)
                      .append('Content-Type', 'application/json')
                      .append('Accept', 'application/json');

    return CustomHttpService.post(endpoint, idRuolo, {headers: my_headers});
  }

  saveRole(authToken: string, role: UserRole, utenteUpdate: string)
  {
    const endpoint = environment.serverUrl + "user/saveRole";

    let my_headers = new HttpHeaders().set('Authorization', 'Bearer ' + authToken)
                      .append('Content-Type', 'application/json')
                      .append('Accept', 'application/json');

    let saveReq = new RoleSaveRequest(role, utenteUpdate);

    return CustomHttpService.post(endpoint, saveReq, {headers: my_headers});
  }

  deleteRole(authToken: string, idRole: number, utenteUpdate: string)
  {
    const endpoint = environment.serverUrl + "user/deleteRole";

    let my_headers = new HttpHeaders().set('Authorization', 'Bearer ' + authToken)
                      .append('Content-Type', 'application/json')
                      .append('Accept', 'application/json');

    let deleteReq = new DeleteRequest(idRole, utenteUpdate);

    return CustomHttpService.post(endpoint, deleteReq, {headers: my_headers});
  }

  getVociMenuByRoleId(authToken: string, idRuolo: number, isAdmin: boolean): Observable<Array<VoceMenu>>
  {
    const endpoint = environment.serverUrl + "user/getVociMenuByRoleId";

    let my_headers = new HttpHeaders().set('Authorization', 'Bearer ' + authToken)
                      .append('Content-Type', 'application/json')
                      .append('Accept', 'application/json');

    let menuReq = new RoleMenuRequest(idRuolo, isAdmin);

    return CustomHttpService.post(endpoint, menuReq, {headers: my_headers});
  }
}
