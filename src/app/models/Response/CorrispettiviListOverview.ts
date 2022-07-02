import { Corrispettivi } from "../Corrispettivi";

export class CorrispettiviListOverview {
    constructor(
        public totalCount: number,
        public lines: Array<Corrispettivi>
    ) { }
}