import { Cliente } from "../Cliente";

export class ProspectListOverview {
    constructor(
        public totalCount: number,
        public lines: Array<Cliente>
    ) { }
}