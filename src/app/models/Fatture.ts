export class Fattura {
    constructor(
        public id: number,
        public societa: string,
        public dataFattura: Date,
        public tipologiaFattura: string,
        public cliente: Cliente,
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



export class Cliente {
    constructor(
        public codiceCliente: string,
        public societa: string,
        public ragioneSociale: string,
        public codiceFiscale: string,
        public partitaIva: string,
        public nazionalita: any,
        public sedeLegale: string,
        public appartieneGruppoIva: string,
        public codiceDestinatarioFatturazione: string,
        public modalitaPagamento: string,
        public condizioniPagamento: string,
        public create_user: any,
        public create_date: any,
        public last_mod_user: any,
        public last_mod_date: any,
    ) { }
}

export class FatturaLog {
    constructor(
        public id: number,
        public idFattura: number,
        public statoFattura: string,
        public create_user: any,
        public create_date: any,
    ) { }
}
