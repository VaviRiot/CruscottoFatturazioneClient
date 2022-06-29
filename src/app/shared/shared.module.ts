import { NgModule } from "@angular/core";
import { CommonService } from "./Service/Common/common.service";

///Modulo condiviso, dal momento che l'applicazione utilizza i lazy modules, grazie a questo modulo condiviso innestato nell'app.module (modulo principale)
///Con il metodo forRoot() e l'innestamento dello stesso modulo condiviso nei moduli che ne hanno bisogno (es. admin module) senza necessità di forRoot()
///ora tutti i componenti dichiarati nei moduli dove è presente questo modulo condiviso, avranno accesso alla stessa istanza del commonservice
///qualora decidessero di iniettarlo tramite di nel costruttore

///NB => non funziona se si sceglie di iniettarlo tramite injector custom (ad es. nel base service)
@NgModule({})
export class SharedModule {
    static forRoot() {
        return {
            ngModule: SharedModule,
            providers: [CommonService]
        }
    }
}