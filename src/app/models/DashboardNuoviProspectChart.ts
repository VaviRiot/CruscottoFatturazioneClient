export class DashboardNuoviProspectChart {
    constructor(
        public id?: number,
        public anno?: number,
        public settimana?: number,
        public lunedi?: number,
        public martedi?: number,
        public mercoledi?: number,
        public giovedi?: number,
        public venerdi?: number,
        public sabato?: number,
        public domenica?: number,
        public totale?: number,
        public aumento?: number,
        public maxValue?: number,
        public createUser?: string,
        public createDate?: Date,
        public lastModUser?: string,
        public lastModDate?: Date
    ) { }
}