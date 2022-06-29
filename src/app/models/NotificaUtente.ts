export class NotificaUtente {
    constructor(
        public id?: number,
        public message?: string,
        public urlToOpen?: string,
        public isNew?: boolean,
        public notificaId?: number,
        public notificaStepId?: number,
        public notificaNome?: string,
        public tipologiaId?: number,
        public tipologiaNome?: string,
        public tipologiaDescrizione?: string
    ) { }
}