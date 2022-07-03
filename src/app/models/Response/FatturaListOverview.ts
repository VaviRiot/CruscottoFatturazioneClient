import { Fattura } from "../Fatture";

export class FatturaListOverview {
    constructor(
        public totalCount: number,
        public lines: Array<Fattura>
    ) { }
}