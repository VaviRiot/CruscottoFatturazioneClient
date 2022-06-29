import { InsolutoSummary } from "../InsolutoSummary";

export class InsolutiSummaryOverview {
    constructor(
        public totalCount: number,
        public lines: Array<InsolutoSummary>
    ) { }
}