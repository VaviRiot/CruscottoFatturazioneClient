import { UserRole } from "./UserRole";
import { VoceMenu } from "./VoceMenu";

export class User {
    constructor(
        public id?: number,
        public ruoloUtente?: UserRole,
        public name?: string,
        public email?: string,
        public username?: string,
        public password?: string,
        public token?: string,
        public isNew?: boolean,
        public createUser?: string,
        public createDate?: Date,
        public lastModUser?: string,
        public lastModDate?: Date,
        public validFrom?: Date,
        public societa?: String,
        public validTo?: Date,
        public avaiableBusiness?: Array<string>,
        public vociUtente?: Array<VoceMenu>,
        public status?:string, //Campo di appoggio
        public lastModString?:string //Campo di appoggio
    ) { }
}