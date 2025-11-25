import { NextFunction, Request, Response } from 'express'
import { ClientesService } from '../clientes/clientes.services'
import { gerenciadorMensagens } from '../../utils/gerenciadorRepostas'
import { CODIGOS_SUCESSO } from '../../utils/codigosRespostas'

export class ClientesController {
     private service = new ClientesService()

     listarClientes = async (req: Request, res: Response, next: NextFunction) => {
          try {
               const response = await this.service.listarClientes()
               gerenciadorMensagens.enviarMensagemSucesso(res, 200, CODIGOS_SUCESSO.CLIENTE_LISTAR_SUCESS, response)

               next()
          } catch (error) {
               next(error)
          }
     }

     listarClientePorId = async (req: Request, res: Response) => {
          const response = await this.service.listarClientePorId(Number(req.params.id))
          gerenciadorMensagens.enviarMensagemSucesso(res, 200, CODIGOS_SUCESSO.CLIENTE_LISTAR_SUCESS, response)
     }
}
