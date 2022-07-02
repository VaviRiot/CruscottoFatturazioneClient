import { Corrispettivi } from "../Corrispettivi";

export class CorrispettivoSaveRequest {
    constructor(
        public tipologiaCorrispettivi: Corrispettivi,
        public utenteUpdate: string
    ) { }
}