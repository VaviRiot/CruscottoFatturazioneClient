import { UserRole } from "../UserRole";

export class RuoliListOverview {
    constructor(
        public totalCount: number,
        public lines: Array<UserRole>
    ) { }
}