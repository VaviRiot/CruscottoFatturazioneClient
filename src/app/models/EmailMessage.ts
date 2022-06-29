import { FileServerData } from "./FileServerData";

export class EmailMessage {
    constructor(

        public mittente?: string,
        public destinatari?: string,
        public oggetto?: string,
        public testo?: string,
        public dataInvio?: Date,
        public allegati?: Array<FileServerData>
    ) { }
}