import { Request, Response } from 'express'
import { ProdutoMaterialService } from './produtoMaterial.services'
import { gerenciadorMensagens } from '../../../utils/gerenciadorRepostas'
import { CODIGOS_SUCESSO } from '../../../utils/codigosRespostas'
import { CriarProdutoMaterialDTO } from './produtoMaterial.types'
import { validaRequisicao } from '../../../shared/validators/valida.requisicao'

export class ProdutoMaterialController {
     private services = new ProdutoMaterialService()

     listarPorProduto = async (req: Request, res: Response) => {
          const codigo: string = String(req.params.codigo)

          const materiais = await this.services.listarMaterialPorProduto(codigo)
          gerenciadorMensagens.enviarMensagemSucesso(res, 200, CODIGOS_SUCESSO.PRODUTO_MATERIAL_LISTAR_SUCESS, materiais)
     }

     adicionarMaterialProduto = async (req: Request, res: Response) => {
          const produto_codigo = String(req.params.codigo)
          const data: CriarProdutoMaterialDTO = req.body

          validaRequisicao(data, ['material_codigo', 'quantidade'])

          const materialAdicionado = await this.services.adicionarMaterial(produto_codigo, data)
          gerenciadorMensagens.enviarMensagemSucesso(res, 200, CODIGOS_SUCESSO.PRODUTO_MATERIAL_CRIAR_SUCESS, materialAdicionado)
     }

     editarMaterialProduto = async (req: Request, res: Response) => {
          const produto_codigo = String(req.params.codigo)
          const id = Number(req.params.id)
          const data = req.body

          validaRequisicao(data, ['quantidade'])

          const materialEditado = await this.services.editarMaterial(produto_codigo, id, data)
          gerenciadorMensagens.enviarMensagemSucesso(res, 200, CODIGOS_SUCESSO.PRODUTO_MATERIAL_EDITAR_SUCESS, materialEditado)
     }

     excluirMaterialProduto = async (req: Request, res: Response) => {
          const produto_codigo = String(req.params.codigo)
          const id = Number(req.params.id)

          const materialEditado = await this.services.excluirMaterial(produto_codigo, id)
          gerenciadorMensagens.enviarMensagemSucesso(res, 200, CODIGOS_SUCESSO.PRODUTO_MATERIAL_EXCLUIR_SUCESS, materialEditado)
     }
}