export class ValidazioneStepResponse {
    constructor(
        public result: boolean,
        public nextWorkFlowStepId: number,
        public savedDocumentId: number
    ) { }
}