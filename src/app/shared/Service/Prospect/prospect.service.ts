import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';
import { CustomHttpService } from 'app/shared/Service/CustomHTTP/custom-http.service';
import { ProspectDocUploadRequest } from 'app/models/Request/ProspectDocUploadRequest';
import { ProspectCompleteRequest } from 'app/models/Request/ProspectCompleteRequest';
import { ProspectDocumentRequest } from 'app/models/Request/ProspectDocumentRequest';
import { ProspectGaranziaRequest } from 'app/models/Request/ProspectGaranziaRequest';
import { ValutazioneStep1Request } from 'app/models/Request/ValutazioneStep1Request';
import { ValutazioneStep2Request } from 'app/models/Request/ValutazioneStep2Request';
import { ValutazioneStep4Request } from 'app/models/Request/ValutazioneStep4Request';
import { ValutazioneStep5Request } from 'app/models/Request/ValutazioneStep5Request';
import { Observable } from 'rxjs';
import { FilterPayload } from 'app/models/FilterPayload';
import { ProspectListOverview } from 'app/models/Response/ProspectListOverview';
import { ValidazioneStepResponse } from 'app/models/Response/ValidazioneStepResponse';
import { EmailMessage } from 'app/models/EmailMessage';
import { EmailMessageRequest } from 'app/models/Request/EmailMessageRequest';
import { RichiestaTimelineResponse } from 'app/models/Response/RichiestaTimelineResponse';
import { SaleTirListOverview } from 'app/models/Response/SaleTirListOverview';
import { WorkflowStep } from 'app/models/WorkflowStep';
import { ProspectAuthStepRequest } from 'app/models/Request/ProspectAuthStepRequest';
import { WorkflowStepRoleOverview } from 'app/models/Response/WorkflowStepRoleOverview';
import { WorkflowStepRole } from 'app/models/WorkflowStepRole';
import { WorkflowStepRoleSaveRequest } from 'app/models/Request/WorkflowStepRoleSaveRequest';
import { DeleteRequest, DeleteRequestCliente } from 'app/models/Request/DeleteRequest';
import { ScadenzeGiorniGaranzieListOverview } from 'app/models/Response/ScadenzeGiorniGaranzieListOverview';
import { ScadenzeGiorniGaranzie } from 'app/models/ScadenzeGiorniGaranzie';
import { ScadenzeGiorniGaranzieSaveRequest } from 'app/models/Request/ScadenzeGiorniGaranzieSaveRequest';
import { DxGridColumn } from 'app/models/DxGridColumn';
import { ExportGridRequest } from 'app/models/Request/ExportGridRequest';
import { CanaleGaranzia } from 'app/models/CanaleGaranzia';
import { PresaInCaricoRequest } from 'app/models/Request/PresaInCaricoRequest';
import { DerogaMeritoResponse } from 'app/models/Response/DerogaMeritoResponse';
import { ClienteSaveRequest } from 'app/models/Request/ClienteSaveRequest';
import { Cliente } from 'app/models/Fatture';

@Injectable({
  providedIn: 'root'
})
export class ProspectService {

  constructor() { }

  getCompleteProspectList(authToken: string): Observable<Cliente[]>
  {
    const endpoint = environment.serverUrl + "prospect/getCompleteProspectList";

    let headers = new HttpHeaders(
      {
        'Authorization': 'Bearer ' + authToken,
         'Content-Type': 'application/json'
      }
    );

    return CustomHttpService.get(endpoint, headers);
  }

  getProspectDataTable(authToken: string, filterPost: FilterPayload): Observable<ProspectListOverview>
  {
    const endpoint = environment.serverUrl + "prospect/getProspectDataTable";

    
    let my_headers = new HttpHeaders().set('Authorization', 'Bearer ' + authToken)
                      .append('Content-Type', 'application/json')
                      .append('Accept', 'application/json');

    return CustomHttpService.post(endpoint, filterPost, {headers: my_headers});
  }

  getClientiDataTable(authToken: string, filterPost: FilterPayload): Observable<ProspectListOverview>
  {
    const endpoint = environment.serverUrl + "cliente/getClientiDataTable";

    
    let my_headers = new HttpHeaders().set('Authorization', 'Bearer ' + authToken)
                      .append('Content-Type', 'application/json')
                      .append('Accept', 'application/json');

    return CustomHttpService.post(endpoint, filterPost, {headers: my_headers});
  }

  deleteCliente(authToken: string, idCliente: string, utenteUpdate: string)
  {
    const endpoint = environment.serverUrl + "cliente/deleteCliente";

    let my_headers = new HttpHeaders().set('Authorization', 'Bearer ' + authToken)
                      .append('Content-Type', 'application/json')
                      .append('Accept', 'application/json');

    let deleteReq = new DeleteRequestCliente(idCliente, utenteUpdate);

    return CustomHttpService.post(endpoint, deleteReq, {headers: my_headers});
  }

  saveCliente(authToken: string, cliente: Cliente, utenteUpdate: string)
  {
    const endpoint = environment.serverUrl + "cliente/saveCliente";

    let my_headers = new HttpHeaders().set('Authorization', 'Bearer ' + authToken)
                      .append('Content-Type', 'application/json')
                      .append('Accept', 'application/json');

    let saveReq = new ClienteSaveRequest(cliente, utenteUpdate);

    return CustomHttpService.post(endpoint, saveReq, {headers: my_headers});
  }


  updateCliente(authToken: string, cliente: Cliente, utenteUpdate: string)
  {
    const endpoint = environment.serverUrl + "cliente/updateCliente";

    let my_headers = new HttpHeaders().set('Authorization', 'Bearer ' + authToken)
                      .append('Content-Type', 'application/json')
                      .append('Accept', 'application/json');

    let saveReq = new ClienteSaveRequest(cliente, utenteUpdate);

    return CustomHttpService.put(endpoint, saveReq, {headers: my_headers});
  }




  // SALE TIR
  getSaleTirDataTable(authToken: string, filterPost: FilterPayload): Observable<SaleTirListOverview>
  {
    const endpoint = environment.serverUrl + "prospect/getSaleTirDataTableList";

    let my_headers = new HttpHeaders().set('Authorization', 'Bearer ' + authToken)
                      .append('Content-Type', 'application/json')
                      .append('Accept', 'application/json');

    return CustomHttpService.post(endpoint, filterPost, {headers: my_headers});
  }

  // WORKFLOW STEP ROLE
  getWorkflowStepRoleDataTable(authToken: string, filterPost: FilterPayload): Observable<WorkflowStepRoleOverview>
  {
    const endpoint = environment.serverUrl + "prospect/getWorkflowStepRoleDataTable";

    let my_headers = new HttpHeaders().set('Authorization', 'Bearer ' + authToken)
                      .append('Content-Type', 'application/json')
                      .append('Accept', 'application/json');

    return CustomHttpService.post(endpoint, filterPost, {headers: my_headers});
  }

  // SCADENZE GIORNI
  getScadenzeGiorniGaranzieDataTableList(authToken: string, filterPost: FilterPayload): Observable<ScadenzeGiorniGaranzieListOverview>
  {
    const endpoint = environment.serverUrl + "prospect/getScadenzeGiorniGaranzieDataTableList";

    let my_headers = new HttpHeaders().set('Authorization', 'Bearer ' + authToken)
                      .append('Content-Type', 'application/json')
                      .append('Accept', 'application/json');

    return CustomHttpService.post(endpoint, filterPost, {headers: my_headers});
  }

  getWorkflowStepRoleById(authToken: string, idWorkflowStepRole: number)
  {
    const endpoint = environment.serverUrl + "prospect/getWorkflowStepRoleById";

    let my_headers = new HttpHeaders().set('Authorization', 'Bearer ' + authToken)
                                      .append('Content-Type', 'application/json')
                                      .append('Accept', 'application/json');

    return CustomHttpService.post(endpoint, idWorkflowStepRole, {headers: my_headers});
  }

  saveWorkflowStepRole(authToken: string, workflowStepRole: WorkflowStepRole, utenteUpdate: string)
  {
    const endpoint = environment.serverUrl + "prospect/saveWorkflowStepRole";

    let my_headers = new HttpHeaders().set('Authorization', 'Bearer ' + authToken)
                      .append('Content-Type', 'application/json')
                      .append('Accept', 'application/json');

    let saveReq = new WorkflowStepRoleSaveRequest(workflowStepRole, utenteUpdate);

    return CustomHttpService.post(endpoint, saveReq, {headers: my_headers});
  }

  deleteWorkflowStepRole(authToken: string, idWorkflowStepRole: number, utenteUpdate: string)
  {
    const endpoint = environment.serverUrl + "prospect/deleteWorkflowStepRole";

    let my_headers = new HttpHeaders().set('Authorization', 'Bearer ' + authToken)
                      .append('Content-Type', 'application/json')
                      .append('Accept', 'application/json');

    let deleteReq = new DeleteRequest(idWorkflowStepRole, utenteUpdate);

    return CustomHttpService.post(endpoint, deleteReq, {headers: my_headers});
  }

  getProspectComplete(authToken: string, idRichiesta: number, codiceCliente: string, business: string)
  {
    const endpoint = environment.serverUrl + "prospect/getProspectComplete";

    let my_headers = new HttpHeaders().set('Authorization', 'Bearer ' + authToken)
                      .append('Content-Type', 'application/json')
                      .append('Accept', 'application/json');

    let prospectReq = new ProspectCompleteRequest(idRichiesta, codiceCliente, business);

    return CustomHttpService.post(endpoint, prospectReq, {headers: my_headers});
  }

  getProspectDocumentList(authToken: string, idRichiesta: number, searchFilter: string)
  {
    const endpoint = environment.serverUrl + "prospect/getProspectDocumentList";

    let my_headers = new HttpHeaders().set('Authorization', 'Bearer ' + authToken)
                      .append('Content-Type', 'application/json')
                      .append('Accept', 'application/json');

    let prospectReq = new ProspectDocumentRequest(idRichiesta, searchFilter);

    return CustomHttpService.post(endpoint, prospectReq, {headers: my_headers});
  }

  getProspectDocumentListByType(authToken: string, idRichiesta: number, searchType: string)
  {
    const endpoint = environment.serverUrl + "prospect/getProspectDocumentListByType";

    let my_headers = new HttpHeaders().set('Authorization', 'Bearer ' + authToken)
                      .append('Content-Type', 'application/json')
                      .append('Accept', 'application/json');

    let prospectReq = new ProspectDocumentRequest(idRichiesta, searchType);

    return CustomHttpService.post(endpoint, prospectReq, {headers: my_headers});
  }

  getProspectGaranzieList(authToken: string, idRichiesta: number, searchFilter: string, validate: boolean)
  {
    const endpoint = environment.serverUrl + "prospect/getProspectGaranzieList";

    let my_headers = new HttpHeaders().set('Authorization', 'Bearer ' + authToken)
                      .append('Content-Type', 'application/json')
                      .append('Accept', 'application/json');

    let prospectReq = new ProspectGaranziaRequest(idRichiesta, searchFilter, validate);

    return CustomHttpService.post(endpoint, prospectReq, {headers: my_headers});
  }

  getTipologieDocumentiList(authToken: string)
  {
    const endpoint = environment.serverUrl + "prospect/getTipologieDocumentiList";

    let headers = new HttpHeaders(
      {
        'Authorization': 'Bearer ' + authToken,
         'Content-Type': 'application/json'
      }
    );

    return CustomHttpService.get(endpoint, headers);
  }

  getUploadDocumentData(authToken: string, documentId: number)
  {
    const endpoint = environment.serverUrl + "prospect/getUploadDocumentData";

    let my_headers = new HttpHeaders().set('Authorization', 'Bearer ' + authToken)
                      .append('Content-Type', 'application/json')
                      .append('Accept', 'application/json');

    return CustomHttpService.post(endpoint, documentId, {headers: my_headers});
  }

  saveProspectDocument(authToken: string, prospectDocRequest: ProspectDocUploadRequest)
  {
    const endpoint = environment.serverUrl + "prospect/saveProspectDocument";

    let my_headers = new HttpHeaders().set('Authorization', 'Bearer ' + authToken)
                      .append('Content-Type', 'application/json')
                      .append('Accept', 'application/json');

    return CustomHttpService.post(endpoint, prospectDocRequest, {headers: my_headers});
  }

  exportAllProspect(authToken: string, listColumn: Array<DxGridColumn>, filterPost: FilterPayload)
  {
    const endpoint = environment.serverUrl + "prospect/exportAllProspect";

    let my_headers = new HttpHeaders().set('Authorization', 'Bearer ' + authToken)
                      .append('Content-Type', 'application/json')
                      .append('Accept', 'application/json');

    let exportReq = new ExportGridRequest(listColumn, filterPost);                      

    return CustomHttpService.post(endpoint, exportReq, {headers: my_headers});
  }

  export(authToken: string, listColumn: Array<DxGridColumn>, filterPost: FilterPayload): Observable<ArrayBuffer>
  {
    const endpoint = environment.serverUrl + "prospect/exportAllProspect";

    let my_headers = new HttpHeaders().set('Authorization', 'Bearer ' + authToken)
                      .append('Content-Type', 'application/json')
                      .append('Accept', 'application/json');

    let exportReq = new ExportGridRequest(listColumn, filterPost);                      

    return CustomHttpService.blobWitHeaders(endpoint, exportReq, {headers: my_headers});
  }

  // VALUTAZIONE

  getTipologieCategorieRichiesteList(authToken: string)
  {
    const endpoint = environment.serverUrl + "prospect/getCategorieRichiesteList";

    let headers = new HttpHeaders(
      {
        'Authorization': 'Bearer ' + authToken,
         'Content-Type': 'application/json'
      }
    );

    return CustomHttpService.get(endpoint, headers);
  }

  getStatiValutazioneList(authToken: string)
  {
    const endpoint = environment.serverUrl + "prospect/getStatiValutazioneList";

    let headers = new HttpHeaders(
      {
        'Authorization': 'Bearer ' + authToken,
         'Content-Type': 'application/json'
      }
    );

    return CustomHttpService.get(endpoint, headers);
  }

  getStatiGaranzieList(authToken: string)
  {
    const endpoint = environment.serverUrl + "prospect/getStatiGaranzieList";

    let headers = new HttpHeaders(
      {
        'Authorization': 'Bearer ' + authToken,
         'Content-Type': 'application/json'
      }
    );

    return CustomHttpService.get(endpoint, headers);
  }

  // PRESA IN CARICO
  savePresaInCarico(authToken: string, presaInCaricoRequest: PresaInCaricoRequest): Observable<Date>
  {
    const endpoint = environment.serverUrl + "prospect/savePresaInCarico";

    let my_headers = new HttpHeaders().set('Authorization', 'Bearer ' + authToken)
                      .append('Content-Type', 'application/json')
                      .append('Accept', 'application/json');

    return CustomHttpService.post(endpoint, presaInCaricoRequest, {headers: my_headers});
  }

  // STEP 1
  saveValutazioneStep1(authToken: string, valutazioneStepRequest: ValutazioneStep1Request): Observable<ValidazioneStepResponse>
  {
    const endpoint = environment.serverUrl + "prospect/saveValutazioneStep1";

    let my_headers = new HttpHeaders().set('Authorization', 'Bearer ' + authToken)
                      .append('Content-Type', 'application/json')
                      .append('Accept', 'application/json');

    return CustomHttpService.post(endpoint, valutazioneStepRequest, {headers: my_headers});
  }

  // STEP 2
  saveDerogaMerito(authToken: string, prospectDocRequest: ProspectDocUploadRequest): Observable<DerogaMeritoResponse>
  {
    const endpoint = environment.serverUrl + "prospect/saveDerogaMerito";

    let my_headers = new HttpHeaders().set('Authorization', 'Bearer ' + authToken)
                      .append('Content-Type', 'application/json')
                      .append('Accept', 'application/json');

    return CustomHttpService.post(endpoint, prospectDocRequest, {headers: my_headers});
  }

  saveValutazioneStep2(authToken: string, valutazioneStepRequest: ValutazioneStep2Request): Observable<ValidazioneStepResponse>
  {
    const endpoint = environment.serverUrl + "prospect/saveValutazioneStep2";

    let my_headers = new HttpHeaders().set('Authorization', 'Bearer ' + authToken)
                      .append('Content-Type', 'application/json')
                      .append('Accept', 'application/json');

    return CustomHttpService.post(endpoint, valutazioneStepRequest, {headers: my_headers});
  }

  // STEP 3
  saveDerogaContratto(authToken: string, prospectDocRequest: ProspectDocUploadRequest): Observable<ValidazioneStepResponse>
  {
    const endpoint = environment.serverUrl + "prospect/saveDerogaContratto";

    let my_headers = new HttpHeaders().set('Authorization', 'Bearer ' + authToken)
                      .append('Content-Type', 'application/json')
                      .append('Accept', 'application/json');

    return CustomHttpService.post(endpoint, prospectDocRequest, {headers: my_headers});
  }

  saveValutazioneStep3(authToken: string, prospectDocRequest: ProspectDocUploadRequest): Observable<ValidazioneStepResponse>
  {
    const endpoint = environment.serverUrl + "prospect/saveValutazioneStep3";

    let my_headers = new HttpHeaders().set('Authorization', 'Bearer ' + authToken)
                      .append('Content-Type', 'application/json')
                      .append('Accept', 'application/json');

    return CustomHttpService.post(endpoint, prospectDocRequest, {headers: my_headers});
  }

  // STEP 4
  saveValutazioneStep4(authToken: string, valutazioneStepRequest: ValutazioneStep4Request): Observable<ValidazioneStepResponse>
  {
    const endpoint = environment.serverUrl + "prospect/saveValutazioneStep4";

    let my_headers = new HttpHeaders().set('Authorization', 'Bearer ' + authToken)
                      .append('Content-Type', 'application/json')
                      .append('Accept', 'application/json');

    return CustomHttpService.post(endpoint, valutazioneStepRequest, {headers: my_headers});
  }

  // STEP 5
  saveValutazioneStep5(authToken: string, valutazioneStepRequest: ValutazioneStep5Request): Observable<ValidazioneStepResponse>
  {
    const endpoint = environment.serverUrl + "prospect/saveValutazioneStep5";

    let my_headers = new HttpHeaders().set('Authorization', 'Bearer ' + authToken)
                      .append('Content-Type', 'application/json')
                      .append('Accept', 'application/json');

    return CustomHttpService.post(endpoint, valutazioneStepRequest, {headers: my_headers});
  }

  // EMAIL MESSAGE
  getEmailByRichiestaId(authToken: string, emailMessage: EmailMessageRequest): Observable<EmailMessage>
  {
    const endpoint = environment.serverUrl + "prospect/getEmailByRichiestaId";

    let my_headers = new HttpHeaders().set('Authorization', 'Bearer ' + authToken)
                      .append('Content-Type', 'application/json')
                      .append('Accept', 'application/json');

    return CustomHttpService.post(endpoint, emailMessage, {headers: my_headers});
  }

  // TIMELINE
  getTimelineByRichiestaId(authToken: string, richiestaId: number): Observable<Array<RichiestaTimelineResponse>>
  {
    const endpoint = environment.serverUrl + "prospect/getTimelineByRichiestaId";

    let my_headers = new HttpHeaders().set('Authorization', 'Bearer ' + authToken)
                      .append('Content-Type', 'application/json')
                      .append('Accept', 'application/json');

    return CustomHttpService.post(endpoint, richiestaId, {headers: my_headers});
  }

  // WORKFLOW STEP

  getWorkflowStepList(authToken: string): Observable<Array<WorkflowStep>>
  {
    const endpoint = environment.serverUrl + "prospect/getWorkflowStepList";

    let headers = new HttpHeaders(
      {
        'Authorization': 'Bearer ' + authToken,
         'Content-Type': 'application/json'
      }
    );

    return CustomHttpService.get(endpoint, headers);
  }

  getAuthWorkflowStepList(authToken: string, authRequest: ProspectAuthStepRequest): Observable<Array<WorkflowStep>>
  {
    const endpoint = environment.serverUrl + "prospect/getActiveWorkflowStepByRole";

    let my_headers = new HttpHeaders().set('Authorization', 'Bearer ' + authToken)
                      .append('Content-Type', 'application/json')
                      .append('Accept', 'application/json');

    return CustomHttpService.post(endpoint, authRequest, {headers: my_headers});
  }

  // SCADENZA GIORNI GARANZIE
  getScadenzeGiorniGaranzieById(authToken: string, idScadenzeGiorniGaranzie: number): Observable<ScadenzeGiorniGaranzie>
  {
    const endpoint = environment.serverUrl + "prospect/getScadenzeGiorniGaranzieById";

    let my_headers = new HttpHeaders().set('Authorization', 'Bearer ' + authToken)
                      .append('Content-Type', 'application/json')
                      .append('Accept', 'application/json');

    return CustomHttpService.post(endpoint, idScadenzeGiorniGaranzie, {headers: my_headers});
  }

  deleteScadenzeGiorniGaranzie(authToken: string, idScadenzeGiorniGaranzie: number, utenteUpdate: string)
  {
    const endpoint = environment.serverUrl + "prospect/deleteScadenzeGiorniGaranzie";

    let my_headers = new HttpHeaders().set('Authorization', 'Bearer ' + authToken)
                      .append('Content-Type', 'application/json')
                      .append('Accept', 'application/json');

    let deleteReq = new DeleteRequest(idScadenzeGiorniGaranzie, utenteUpdate);

    return CustomHttpService.post(endpoint, deleteReq, {headers: my_headers});
  }

  saveScadenzeGiorniGaranzie(authToken: string, scadenzeGiorniGaranzie: ScadenzeGiorniGaranzie, utenteUpdate: string)
  {
    const endpoint = environment.serverUrl + "prospect/saveScadenzeGiorniGaranzie";

    let my_headers = new HttpHeaders().set('Authorization', 'Bearer ' + authToken)
                      .append('Content-Type', 'application/json')
                      .append('Accept', 'application/json');

    let saveReq = new ScadenzeGiorniGaranzieSaveRequest(scadenzeGiorniGaranzie, utenteUpdate);

    return CustomHttpService.post(endpoint, saveReq, {headers: my_headers});
  }

  // CANALI
  getCanaliGaranziaList(authToken: string): Observable<Array<CanaleGaranzia>>
  {
    const endpoint = environment.serverUrl + "prospect/getCanaliGaranziaList";

    let headers = new HttpHeaders(
      {
        'Authorization': 'Bearer ' + authToken,
          'Content-Type': 'application/json'
      }
    );

    return CustomHttpService.get(endpoint, headers);
  }

  // Autorizzazione Deroga Valutazione Merito
  getAvaiableRolesDerogaMerito(authToken: string): Observable<Array<number>>
  {
    const endpoint = environment.serverUrl + "prospect/getAvaiableRolesDerogaMerito";

    let headers = new HttpHeaders(
      {
        'Authorization': 'Bearer ' + authToken,
          'Content-Type': 'application/json'
      }
    );

    return CustomHttpService.get(endpoint, headers);
  }

  
  getDerogaMeritoByRichiestaId(authToken: string, idRichiesta: number): Observable<DerogaMeritoResponse>
  {
    const endpoint = environment.serverUrl + "prospect/getDerogaMeritoByRichiestaId";

    let my_headers = new HttpHeaders().set('Authorization', 'Bearer ' + authToken)
                      .append('Content-Type', 'application/json')
                      .append('Accept', 'application/json');

    return CustomHttpService.post(endpoint, idRichiesta, {headers: my_headers});
  }

}
