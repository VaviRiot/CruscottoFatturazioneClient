import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';
import { CustomHttpService } from 'app/shared/Service/CustomHTTP/custom-http.service';
import { DashboardProspectRequest } from 'app/models/Request/DashboardProspectRequest';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor() { }

  getTopSummary(authToken: string, idRole: number, isAdmin: boolean, adminView: boolean, selectedBusiness: Array<string>, societa:String)
  {
    const endpoint = environment.serverUrl + "dashboard/getDashboardTopSummary?codiceSocieta=" + societa;

    let my_headers = new HttpHeaders().set('Authorization', 'Bearer ' + authToken)
                      .append('Content-Type', 'application/json')
                      .append('Accept', 'application/json');

    // let dashReq = new DashboardProspectRequest(idRole, isAdmin, adminView, selectedBusiness);

    return CustomHttpService.get(endpoint, my_headers);
  }

  getListBottomClienti(authToken: string, idRole: number, isAdmin: boolean, adminView: boolean, selectedBusiness: Array<string>)
  {
    const endpoint = environment.serverUrl + "dashboard/getDashboardBottomClienti";

    let my_headers = new HttpHeaders().set('Authorization', 'Bearer ' + authToken)
                      .append('Content-Type', 'application/json')
                      .append('Accept', 'application/json');

    let dashReq = new DashboardProspectRequest(idRole, isAdmin, adminView, selectedBusiness);

    return CustomHttpService.post(endpoint, dashReq, {headers: my_headers});
  }

  getListBottomProspect(authToken: string, idRole: number, isAdmin: boolean, adminView: boolean, selectedBusiness: Array<string>)
  {
    const endpoint = environment.serverUrl + "dashboard/getDashboardBottomProspect";

    let my_headers = new HttpHeaders().set('Authorization', 'Bearer ' + authToken)
                      .append('Content-Type', 'application/json')
                      .append('Accept', 'application/json');

    let dashReq = new DashboardProspectRequest(idRole, isAdmin, adminView, selectedBusiness);

    return CustomHttpService.post(endpoint, dashReq, {headers: my_headers});
  }

  getDashboardNuoviProspectChart(authToken: string, idRole: number, isAdmin: boolean, adminView: boolean, selectedBusiness: Array<string>)
  {
    const endpoint = environment.serverUrl + "dashboard/getDashboardNuoviProspectChart";

    let my_headers = new HttpHeaders().set('Authorization', 'Bearer ' + authToken)
                      .append('Content-Type', 'application/json')
                      .append('Accept', 'application/json');

    let dashReq = new DashboardProspectRequest(idRole, isAdmin, adminView, selectedBusiness);

    return CustomHttpService.post(endpoint, dashReq, {headers: my_headers});
  }

  getDashboardYearChart(authToken: string, idRole: number, isAdmin: boolean, adminView: boolean, selectedBusiness: Array<string>, societa: String)
  {
    const endpoint = environment.serverUrl + "dashboard/getDashboardYearChart?codiceSocieta=" + societa;

    let my_headers = new HttpHeaders().set('Authorization', 'Bearer ' + authToken)
                      .append('Content-Type', 'application/json')
                      .append('Accept', 'application/json');

    // let dashReq = new DashboardProspectRequest(idRole, isAdmin, adminView, selectedBusiness);

    return CustomHttpService.get(endpoint, my_headers);
  }

  getDashboardGaranzieScadenze(authToken: string, idRole: number, isAdmin: boolean, adminView: boolean, selectedBusiness: Array<string>)
  {
    const endpoint = environment.serverUrl + "dashboard/getDashboardGaranzieScadenze";

    let my_headers = new HttpHeaders().set('Authorization', 'Bearer ' + authToken)
                      .append('Content-Type', 'application/json')
                      .append('Accept', 'application/json');

    let dashReq = new DashboardProspectRequest(idRole, isAdmin, adminView, selectedBusiness);

    return CustomHttpService.post(endpoint, dashReq, {headers: my_headers});
  }
}
