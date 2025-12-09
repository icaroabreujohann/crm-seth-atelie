import { Request, Response } from 'express'
import { EncomendasServices } from './encomendas.services'
import { gerenciadorMensagens } from '../../utils/gerenciadorRepostas'
import { CODIGOS_SUCESSO } from '../../utils/codigosRespostas'
import { validaRequisicao } from '../../shared/validators/valida.requisicao'

export class EncomendasController {
     private services = new EncomendasServices()

     listar = async (req: Request, res: Response) => {
          const encomendas = this.services.listar()
          gerenciadorMensagens.enviarMensagemSucesso(res, 200, CODIGOS_SUCESSO.ENCOMENDA_LISTAR_SUCESS, encomendas)
     }

     listarPorCodigo = async (req: Request, res: Response) => {
          const codigo = String(req.params.codigo)

          const encomenda = this.services.listar()
          gerenciadorMensagens.enviarMensagemSucesso(res, 200, CODIGOS_SUCESSO.ENCOMENDA_LISTAR_SUCESS, encomenda)
     }

     criarEncomenda = async (req: Request, res: Response) => {
          const data = req.body

          validaRequisicao(data, ['cliente_id', 'produto_codigo'])
          const encomenda = this.services.criarEncomenda(data)
          gerenciadorMensagens.enviarMensagemSucesso(res, 200, CODIGOS_SUCESSO.ENCOMENDA_CRIAR_SUCESS, encomenda)
     }

}