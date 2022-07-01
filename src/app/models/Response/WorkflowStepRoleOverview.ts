import { WorkflowStepRole } from "../WorkflowStepRole";

export class WorkflowStepRoleOverview {
    constructor(
        public totalCount: number,
        public lines: Array<WorkflowStepRole>
    ) { }
}