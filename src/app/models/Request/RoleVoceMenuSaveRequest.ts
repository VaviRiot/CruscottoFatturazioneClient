import { RoleVoceMenu } from "../RoleVoceMenu";

export class RoleVoceMenuSaveRequest {
    constructor(
        public roleVoceMenu: RoleVoceMenu,
        public utenteUpdate: string
    ) { }
}