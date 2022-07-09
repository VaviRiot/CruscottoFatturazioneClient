export class DeleteRequest {
    constructor(
        public idEntity: number,
        public utenteUpdate: string
    ) { }
}
export class DeleteRequestCliente {
    constructor(
        public codiceCliente: string,
        public utenteUpdate: string
    ) { }
}