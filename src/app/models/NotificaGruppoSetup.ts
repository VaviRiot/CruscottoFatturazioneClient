import { GruppoUtenti } from "./GruppoUtenti";
import { Notifica } from "./Notifica";

export class NotificaGruppoSetup {
    constructor(
        public id: number,
        public create_user: string,
        public create_date: Date,
        public last_mod_user: string,
        public last_mod_date: Date,
        public notifica: Notifica,
        public gruppo: GruppoUtenti
    ) { }
}