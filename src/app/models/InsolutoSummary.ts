import { RichiestaCliente } from "./RichiestaCliente";
import { StatoInsoluti } from "./StatoInsoluti";

export class InsolutoSummary {
    constructor(
        public id: number,

        public richiesta: RichiestaCliente,	
        public statoInsoluto: StatoInsoluti,

        public codiceCliente: string,
        public nomeCliente: string,
        public business: string,

	
	    public corrente: number,
	    public scaduto: number,
	    public esposizione: number,
	
	    public dataRiferimento: Date,
	    public scadenzaRendimento: Date,
	
	    public createUser: string,
	    public createDate: Date,
	    public lastModUser: string,
	    public lastModDate: Date,
        public lastModString?: string,
        public dataRiferimentoString?: string,
        public scadenzaRendimentoString?: string
    ) { }
}