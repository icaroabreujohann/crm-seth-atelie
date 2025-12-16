import { Request, Response } from 'express'
import { gerenciadorMensagens } from '../../utils/gerenciadorRepostas'
import { CODIGOS_SUCESSO } from '../../utils/codigosRespostas'
import { CriarMaterialDTO, EditarMaterialDTO } from './materiais.types'
import { validaRequisicao } from '../../shared/validators/valida.requisicao'
import { MateriaisServices } from './materiais.services'

export class MaterialsController {
     private service = new MateriaisServices()

     listarMateriais = async (req: Request, res: Response) => {
          const materiais = await this.service.listar()
          gerenciadorMensagens.enviarMensagemSucesso(res, 200, CODIGOS_SUCESSO.MATERIAL_LISTAR_SUCESS, materiais)
     }

     listarMaterialCodigo = async (req: Request, res: Response) => {
          const codigo = res.locals.codigo

          const material = await this.service.listarPorCodigo(codigo)
          gerenciadorMensagens.enviarMensagemSucesso(res, 200, CODIGOS_SUCESSO.MATERIAL_LISTAR_SUCESS, material)
     }

     criarMaterial = async (req: Request, res: Response) => {
          const data: CriarMaterialDTO = req.body
          validaRequisicao(data, ['nome', 'tipo_id', 'unidade_medida_id', 'preco', 'quantidade'])
          
          const materialCriado = await this.service.criarMaterial(data)
          gerenciadorMensagens.enviarMensagemSucesso(res, 200, CODIGOS_SUCESSO.MATERIAL_CRIAR_SUCESS, materialCriado)
     }

     editarMaterial = async (req: Request, res: Response) => {
          const codigo = res.locals.codigo
          const data: EditarMaterialDTO = req.body

          const materialEditado = await this.service.editarMaterial(codigo, data)
          gerenciadorMensagens.enviarMensagemSucesso(res, 200, CODIGOS_SUCESSO.MATERIAL_EDITAR_SUCESS, materialEditado)
     }

     excluirMaterial = async (req: Request, res: Response) => {
          const codigo = res.locals.codigo

          const materialExcluido = await this.service.excluirMaterial(codigo)
          gerenciadorMensagens.enviarMensagemSucesso(res, 200, CODIGOS_SUCESSO.MATERIAL_EXCLUIR_SUCESS, materialExcluido)
     }
}