import { Response } from "express"
import { CodigoResposta } from "../types/codigo.resposta"

class GerenciadorMensagens {
     private _criarResposta(sucesso: boolean, definidoPeloSistema: boolean, codigoResposta: CodigoResposta, codigoStatus: number, data: object | null = null) {
          return {
               sucesso: sucesso,
               mensagem: codigoResposta.mensagem,
               codigo: codigoResposta.codigo,
               data,
               definidoPeloSistema: definidoPeloSistema,
               codigoStatus: codigoStatus ?? (sucesso ? 200 : 400)
          }
     }

     criarMensagemSucesso(codigoResposta: CodigoResposta, data: object | null = null) {
          return this._criarResposta(
               true,
               true,
               codigoResposta,
               200,
               data
          )
     }

     criarMensagemErro(codigoResposta: CodigoResposta, data: object | null = null) {
          return this._criarResposta(
               false,
               true,
               codigoResposta,
               400,
               data
          )
     }

     enviarMensagemSucesso(res: Response, status: number, codigoResposta: CodigoResposta, data: object | null = null) {
          res.status(status).json(this.criarMensagemSucesso(codigoResposta, data))
     }

     enviarMensagemErro(res: Response, status: number, codigoResposta: CodigoResposta, data: object | null = null) {
          res.status(status).json(this.criarMensagemErro(codigoResposta, data))
     }
}

export const gerenciadorMensagens = new GerenciadorMensagens()