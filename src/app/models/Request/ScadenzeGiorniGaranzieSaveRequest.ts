import { ScadenzeGiorniGaranzie } from "../ScadenzeGiorniGaranzie";

export class ScadenzeGiorniGaranzieSaveRequest {
    constructor(
        public scadenzeGiorniGaranzie: ScadenzeGiorniGaranzie,
        public utenteUpdate: string
    ) { }
}