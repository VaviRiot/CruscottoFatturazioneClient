import { FileServerData } from "../FileServerData";

  export class DerogaMeritoResponse {
    constructor(
        public result: boolean,
        public nextWorkFlowStepId: number,
        public nextWorkFlowStepIndex: number,

        public derogaMeritoId: number,
        public derogaMeritoName: string,
        public derogaMeritoUser: string,
        public derogaMeritoDate: Date,
        public derogaMeritoNotaId: number,
        
	      public derogaDocumentList?: Array<FileServerData>,
	      public derogaMeritoNota?: string
    ) { }
}