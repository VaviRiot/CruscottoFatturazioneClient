export class Corrispettivi {
    constructor(
        public id: any,
        public codiceCorrispettivo: string,
        public descrizione: string,
        public dataValidita: Date,
        public create_user: string,
        public create_date: Date,
        public status?: string,
        public last_mod_user?: any,
        public last_mod_date?: any,
    ) { }
}