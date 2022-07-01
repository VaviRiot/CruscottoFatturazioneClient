export class Workflow {
    constructor(
        public id: number,
        public nomeFlusso: string,
        public business: string,
        public createUser: string,
        public createDate: Date,
        public lastModUser: string,
        public lastModDate: Date
    ) { }
}