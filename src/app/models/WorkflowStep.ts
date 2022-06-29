import { Workflow } from "./Workflow";

export class WorkflowStep {
    constructor(
        public id: number,
        public nomeStep: string,
        public tabIndex: number,
        public attivato: boolean,
        public notifica: boolean,
        public definitivo: boolean,
        public createUser: string,
        public createDate: Date,
        public lastModUser: string,
        public lastModDate: Date,

        public workflow?: Workflow
    ) { }
}