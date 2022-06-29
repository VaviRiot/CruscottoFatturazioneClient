export class ProspectGaranzia {
    constructor(

        public idGaranzia?: number,        
        public idRichiesta?: number,

        public codice?: string,
        public idStato?: number,
        public nomeStato?: string,
        public percStato?: number,

        public descrizione?: string,
        public tipologia?: string,
        public ente?: string,
        public data?: Date,

        public dovuto?: number,
        public prestato?: number,

        public deroga?: boolean,
        public noteDeroga?: string,
        
        public protocollo?: string,
        public diritto?: string,

        public dataScadenza?: Date
    ) { }
}