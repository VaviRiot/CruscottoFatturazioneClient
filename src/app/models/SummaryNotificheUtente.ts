import { NotificaUtente } from "./NotificaUtente";

export class SummaryNotificheUtente {
    constructor(
        public unreadedCount?: number,
        public readedCount?: number,
        public totalCount?: number,
        public listUnreaded?: Array<NotificaUtente>,
        public listReaded?: Array<NotificaUtente>
    ) { }
}