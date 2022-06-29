export class StatoInsoluti {
    constructor(
        public id: number,
        public nome: string,
        public indice: number,
        public createUser: string,
        public createDate: Date,
        public lastModUser: string,
        public lastModDate: Date
    ) { }
}