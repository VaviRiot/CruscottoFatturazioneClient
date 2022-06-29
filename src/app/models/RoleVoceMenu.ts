import { UserRole } from "./UserRole";
import { VoceMenu } from "./VoceMenu";

export class RoleVoceMenu {
    constructor(
        public id: number,
        public ruoloVoceMenu: UserRole,
        public voceMenuRuolo: VoceMenu,
        public createUser: string,
        public createDate: Date,
        public lastModUser: string,
        public lastModDate: Date,
        public createDateString?: string,
        public lastModString?: string
    ) { }
}