import { User } from "../User";

export class UserSaveRequest {
    constructor(
        public user: User,
        public utenteUpdate: string
    ) { }
}