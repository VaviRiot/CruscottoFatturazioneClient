import { User } from "../User";

export class UtentiListOverview {
    constructor(
        public totalCount: number,
        public lines: Array<User>
    ) { }
}