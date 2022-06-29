export class ValutazioneStep2Request {
    constructor(
        public richiestaId: number,
        public nomeCliente: string,
        public codiceCliente: string,
        public workflowStepId: number,
        public statoId: number,
        public statoName: string,
        public business: string,
        public notaId: number,
        public noteValutazione: string,
        public destinatariAltraDoc: string,
        public oggettoAltraDoc: string,
        public testoAltraDoc: string,
        public ipAddress: string,
        public workUserId: number,
        public derogaMeritoId: number,
        public derogaMeritoName: string,
        public utenteUpdate: string
    ) { }
}