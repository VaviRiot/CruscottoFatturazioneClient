export class EmailMessageRequest {
    constructor(
        public richiestaId: number,
        public business: string,
        public tipoRegistroEmail: string
    ) { }
}