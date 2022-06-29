export class CategoriaRichieste {
    constructor(
        public id: number,
        public nome: string,
        public create_user: string,
        public create_date: Date,
        public last_mod_user: string,
        public last_mod_date: Date
    ) { }
}