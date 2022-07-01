export class FilterPayload {
    constructor(
        public index: number,
        public pagesize: number,
        public filters: Filter[],
        public sort: Sort[]
    ) { }
}

export class Filter {
    constructor(
        public name: string,
        public operator: string,
        public value: string,
        public valueList: string[]
    ) { }
}

export class Sort {
    constructor(
        public name: string,
        public type: string
    ) { }
}