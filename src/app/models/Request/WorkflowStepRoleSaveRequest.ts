import { WorkflowStepRole } from "../WorkflowStepRole";

export class WorkflowStepRoleSaveRequest {
    constructor(
        public workflowStepRole: WorkflowStepRole,
        public utenteUpdate: string
    ) { }
}