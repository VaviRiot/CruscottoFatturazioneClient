export class ProspectGaranziaStato {
    constructor(

        public id?: number,        
        public descrizione?: string,

        public percentuale?: number,
        public codice_soap?: string,
        public deroga?: boolean,

        public create_user?: string,
        public create_date?: Date,
        public last_mod_user?: string,
        public last_mod_date?: Date
    ) { }
}