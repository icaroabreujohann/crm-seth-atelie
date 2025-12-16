import { EncomendaMaterialRepository } from './encomendaMaterial.repository'
import { EncomendasRepository } from '../encomendas.repository'
import { assertResultadoExiste } from '../../../shared/asserts/assertResultadoBusca'
import { CODIGOS_ERRO } from '../../../utils/codigosRespostas'
import { CriarEncomendaMaterialDTO, EditarEncomendaMaterialDTO } from './encomendaMaterial.types'
import { MateriaisRepository } from '../../materiais/materiais.repository'
import { validaRegraNegocio } from '../../../shared/validators/valida.regranegocio'

export class EncomendaMaterialServices {
     private repository = new EncomendaMaterialRepository()
     private repositoryEncomendas = new EncomendasRepository()
     private repositoryMaterial = new MateriaisRepository()

     async listarMaterialPorEncomenda(codigo: string) {
          const encomenda = await this.repositoryEncomendas.listarEncomendaPorCodigo(codigo)
          assertResultadoExiste(encomenda, CODIGOS_ERRO.ENCOMENDA_N_EXISTE_ERR, codigo)

          return await this.repository.listarMateriaisPorEncomenda(encomenda.data.id)
     }

     async adicionarMaterial(encomenda_codigo: string, data: CriarEncomendaMaterialDTO) {
          const encomenda = await this.repositoryEncomendas.listarEncomendaPorCodigo(encomenda_codigo)
          assertResultadoExiste(encomenda, CODIGOS_ERRO.ENCOMENDA_N_EXISTE_ERR, encomenda_codigo)

          const material = await this.repositoryMaterial.listarMaterialPorCodigo(data.material_codigo)
          assertResultadoExiste(material, CODIGOS_ERRO.ENCOMENDA_MATERIAL_N_EXISTE_ERRO, data.material_codigo)

          const materialEncomenda = {
               encomenda_id: encomenda.data.id,
               material_id: material.data.id,
               quantidade: data.quantidade,
               preco_final: material.data.preco_x_qtd * data.quantidade
          }
          return await this.repository.criar(materialEncomenda)
     }

     async editarMaterial(encomenda_codigo: string, id: number, data: EditarEncomendaMaterialDTO) {
          const encomenda = await this.repositoryEncomendas.listarEncomendaPorCodigo(encomenda_codigo)
          assertResultadoExiste(encomenda, CODIGOS_ERRO.ENCOMENDA_N_EXISTE_ERR, encomenda)

          const materialEncomenda = await this.repository.listarMaterialPorId(id)
          assertResultadoExiste(materialEncomenda, CODIGOS_ERRO.ENCOMENDA_MATERIAL_N_EXISTE_ERRO, id)

          const material = await this.repositoryMaterial.listarMaterialPorId(materialEncomenda.data.material_id)
          assertResultadoExiste(material, CODIGOS_ERRO.ENCOMENDA_MATERIAL_N_EXISTE_ERRO, materialEncomenda.data.material_id)

          validaRegraNegocio([{ condicao: materialEncomenda.data.encomenda_id != encomenda.data.id, valor: materialEncomenda, codigoResposta: CODIGOS_ERRO.ENCOMENDA_MATERIAL_N_CORRESPONDE_ERRO }])

          const dataMaterial = { quantidade: data.quantidade, preco_final: material.data.preco_x_qtd * data.quantidade }
          return await this.repository.editar(id, dataMaterial)
     }

     async excluirMaterial(encomenda_codigo: string, id: number) {
          const encomenda = await this.repositoryEncomendas.listarEncomendaPorCodigo(encomenda_codigo)
          assertResultadoExiste(encomenda, CODIGOS_ERRO.ENCOMENDA_N_EXISTE_ERR, encomenda)

          const materialEncomenda = await this.repository.listarMaterialPorId(id)
          assertResultadoExiste(materialEncomenda, CODIGOS_ERRO.ENCOMENDA_MATERIAL_N_EXISTE_ERRO, id)

          validaRegraNegocio([{ condicao: materialEncomenda.data.encomenda_id != encomenda.data.id, valor: materialEncomenda, codigoResposta: CODIGOS_ERRO.ENCOMENDA_MATERIAL_N_CORRESPONDE_ERRO }])

          return await this.repository.excluir(id)
     }
}