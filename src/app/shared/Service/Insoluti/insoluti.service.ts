import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';
import { CustomHttpService } from 'app/shared/Service/CustomHTTP/custom-http.service';
import { Observable } from 'rxjs';
import { FilterPayload } from 'app/models/FilterPayload';
import { InsolutiSummaryOverview } from 'app/models/Response/InsolutiSummaryOverview';

@Injectable({
  providedIn: 'root'
})
export class InsolutiService {

  constructor() { }

  getInsolutiSummaryDataTable(authToken: string, filterPost: FilterPayload): Observable<InsolutiSummaryOverview>
  {
    const endpoint = environment.serverUrl + "insoluti/getInsolutiSummaryDataTable";

    let my_headers = new HttpHeaders().set('Authorization', 'Bearer ' + authToken)
                      .append('Content-Type', 'application/json')
                      .append('Accept', 'application/json');

    return CustomHttpService.post(endpoint, filterPost, {headers: my_headers});
  }
}
