import { CodigoResposta } from "./codigo.resposta"

export class ErroCustomizado extends Error {
    definidoPeloSistema: boolean
    codigoResposta: CodigoResposta
    data: any
    codigoStatus: number

    constructor(codigoResposta: CodigoResposta, data?: any, codigoStatus?: number) {
        super(codigoResposta.mensagem)
        this.definidoPeloSistema = true
        this.codigoResposta = codigoResposta
        this.data = data ?? null
        this.codigoStatus = codigoStatus ?? 400
    }
}