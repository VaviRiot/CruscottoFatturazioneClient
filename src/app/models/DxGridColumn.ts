export class DxGridColumn {
    constructor(
        public visibleIndex: number,
        public dataField: string,
        public name: string,
        public dataType: string,
        public visible: boolean,
        public filterValue?: string
    ) { }
}