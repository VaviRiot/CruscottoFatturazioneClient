import { WorkflowStep } from "./WorkflowStep";
import { StatoRichieste } from "./StatoRichieste";
import { CategoriaRichieste } from "./CategoriaRichieste";
import { NotaRichieste } from "./NotaRichieste";
import { ProspectGaranzia } from "./ProspectGaranzia";

export class RichiestaCliente {
    constructor(
        public id: number,
        public clienteId: number,
        public codiceSala: string,
        public codiceTir: string,
        public dataAttivazione: Date,
        public presenzaSocietaCollegate: boolean,
        public societaCollegate: string,
        public presenzaUltimoBilancio: boolean,
        public annoBilancio: number,
        public presenzaEventiNegativi: boolean,
        public presenzaEsitiPregressi: boolean,
        public sideLetter: boolean,

        public canaleContrattoId: number,
        public canaleSottoscrizioneId: number,
        public derogaContrattoId: number,

        public derogaMeritoUser: string,
        public derogaMeritoDate: Date,
        public derogaMeritoId: number,
        public derogaMeritoNotaId: number,

        public salvata: boolean,
        public eventiNegativi: string,

        public workUserId: number,
        public workUser: string,
        public workDate: Date,
        
        public createUser: string,
        public createDate: Date,
        public lastModUser: string,
        public lastModDate: Date,

        public workflowStep?: WorkflowStep,
        public statoRichieste?: StatoRichieste,
        public statoSapRichieste?: StatoRichieste,
        public categoriaRichieste?: CategoriaRichieste,
        public noteRichiesta?: Array<NotaRichieste>,

        public listGaranzieValutazione?: Array<ProspectGaranzia>
    ) { }
}