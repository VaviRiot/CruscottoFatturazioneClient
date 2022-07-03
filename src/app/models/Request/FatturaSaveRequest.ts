import { Fattura } from "../Fatture";

export class FatturaSaveRequest {
    constructor(
        public fattura: Fattura,
        public utenteUpdate: string
    ) { }
}