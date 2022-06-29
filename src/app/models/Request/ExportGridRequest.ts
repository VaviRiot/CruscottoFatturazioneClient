import { DxGridColumn } from "../DxGridColumn";
import { FilterPayload } from "../FilterPayload";

export class ExportGridRequest {
    constructor(
        public columns: Array<DxGridColumn>,
        public filterPost: FilterPayload
    ) { }
}