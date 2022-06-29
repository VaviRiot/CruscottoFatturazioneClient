import { UserRole } from "./UserRole";
import { WorkflowStep } from "./WorkflowStep";

export class WorkflowStepRole {
    constructor(
        public id: number,
        public ruoloWorkflowStep: UserRole,
        public workflowStepRuolo: WorkflowStep,
        public createUser: string,
        public createDate: Date,
        public lastModUser: string,
        public lastModDate: Date,
        public createDateString?: string,
        public lastModString?: string
    ) { }
}