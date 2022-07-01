export class VoceMenu {
    constructor(
        public id: number,
        public path: string,
        public title: string,
        public icon: string,
        public orderNumber: number,
        public cssClass: string,
        public identifier: string,
        public isDettaglio: boolean,
        public createUser: string,
        public createDate: Date,
        public lastModUser: string,
        public lastModDate: Date,
        public child?: Array<VoceMenu>,
        public lastModString?: string
    ) { }
}