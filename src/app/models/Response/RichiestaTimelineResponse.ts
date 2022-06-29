import { FileServerData } from "../FileServerData";
import { RichiestaCliente } from "../RichiestaCliente";

export class RichiestaTimelineResponse {
    constructor(
        public id: number,
        public titolo: string,
        public messaggio: string,
        public icon: string,
        public colorClass: string,
        public createUser?: string,
        public createDate?: Date,
        public lastModUser?: string,
        public lastModDate?: Date,
        public ipAddress?: string,
        public richiesta?: RichiestaCliente,
        public business?: string,
        public allegati?: Array<FileServerData>,
        public dayUntilNow?: number
    ) { }
}