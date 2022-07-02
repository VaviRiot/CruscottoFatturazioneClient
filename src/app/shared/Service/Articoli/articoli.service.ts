import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Articoli } from 'app/models/Articoli';
import { FilterPayload } from 'app/models/FilterPayload';
import { ArticoloSaveRequest } from 'app/models/Request/ArticoloSaveRequest';
import { DeleteRequest } from 'app/models/Request/DeleteRequest';
import { ArticoliListOverview } from 'app/models/Response/ArticoliListOverview';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { CustomHttpService } from '../CustomHTTP/custom-http.service';

@Injectable({
  providedIn: 'root'
})
export class ArticoliService {

  constructor() { }


  getArticoliDataTable(authToken: string, filterPost: FilterPayload): Observable<ArticoliListOverview>
  {
    const endpoint = environment.serverUrl + "articolo/getArticoliDataTable";
    let my_headers = new HttpHeaders().set('Authorization', 'Bearer ' + authToken)
                      .append('Content-Type', 'application/json')
                      .append('Accept', 'application/json');

    return CustomHttpService.post(endpoint, filterPost, {headers: my_headers});
  }

  deleteArticolo(authToken: string, idArticolo: number, utenteUpdate: string)
  {
    const endpoint = environment.serverUrl + "articolo/deleteArticolo";

    let my_headers = new HttpHeaders().set('Authorization', 'Bearer ' + authToken)
                      .append('Content-Type', 'application/json')
                      .append('Accept', 'application/json');

    let deleteReq = new DeleteRequest(idArticolo, utenteUpdate);

    return CustomHttpService.post(endpoint, deleteReq, {headers: my_headers});
  }

  getArticoloById(authToken: string, id_articolo: number)
  {
    const endpoint = environment.serverUrl + "articolo/getArticoloById";

    let my_headers = new HttpHeaders().set('Authorization', 'Bearer ' + authToken)
                      .append('Content-Type', 'application/json')
                      .append('Accept', 'application/json');

    return CustomHttpService.post(endpoint, id_articolo, {headers: my_headers});
  }

  saveArticolo(authToken: string, articolo: Articoli, utenteUpdate: string)
  {
    const endpoint = environment.serverUrl + "articolo/saveArticolo";

    let my_headers = new HttpHeaders().set('Authorization', 'Bearer ' + authToken)
                      .append('Content-Type', 'application/json')
                      .append('Accept', 'application/json');

    let saveReq = new ArticoloSaveRequest(articolo, utenteUpdate);

    return CustomHttpService.post(endpoint, saveReq, {headers: my_headers});
  }

}
