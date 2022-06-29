import { ProspectTopSummary } from "./ProspectTopSummary";
import { ProspectAnagrafica } from "./ProspectAnagrafica";
import { ProspectGaranzia } from "./ProspectGaranzia";
import { ProspectDocumento } from "./ProspectDocumento";
import { RichiestaCliente } from "./RichiestaCliente";
import { RichiestaShort } from "./RichiestaShort";

export class ProspectComplete {
    constructor(
        public result: boolean,
        public resultMessage: string,
        public topSummary?: ProspectTopSummary,
        public anagrafica?: ProspectAnagrafica,
        public listRichiesteAltriBusiness?: Array<RichiestaShort>,
        public listGaranzie?: Array<ProspectGaranzia>,
        public listDocumenti?: Array<ProspectDocumento>,
        public richiesta?: RichiestaCliente
    ) { }
}