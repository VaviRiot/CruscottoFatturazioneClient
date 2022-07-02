import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Corrispettivi } from 'app/models/Corrispettivi';
import { FilterPayload } from 'app/models/FilterPayload';
import { CorrispettivoSaveRequest } from 'app/models/Request/CorrispettivoSaveRequest';
import { DeleteRequest } from 'app/models/Request/DeleteRequest';
import { CorrispettiviListOverview } from 'app/models/Response/CorrispettiviListOverview';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { CustomHttpService } from '../CustomHTTP/custom-http.service';

@Injectable({
  providedIn: 'root'
})
export class CorrispettiviService {

  constructor() { }

  getCorrispettiviDataTable(authToken: string, filterPost: FilterPayload): Observable<CorrispettiviListOverview>
  {
    const endpoint = environment.serverUrl + "tipologiaCorrispettivi/getTipologiaCorrispettiviDataTable";
    let my_headers = new HttpHeaders().set('Authorization', 'Bearer ' + authToken)
                      .append('Content-Type', 'application/json')
                      .append('Accept', 'application/json');

    return CustomHttpService.post(endpoint, filterPost, {headers: my_headers});
  }

  deleteCorrispettivo(authToken: string, idcorrispettivo: number, utenteUpdate: string)
  {
    const endpoint = environment.serverUrl + "tipologiaCorrispettivi/deleteTipologiaCorrispettivi";

    let my_headers = new HttpHeaders().set('Authorization', 'Bearer ' + authToken)
                      .append('Content-Type', 'application/json')
                      .append('Accept', 'application/json');

    let deleteReq = new DeleteRequest(idcorrispettivo, utenteUpdate);

    return CustomHttpService.post(endpoint, deleteReq, {headers: my_headers});
  }

  getcorrispettivoById(authToken: string, id_corrispettivo: number)
  {
    const endpoint = environment.serverUrl + "tipologiaCorrispettivi/getTipologiaCorrispettiviById";

    let my_headers = new HttpHeaders().set('Authorization', 'Bearer ' + authToken)
                      .append('Content-Type', 'application/json')
                      .append('Accept', 'application/json');

    return CustomHttpService.post(endpoint, id_corrispettivo, {headers: my_headers});
  }

  saveCorrispettivo(authToken: string, corrispettivo: Corrispettivi, utenteUpdate: string)
  {
    const endpoint = environment.serverUrl + "tipologiaCorrispettivi/saveTipologiaCorrispettivi";

    let my_headers = new HttpHeaders().set('Authorization', 'Bearer ' + authToken)
                      .append('Content-Type', 'application/json')
                      .append('Accept', 'application/json');

    let saveReq = new CorrispettivoSaveRequest(corrispettivo, utenteUpdate);

    return CustomHttpService.post(endpoint, saveReq, {headers: my_headers});
  }
  
}
