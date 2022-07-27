import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Fattura } from 'app/models/Fatture';
import { FilterPayload } from 'app/models/FilterPayload';
import { DeleteRequest } from 'app/models/Request/DeleteRequest';
import { FatturaOperationRequest } from 'app/models/Request/FatturaInoltraRequest';
import { FatturaSaveRequest } from 'app/models/Request/FatturaSaveRequest';
import { FatturaListOverview } from 'app/models/Response/FatturaListOverview';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { CustomHttpService } from '../CustomHTTP/custom-http.service';

@Injectable({
  providedIn: 'root'
})
export class FattureService {

  constructor() { }

  getFattureDataTable(authToken: string, filterPost: FilterPayload, societa): Observable<FatturaListOverview> {
    const endpoint = environment.serverUrl + "fattura/getFattureDataTable?codiceSocieta=" + societa;
    let my_headers = new HttpHeaders().set('Authorization', 'Bearer ' + authToken)
      .append('Content-Type', 'application/json')
      .append('Accept', 'application/json');

    return CustomHttpService.post(endpoint, filterPost, { headers: my_headers });
  }

  getLogStatoFattura(authToken: string, idFattura): Observable<FatturaListOverview> {
    const endpoint = environment.serverUrl + "fattura/getLogStatoFattura?idFattura=" + idFattura;
    let my_headers = new HttpHeaders().set('Authorization', 'Bearer ' + authToken)
      .append('Content-Type', 'application/json')
      .append('Accept', 'application/json');

    return CustomHttpService.get(endpoint, my_headers);
  }

  getFatturaById(authToken: string, idFattura: number) {
    const endpoint = environment.serverUrl + "fattura/getFatturaById";

    let my_headers = new HttpHeaders().set('Authorization', 'Bearer ' + authToken)
      .append('Content-Type', 'application/json')
      .append('Accept', 'application/json');

    return CustomHttpService.post(endpoint, idFattura, { headers: my_headers });
  }

  saveFattura(authToken: string, fattura: Fattura, utenteUpdate: string) {
    const endpoint = environment.serverUrl + "fattura/saveFattura";

    let my_headers = new HttpHeaders().set('Authorization', 'Bearer ' + authToken)
      .append('Content-Type', 'application/json')
      .append('Accept', 'application/json');

    let saveReq = new FatturaSaveRequest(fattura, utenteUpdate);

    return CustomHttpService.post(endpoint, saveReq, { headers: my_headers });
  }


  inoltraFattura(authToken: string, idFattura, utenteUpdate: string) {
    const endpoint = environment.serverUrl + "fattura/inoltraFattura";

    let my_headers = new HttpHeaders().set('Authorization', 'Bearer ' + authToken)
      .append('Content-Type', 'application/json')
      .append('Accept', 'application/json');

    let saveReq = new FatturaOperationRequest(idFattura, utenteUpdate);

    return CustomHttpService.post(endpoint, saveReq, { headers: my_headers });
  }

  getClienteById(authToken: string, codCliente: string) {
    const endpoint = environment.serverUrl + "cliente/getClienteByCodiceCliente";

    let my_headers = new HttpHeaders().set('Authorization', 'Bearer ' + authToken)
      .append('Content-Type', 'application/json')
      .append('Accept', 'application/json');

    return CustomHttpService.post(endpoint, codCliente, { headers: my_headers });
  }

  getListClienti(authToken: string, societa: number) {
    const endpoint = environment.serverUrl + "cliente/getClientiList?codiceSocieta=" + societa;
    let my_headers = new HttpHeaders().set('Authorization', 'Bearer ' + authToken)
      .append('Content-Type', 'application/json')
      .append('Accept', 'application/json');

    return CustomHttpService.get(endpoint,  my_headers );
  }

  getClienti(authToken: string, societa: number) {
    const endpoint = environment.serverUrl + "cliente/getClienti?codiceSocieta=" + societa;
    let my_headers = new HttpHeaders().set('Authorization', 'Bearer ' + authToken)
      .append('Content-Type', 'application/json')
      .append('Accept', 'application/json');

    return CustomHttpService.get(endpoint,  my_headers );
  }

  
  validaFattura(authToken: string, idFattura, utenteUpdate: string) {
    const endpoint = environment.serverUrl + "fattura/validaFattura";

    let my_headers = new HttpHeaders().set('Authorization', 'Bearer ' + authToken)
      .append('Content-Type', 'application/json')
      .append('Accept', 'application/json');

    let saveReq = new FatturaOperationRequest(idFattura, utenteUpdate);

    return CustomHttpService.post(endpoint, saveReq, { headers: my_headers });
  }


  rifiutaFattura(authToken: string, idFattura, utenteUpdate: string) {
    const endpoint = environment.serverUrl + "fattura/rifiutaFattura";

    let my_headers = new HttpHeaders().set('Authorization', 'Bearer ' + authToken)
      .append('Content-Type', 'application/json')
      .append('Accept', 'application/json');

    let saveReq = new FatturaOperationRequest(idFattura, utenteUpdate);

    return CustomHttpService.post(endpoint, saveReq, { headers: my_headers });
  }


}
