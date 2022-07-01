import { ScadenzeGiorniGaranzie } from "../ScadenzeGiorniGaranzie";

export class ScadenzeGiorniGaranzieListOverview {
    constructor(
        public totalCount: number,
        public lines: Array<ScadenzeGiorniGaranzie>
    ) { }
}