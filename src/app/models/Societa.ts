export class Societa {
    constructor(
        public id: number,
        public codiceSocieta: string,
        public descrizione: string,
        public createDate: Date,
        public createUser: string,
        public lastModUser: string,
        public lastModDate: Date
    ) { }
}