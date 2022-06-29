export class NotaRichieste {
    constructor(
        public id: number,
        public workflow_step_id: number,
        public workflow_step_index: number,
        public note: string,
        public create_user: string,
        public create_date: Date,
        public last_mod_user: string,
        public last_mod_date: Date
    ) { }
}