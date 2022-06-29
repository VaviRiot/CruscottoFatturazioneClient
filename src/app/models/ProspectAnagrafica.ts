export class ProspectAnagrafica {
    constructor(

        public cliente?: string,
        public nome?: string,
        public business?: string,
        public legalMail?: string,

        public codiceSAP?: string,
        public descrizioneSocieta?: string,

        public idTipologiaPartner?: number,
        public tipologiaPartner?: string,

        public codiceSala?: string,
        public codiceTir?: string,
        public numeroMacchineSala?: number,

        public totNumeroSale?: number,
        public totNumeroTir?: number,
        public totNumeroMacchine?: number,

        public referenteArea?: string,
        public mailReferente?: string,
        public indirizzo?: string,
        public telefonoReferente?: string,
        public codiceFiscaleReferente?: string,
        public partitaIva?: string
    ) { }
}