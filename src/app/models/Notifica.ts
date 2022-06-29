import { GruppoUtenti } from "./GruppoUtenti";
import { NotificaTipologia } from "./NotificaTipologia";
import { User } from "./User";
import { WorkflowStep } from "./WorkflowStep";

export class Notifica {
    constructor(
        public id: number,
        public nome: string,
        public messaggioNotifica: string,
        public oggettoEmail: string,
        public testoEmail: string,
        public urlToOpen: string,
        public createUser: string,
        public createDate: Date,
        public lastModUser: string,
        public lastModDate: Date,
        public workflowStepNotifiche: WorkflowStep,
        public tipologiaNotifica: NotificaTipologia,
        public utentiNotifica: Array<User>,
        public gruppiNotifica: Array<GruppoUtenti>,
        public lastModString?: string,
        public esitoId?: number,
    ) { }
}