export class ValutazioneStep1Request {
    constructor(
        public richiestaId: number,
        public nomeCliente: string,
        public codiceCliente: string,
        public workflowStepId: number,
        public business: string,
        public presenzaSocietaCollegate: boolean,
        public societaCollegate: string,
        public presenzaUltimoBilancio: boolean,
        public annoBilancio: number,
        public presenzaEventiNegativi: boolean,
        public eventiNegativi: string,
        public presenzaEsitiPregressi: boolean,
        public categoriaId: number,
        public ipAddress: string,
        public workUserId: number,
        public utenteUpdate: string
    ) { }
}