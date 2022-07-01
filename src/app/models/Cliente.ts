export class Cliente {
    constructor(
        public id?: number,
        public codiceCliente?: string,
        public nomeCliente?: string,
        public business?: string,
        public workflowStepId?: string,
        public nomeStep?: string,
        public sommaGaranzie?: number,
        public lastMod?: Date,
        public workUserId?: number,
        public lastModString?:string //Campo di appoggio
    ) { }
}


export class Fatture {
    constructor(
        public idFattura?: number,
        public codiceCliente?: string,
        public nomeCliente?: string,
        public piva?: string,
        public status?: string,
        public importo?: number,
    ) { }
}
