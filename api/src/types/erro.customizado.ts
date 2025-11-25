import { CodigoResposta } from "./codigo.resposta"

export interface ErroCustomizado extends Error {
    definidoPeloSistema?: boolean
    codigoStatus?: number
    codigoResposta: CodigoResposta,
    data?: object | null
}