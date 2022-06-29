export class OrderClause {
    constructor(public column: string, 
                public predicate: string, 
                public checked: boolean) { }
}