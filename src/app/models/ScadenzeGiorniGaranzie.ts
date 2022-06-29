
export class ScadenzeGiorniGaranzie {
    constructor(
        public id: number,
        public tipologia: string,
        public giorni: number,
        public createUser: string,
        public createDate: Date,
        public lastModUser: string,
        public lastModDate: Date,
        public createDateString?: string,
        public lastModString?: string

    ) { }
}