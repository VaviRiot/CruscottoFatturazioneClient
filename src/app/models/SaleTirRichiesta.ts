import { RichiestaCliente } from "./RichiestaCliente";

export class SaleTirRichiesta {
    constructor(
        public salaId: number,
        public richiesta: RichiestaCliente,
        public codiceSala: string,
        public numeroMacchine: number,
        public createUserSala: string,
        public createDateSala: Date,
        public lastModUserSala: string,
        public lastModDateSala: Date,

        public tirId: number,
        public codiceTir: string,
        public createUserTir: string,
        public createDateTir: Date,
        public lastModUserTir: string,
        public lastModDateTir: Date

    ) { }
}