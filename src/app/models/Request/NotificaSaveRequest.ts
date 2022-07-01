import { Notifica } from "../Notifica";

export class NotificaSaveRequest {
    constructor(
        public notifica: Notifica,
        public utenteUpdate: string
    ) { }
}