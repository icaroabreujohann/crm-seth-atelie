import { randomUUID } from 'node:crypto'
import { assertResultadoExiste } from '../../shared/asserts/assertResultadoBusca'
import { CODIGOS_ERRO } from '../../utils/respostas/codigos-resposta'
import { EncomendasRepository } from './encomendas.repository'
import { EncomendaMaterialService } from './materiais/encomendaMaterial.services'
import { EncomendaMaterialCriarDTO } from './materiais/encomendaMaterialtypes'
import { EncomendaMaterialRepository } from './materiais/encomendaMaterial.repository'

export class EncomendasServices {
     constructor(
          private repository = new EncomendasRepository(),
          private servicesMateriais = new EncomendaMaterialService(),
          private repositoryMateriais = new EncomendaMaterialRepository()
     ) { }

     private async gerarCodigoEncomendaUnico(): Promise<string> {
          let codigo: string
          let produtoExiste

          do {
               codigo = randomUUID()
               produtoExiste = await this.repository.listarPorCodigo(codigo)
          } while (produtoExiste.existe)

          return codigo
     }

     private async inserirMateriaisDoMaterial(encomenda_id: number, materiais: EncomendaMaterialCriarDTO[]): Promise<void> {
          if (!materiais?.length) return

          for (const material of materiais) {
               await this.servicesMateriais.adicionarMaterial(encomenda_id, material)
          }
     }

     private async excluirMateriaisDoProduto(produto_id: number): Promise<void> {
          await this.repositoryMateriais.excluirPorProduto(produto_id)
     }

     async listar() {
          return await this.repository.listar()
     }

     async listarPorCodigo(codigo: string) {
          const encomenda = await this.repository.listarPorCodigo(codigo)
          assertResultadoExiste(encomenda, CODIGOS_ERRO.ENCOMENDA_N_EXISTE_ERR, codigo)

          return encomenda
     }
}