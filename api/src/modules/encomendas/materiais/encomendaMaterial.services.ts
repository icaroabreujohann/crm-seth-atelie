import { MateriaisRepository } from '../../materiais/materiais.repository'
import { assertResultadoExiste } from '../../../shared/asserts/assertResultadoBusca'
import { CODIGOS_ERRO } from '../../../utils/respostas/codigos-resposta'
import { EncomendasRepository } from '../encomendas.repository'
import { EncomendaMaterialCriarDTO } from './encomendaMaterialtypes'
import { EncomendaMaterialRepository } from './encomendaMaterial.repository'

export class EncomendaMaterialService {
     private repository = new EncomendaMaterialRepository()
     private repositoryMaterial = new MateriaisRepository()
     private repositoryEncomenda = new EncomendasRepository()

     async adicionarMaterial(encomenda_id: number, data: EncomendaMaterialCriarDTO) {
          const encomenda = await this.repositoryEncomenda.listarPorId(encomenda_id)
          assertResultadoExiste(encomenda, CODIGOS_ERRO.ENCOMENDA_N_EXISTE_ERR, encomenda_id)

          console.log(data)

          const material = await this.repositoryMaterial.listarMaterialPorCodigo(data.material_codigo)
          assertResultadoExiste(material, CODIGOS_ERRO.MATERIAL_N_EXISTE_ERR, data.material_codigo)

          const materialEncomenda = {
               encomenda_id: encomenda.data.id,
               material_id: material.data.id,
               quantidade: data.quantidade,
               preco_final: material.data.preco_x_qtd * data.quantidade
          }
          return await this.repository.criar(materialEncomenda)
     }
}