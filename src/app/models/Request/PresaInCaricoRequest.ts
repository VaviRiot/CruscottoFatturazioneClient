export class PresaInCaricoRequest {
    constructor(
        public richiestaId: number,
        public idUtente: number,
        public utenteUpdate: string
    ) { }
}