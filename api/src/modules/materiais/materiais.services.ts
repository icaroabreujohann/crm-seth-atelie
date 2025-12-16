import { randomUUID } from 'crypto'
import { CODIGOS_ERRO } from '../../utils/codigosRespostas'
import { assertResultadoExiste } from '../../shared/asserts/assertResultadoBusca'
import { MateriaisRepository } from './materiais.repository'
import { CriarMaterialDTO, EditarMaterialDTO } from './materiais.types'

export class MateriaisServices {
     private repository = new MateriaisRepository()

     private async gerarCodigoMaterialUnico(): Promise<string> {
          let codigo = randomUUID()
          let produtoExiste = await this.repository.listarMaterialPorCodigo(codigo)

          while (produtoExiste.existe) {
               codigo = randomUUID()
               produtoExiste = await this.repository.listarMaterialPorCodigo(codigo)
          }

          return codigo
     }

     async listar() {
          return await this.repository.listar()
     }

     async listarPorCodigo(codigo: string) {
          const material = await this.repository.listarMaterialPorCodigo(codigo)

          assertResultadoExiste(material, CODIGOS_ERRO.MATERIAL_N_EXISTE_ERR, codigo)
          return material
     }

     async criarMaterial(data: CriarMaterialDTO) {
          const codigo = await this.gerarCodigoMaterialUnico()

          return await this.repository.criar({ ...data, codigo })
     }

     async editarMaterial(codigo: string, data: EditarMaterialDTO) {
          const material = await this.repository.listarMaterialPorCodigo(codigo)

          assertResultadoExiste(material, CODIGOS_ERRO.MATERIAL_N_EXISTE_ERR, codigo)
          return await this.repository.editar(material.data.id, data)
     }

     async excluirMaterial(codigo: string) {
          const material = await this.repository.listarMaterialPorCodigo(codigo)

          assertResultadoExiste(material, CODIGOS_ERRO.MATERIAL_N_EXISTE_ERR, codigo)
          return await this.repository.excluir(material.data.id)
     }
}


