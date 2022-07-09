import { Cliente } from "../Fatture";

export class ClienteSaveRequest {
    constructor(
        public cliente: Cliente,
        public utenteUpdate: string
    ) { }
}