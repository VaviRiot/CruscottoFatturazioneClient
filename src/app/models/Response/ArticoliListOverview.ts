import { Articoli } from "../Articoli";

export class ArticoliListOverview {
    constructor(
        public totalCount: number,
        public lines: Array<Articoli>
    ) { }
}