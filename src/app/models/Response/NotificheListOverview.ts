import { Notifica } from "../Notifica";

export class NotificheListOverview {
    constructor(
        public totalCount: number,
        public lines: Array<Notifica>
    ) { }
}