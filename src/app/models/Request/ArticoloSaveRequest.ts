import { Articoli } from "../Articoli";

export class ArticoloSaveRequest {
    constructor(
        public articolo: Articoli,
        public utenteUpdate: string
    ) { }
}