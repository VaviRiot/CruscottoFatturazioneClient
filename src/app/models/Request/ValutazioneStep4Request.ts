export class ValutazioneStep4Request {
    constructor(
        public richiestaId: number,
        public nomeCliente: string,
        public codiceCliente: string,
        public workflowStepId: number,
        public business: string,
        public idCanaleGaranzia: number,
        public emailProspect: string,
        public tipoRegistroEmail: string,
        public ipAddress: string,
        public workUserId: number,
        public utenteUpdate: string
    ) { }
}