import { Request, Response } from 'express'
import { EncomendasServices } from './encomendas.services'
import { gerenciadorMensagens } from '../../utils/respostas/gerenciador-resposta'
import { CODIGOS_SUCESSO } from '../../utils/respostas/codigos-resposta'
import { EncomendaCriarDTO, EncomendaEditarDTO } from './encomendas.types'
import { validaRequisicao } from '../../shared/validators/valida.requisicao'

export class EncomendasController {
     constructor(
          private services = new EncomendasServices()
     ){}
     
     listarEncomendas = async (req: Request, res: Response) => {
          const encomendas = await this.services.listar()
          gerenciadorMensagens.enviarMensagemSucesso(res, 200, CODIGOS_SUCESSO.ENCOMENDA_LISTAR_SUCESS, encomendas)
     }

     listarEncomendaCompleta = async (req: Request, res: Response) => {
          const codigo = res.locals.codigo

          const encomenda = await this.services.listarCompleto(codigo)
          gerenciadorMensagens.enviarMensagemSucesso(res, 200, CODIGOS_SUCESSO.ENCOMENDA_LISTAR_SUCESS, encomenda)
     }

     criarEncomenda = async (req: Request, res: Response) => {
          const data: EncomendaCriarDTO = req.body

          validaRequisicao(data, ['cliente_id', 'produto_codigo'])

          const encomendaCriada = await this.services.criar(data)
          gerenciadorMensagens.enviarMensagemSucesso(res, 200, CODIGOS_SUCESSO.ENCOMENDA_CRIAR_SUCESS, encomendaCriada)
     }

     editarEncomenda = async (req: Request, res: Response) => {
          const codigo = res.locals.codigo
          const data: EncomendaEditarDTO = req.body
          console.log('data controller', data)
          const encomendaEditada = await this.services.editar(codigo, data)
          gerenciadorMensagens.enviarMensagemSucesso(res, 200, CODIGOS_SUCESSO.ENCOMENDA_EDITAR_SUCESS, encomendaEditada)
     }

     excluirEncomenda = async (req: Request, res: Response) => {
          const codigo = res.locals.codigo

          const encomendaExcluida = await this.services.excluir(codigo)
          gerenciadorMensagens.enviarMensagemSucesso(res, 200, CODIGOS_SUCESSO.ENCOMENDA_EXCLUIR_SUCESS, encomendaExcluida)
     }
}