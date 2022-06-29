export class VerifyTokenRequest {
    constructor(
        public token: string,
        public username: string
    ) { }
}