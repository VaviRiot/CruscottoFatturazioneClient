import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { InternalMessage } from "app/models/InternalMessage";
import { Subject, Observable, from } from "rxjs";

@Injectable({ providedIn: 'root' })
export class CommonService {
    private subjectName = new Subject<any>();

    constructor(private http: HttpClient,
                private router: Router) {
    }

    sendUpdate(command: string, message?: string) {
        let in_message: string = "";
        if(message)
        {
            in_message = message;
        }
        let sendMessage = new InternalMessage(command,in_message);
        //console.log(JSON.stringify(sendMessage));
        this.subjectName.next({ text: JSON.stringify(sendMessage) }); 
    }

    redirectToUrl(urlToOpen: string)
    {
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload';
      this.router.navigate(['/' + urlToOpen]);
    }

    getUpdate(): Observable<any> {
        return this.subjectName.asObservable();
    }

    getActualUrl()
    {
      return this.router.url;
    }

    convertBase64ToBlobData(base64Data: string, contentType: string = 'image/png', sliceSize = 512) {
      const byteCharacters = atob(base64Data);
      const byteArrays = [];
  
      for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);
  
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
  
        const byteArray = new Uint8Array(byteNumbers);
  
        byteArrays.push(byteArray);
      }
  
      const blob = new Blob(byteArrays, { type: contentType });
      return blob;
    }

    public getIPAddress()
    {  
      return this.http.get("http://api.ipify.org/?format=json");  
    } 
}
