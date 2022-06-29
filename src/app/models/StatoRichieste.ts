export class StatoRichieste {
    constructor(
        public id: number,
        public nome: string,
        public definitivo: boolean,
        public createUser: string,
        public createDate: Date,
        public lastModUser: string,
        public lastModDate: Date
    ) { }
}