import { CodigoResposta } from "./codigo.resposta";

export interface Verificacao {
     condicao: boolean;
     codigoResposta: CodigoResposta;
     valor?: any;
}