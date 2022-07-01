export class ProspectGaranziaRequest {
    constructor(
        public idRichiesta: number,
        public searchFilter: string,
        public validate: boolean
    ) { }
}