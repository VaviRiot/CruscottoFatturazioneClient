export class ProspectDocUploadRequest {

    constructor(
                public documentId: number,
                public fileDescription: string,
                public fileName: string,
                public idRichiesta: number,
                public idTipoDocumento: number,
                public tipoDocumento: string,
                public user: string,
                public bytes: string,
                public type: string,
                public ext: string,
                public nomeCliente?: string,
                public codiceCliente?: string,
                public workflowStepId?: number,
                public businessName?: string,
                public emailProspect?: string,
                public idCanaleGaranzia?: number,
                public tipoRegistroEmail?: string,
                public ipAddress?: string,
                public workUserId?: number,
                public statoId?: number,
                public statoName?: string,
                public notaId?: number,
                public notaValutazione?: string
            )
    {
    }
}