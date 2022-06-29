export class DashboardTopSummary {
    constructor(
        public fattureEmesse?: number,
        public dataFattureEmesse?: Date,
        public fattureConvalidate?: number,
        public dataFattureConvalidate?: Date,
        public fattureRifiutate?: number,
        public importoFattureRifiutate?: number,
        public totaleImportoFatture?: number,
        public dataImportoFatture?: Date,
    ) { }
}