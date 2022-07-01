export class UserRole {
    constructor(
        public id: number,
        public name: string,
        public description: string,
        public isAdmin: boolean,
        public email: string,
        public createUser: string,
        public createDate: Date,
        public lastModUser: string,
        public lastModDate: Date,
        public lastModString?: string
    ) { }
}