import { SaleTirRichiesta } from "../SaleTirRichiesta";

export class SaleTirListOverview {
    constructor(
        public totalCount: number,
        public lines: Array<SaleTirRichiesta>
    ) { }
}