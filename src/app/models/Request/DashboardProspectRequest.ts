export class DashboardProspectRequest {
    constructor(
        public idRole: number,
        public isAdmin: boolean,
        public adminView: boolean,
        public selectedBusiness: Array<string>
    ) { }
}