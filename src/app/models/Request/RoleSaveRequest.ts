import { UserRole } from "../UserRole";

export class RoleSaveRequest {
    constructor(
        public role: UserRole,
        public utenteUpdate: string
    ) { }
}