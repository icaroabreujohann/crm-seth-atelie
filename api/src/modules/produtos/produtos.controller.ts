import { Request, Response } from 'express'
import { ProdutosService } from './produtos.services'
import { gerenciadorMensagens } from '../../utils/gerenciadorRepostas'
import { CODIGOS_SUCESSO } from '../../utils/codigosRespostas'
import { CriarProdutoDTO, EditarProdutoDTO } from './produtos.types'
import { validaRequisicao } from '../../shared/validators/valida.requisicao'

export class ProdutosController {
     private service = new ProdutosService()

     listarProdutos = async (req: Request, res: Response) => {
          const produtos = await this.service.listar()
          gerenciadorMensagens.enviarMensagemSucesso(res, 200, CODIGOS_SUCESSO.PRODUTO_LISTAR_SUCESS, produtos)
     }

     listarProdutoCodigo = async (req: Request, res: Response) => {
          const codigo = res.locals.codigo

          const produto = await this.service.listarPorCodigo(codigo)
          gerenciadorMensagens.enviarMensagemSucesso(res, 200, CODIGOS_SUCESSO.PRODUTO_LISTAR_SUCESS, produto)
     }

     listarProdutoCompleto = async (req: Request, res: Response) => {
          const codigo = res.locals.codigo

          const produto = await this.service.listarCompleto(codigo)
          gerenciadorMensagens.enviarMensagemSucesso(res, 200, CODIGOS_SUCESSO.PRODUTO_LISTAR_SUCESS, produto)
     }

     criarProduto = async (req: Request, res: Response) => {
          console.log('redbody criar',req.body)
          const data: CriarProdutoDTO = req.body
          validaRequisicao(data, ['nome', 'preco'])
          
          const fotos = (req.files as Express.Multer.File[]) ?? []

          const produtoCriado = await this.service.criarProduto(data, fotos)
          gerenciadorMensagens.enviarMensagemSucesso(res, 200, CODIGOS_SUCESSO.PRODUTO_CRIAR_SUCESS, produtoCriado)
     }

     editarProduto = async (req: Request, res: Response) => {
          const codigo = res.locals.codigo
          const data: EditarProdutoDTO = req.body


          validaRequisicao(data, ['nome', 'preco'])

          const produtoEditado = await this.service.editarProduto(codigo, data)
          gerenciadorMensagens.enviarMensagemSucesso(res, 200, CODIGOS_SUCESSO.PRODUTO_EDITAR_SUCESS, produtoEditado)
     }

     editarFotosProduto = async (req: Request, res: Response) => {
          const codigo = res.locals.codigo

          const fotos = (req.files as Express.Multer.File[]) ?? []
          
          const fotosEditadas = await this.service.editarFotosProduto(codigo, fotos)
          gerenciadorMensagens.enviarMensagemSucesso(res, 200, CODIGOS_SUCESSO.PRODUTO_EDITAR_FOTOS_SUCESS, fotosEditadas)
     }

     excluirProduto = async (req: Request, res: Response) => {
          const codigo = res.locals.codigo

          const produtoExcluido = await this.service.excluirProduto(codigo)
          gerenciadorMensagens.enviarMensagemSucesso(res, 200, CODIGOS_SUCESSO.PRODUTO_EXCLUIR_SUCESS, produtoExcluido)
     }
}