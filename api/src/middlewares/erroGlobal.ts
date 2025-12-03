import { CODIGOS_ERRO } from '../utils/codigosRespostas'
import { Response, Request, NextFunction } from 'express'
import { ErroCustomizado } from '../errors/erro.customizado'
import { gerenciadorMensagens } from '../utils/gerenciadorRepostas'

export const erroGlobal = (err: ErroCustomizado, req: Request, res: Response, next: NextFunction) => {
     console.log(err)
     if(err.definidoPeloSistema) {
          return gerenciadorMensagens.enviarMensagemErro(
               res,
               err.codigoStatus ?? 400,
               err.codigoResposta,
               err.data
          )
     }

     return gerenciadorMensagens.enviarMensagemErro(
          res,
          500,
          CODIGOS_ERRO.ERRO_INTERNO,
          err
     )
}