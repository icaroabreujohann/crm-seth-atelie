import { Request, Response } from 'express'
import { ProdutosService } from './produtos.services'
import { gerenciadorMensagens } from '../../utils/gerenciadorRepostas'
import { CODIGOS_SUCESSO } from '../../utils/codigosRespostas'
import { CriarProdutoDTO, EditarProdutoDTO } from '../../types/produtos'
import { validaRequisicao } from '../../validators/valida.requisicao'

export class ProdutosController {
     private service = new ProdutosService()

     listarProdutos = async (req: Request, res: Response) => {
          const produtos = await this.service.listar()
          gerenciadorMensagens.enviarMensagemSucesso(res, 200, CODIGOS_SUCESSO.PRODUTO_LISTAR_SUCESS, produtos)
     }

     listarProdutoPorId = async (req: Request, res: Response) => {
          const id: number = Number(req.params.id)

          const produto = await this.service.listarPorId(id)
          gerenciadorMensagens.enviarMensagemSucesso(res, 200, CODIGOS_SUCESSO.PRODUTO_LISTAR_SUCESS, produto)
     }

     criarProduto = async (req: Request, res: Response) => {
          const data: CriarProdutoDTO = req.body
          validaRequisicao(data, ['nome', 'preco'])

          const produtoCriado = await this.service.criarProduto(data)
          gerenciadorMensagens.enviarMensagemSucesso(res, 200, CODIGOS_SUCESSO.PRODUTO_CRIAR_SUCESS, produtoCriado)
     }

     editarProduto = async (req: Request, res: Response) => {
          const id: number = Number(req.params.id)
          const data: EditarProdutoDTO = req.body
          validaRequisicao(data, ['nome', 'preco'])

          const produtoEditado = await this.service.editarProduto(id, data)
          gerenciadorMensagens.enviarMensagemSucesso(res, 200, CODIGOS_SUCESSO.PRODUTO_EDITAR_SUCESS, produtoEditado)
     }

     excluirProduto = async (req: Request, res: Response) => {
          const id: number = Number(req.params.id)

          const produtoExcluido = await this.service.excluirProduto(id)
          gerenciadorMensagens.enviarMensagemSucesso(res, 200, CODIGOS_SUCESSO.PRODUTO_EXCLUIR_SUCESS, produtoExcluido)
     }
}