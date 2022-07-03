export class Fattura {
    constructor(
        public id: number,
        public societa: string,
        public dataFattura: Date,
        public tipologiaFattura: string,
        public codiceCliente: string,
        public importo: any,
        public statoFattura: string,
        public esitoInvio: null,
        public dataInvioFlusso: null,
        public create_user: string,
        public create_date: Date,
        public last_mod_user: string,
        public last_mod_date: Date,
        public listaDettaglioFattura?: ListaDettaglioFattura[],
    ) { }
}



export class ListaDettaglioFattura {
    constructor(
        public id: number,
        public idFattura: number,
        public progressivoRiga: number,
        public codiceArticolo: string,
        public codiceCorrispettivo: string,
        public importo: number,
        public note: string,
        public idMessaggio: null,
        public descrizioneMessaggio: null,
        public create_user: string,
        public create_date: Date,
        public last_mod_user: string,
        public last_mod_date: Date,
    ) { }
}

