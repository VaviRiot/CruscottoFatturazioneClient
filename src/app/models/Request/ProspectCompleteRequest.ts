export class ProspectCompleteRequest {
    constructor(
        public idRichiesta: number,
        public codiceCliente: string,
        public business: string
    ) { }
}