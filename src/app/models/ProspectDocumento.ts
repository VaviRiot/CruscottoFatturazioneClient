export class ProspectDocumento {
    constructor(

        public documentId?: number,        
        public richiestaId?: number,

        public tipoDocumentoId?: number,
        public tipoDocumento?: string,
        public docName?: string,
        public docPath?: number,
        
        public docBlob?: string,
        public lastModeUser?: string,
        public lastModeDate?: Date,
        public isEdit?: boolean

    ) { }
}