import { RoleVoceMenu } from "../RoleVoceMenu";

export class RoleVoceMenuOverview {
    constructor(
        public totalCount: number,
        public lines: Array<RoleVoceMenu>
    ) { }
}