export class ProspectTopSummary {
    constructor(
        public richiestaId?: number,
        
        public numGaranziePrestate?: number,
        public totaleGaranziePrestate?: number,

        public numGaranzieScadenze?: number,
        public totaleGaranzieScadenze?: number,

        public numGaranzieDeroga?: number,
        public totaleGaranzieDeroga?: number,

        public numPrestatoDovuto?: number,
        public totalePrestatoDovuto?: number
    ) { }
}