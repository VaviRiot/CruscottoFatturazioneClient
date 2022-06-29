import { ProspectGaranzia } from "../ProspectGaranzia";

export class ValutazioneStep5Request {
    constructor(
        public richiestaId: number,
        public nomeCliente: string,
        public codiceCliente: string,
        public workflowStepId: number,
        public statoId: number,
        public statoName: string,
        public business: string,
        public sideLetter: boolean,
        public deroga: boolean,
        public notaId: number,
        public noteDeroga: string,
        public ipAddress: string,
        public workUserId: number,
        public utenteUpdate: string,
        public listGaranzie?: Array<ProspectGaranzia>
    ) { }
}