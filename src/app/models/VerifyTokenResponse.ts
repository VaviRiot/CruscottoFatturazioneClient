export class VerifyTokenResponse {
    constructor(
        public isValid?: boolean,
        public isRefresh?: boolean,
        public token?: string,
        public message?: string
    ) { }
}