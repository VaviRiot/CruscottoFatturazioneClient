export class Articoli {
    constructor(
        public id: any,
        public codiceArticolo: string,
        public descrizione: string,
        public dataValidita: Date,
        public create_user: string,
        public create_date: Date,
        public status?: string,
        public last_mod_user?: any,
        public last_mod_date?: any,
    ) { }
}