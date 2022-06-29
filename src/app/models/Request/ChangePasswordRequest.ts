export class ChangePasswordRequest {
    constructor(
        public idUtente: number,
        public passwordPrecedente: string,
        public passwordNuova: string,
        public utenteUpdate: string
    ) { }
}