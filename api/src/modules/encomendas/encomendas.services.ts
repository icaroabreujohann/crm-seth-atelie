import { randomUUID } from 'node:crypto'
import { assertResultadoExiste } from '../../shared/asserts/assertResultadoBusca'
import { CODIGOS_ERRO } from '../../utils/respostas/codigos-resposta'
import { EncomendasRepository } from './encomendas.repository'
import { EncomendaMaterialService } from './materiais/encomendaMaterial.services'
import { EncomendaMaterialCriarDTO } from './materiais/encomendaMaterialtypes'
import { EncomendaMaterialRepository } from './materiais/encomendaMaterial.repository'
import { EncomendaCriarDTO, EncomendaEditarDTO } from './encomendas.types'
import { ProdutosRepository } from '../produtos/produtos.repository'
import { ClientesRepository } from '../clientes/clientes.repository'
import { mapEncomendaCriarDTOParaDB, mapEncomendaEditarDTOParaDB, mapProdutoMaterialParaEncomendaMaterial } from './encomendas.mapper'
import { assertPersistencia } from '../../shared/asserts/assertPersistencia'
import { ProdutoMaterialService } from '../produtos/materiais/produtoMaterial.services'
import { ProdutoMaterialRepository } from '../produtos/materiais/produtoMaterial.repository'

export class EncomendasServices {
     constructor(
          private repository = new EncomendasRepository(),
          private repositoryMateriais = new EncomendaMaterialRepository(),
          private repositoryMateriaisProdutos = new ProdutoMaterialRepository(),
          private repositoryProdutos = new ProdutosRepository(),
          private repositoryClientes = new ClientesRepository(),
          private servicesMateriaisEncomendas = new EncomendaMaterialService()
     ) { }

     private async gerarCodigoEncomendaUnico(): Promise<string> {
          let codigo: string
          let encomendaExiste

          do {
               codigo = randomUUID()
               encomendaExiste = await this.repository.listarPorCodigo(codigo)
          } while (encomendaExiste.existe)

          return codigo
     }

     private async inserirMateriaisDaEncomenda(encomenda_id: number, materiais: EncomendaMaterialCriarDTO[]): Promise<void> {
          if (!materiais?.length) return

          for (const material of materiais) {
               await this.servicesMateriaisEncomendas.adicionarMaterial(encomenda_id, material)
          }
     }

     private async excluirMateriaisDaEncomenda(encomenda_id: number): Promise<void> {
          await this.repositoryMateriais.excluirPorEncomenda(encomenda_id)
     }

     async listar() {
          return await this.repository.listar()
     }

     async listarPorCodigo(codigo: string) {
          const encomenda = await this.repository.listarPorCodigo(codigo)
          assertResultadoExiste(encomenda, CODIGOS_ERRO.ENCOMENDA_N_EXISTE_ERR, codigo)

          return encomenda.data
     }

     async listarCompleto(codigo: string) {
          const encomenda = await this.repository.listarPorCodigo(codigo)
          assertResultadoExiste(encomenda, CODIGOS_ERRO.ENCOMENDA_N_EXISTE_ERR, codigo)

          const materiais = await this.repositoryMateriais.listarMaterialPorEncomenda(encomenda.data.id)
          const materiaisMapeados = materiais?.data ?? []

          return {
               ...encomenda.data,
               materiais: materiaisMapeados
          }
     }

     async criar(data: EncomendaCriarDTO) {
          const produtoExiste = await this.repositoryProdutos.listarProdutoPorCodigo(data.produto_codigo)
          assertResultadoExiste(produtoExiste, CODIGOS_ERRO.PRODUTO_N_EXISTE_ERR, data.produto_codigo)

          const clienteExiste = await this.repositoryClientes.listarPorId(data.cliente_id)
          assertResultadoExiste(clienteExiste, CODIGOS_ERRO.CLIENTE_N_EXISTE_ERR, data.cliente_id)

          const codigo = await this.gerarCodigoEncomendaUnico()
          const encomendaMap = mapEncomendaCriarDTOParaDB(data, codigo, produtoExiste.data.id)

          const encomendaCriada = await this.repository.criar(encomendaMap)
          assertPersistencia(encomendaCriada, CODIGOS_ERRO.ENCOMENDA_CRIAR_ERR)

          const materiaisDoProduto = await this.repositoryMateriaisProdutos.listarMaterialPorProduto(produtoExiste.data.id)
          assertResultadoExiste(materiaisDoProduto, CODIGOS_ERRO.PRODUTO_MATERIAL_N_EXISTE_ERRO, produtoExiste.data.id)
          const materiaisMapeados = mapProdutoMaterialParaEncomendaMaterial(materiaisDoProduto.data)

          await this.inserirMateriaisDaEncomenda(encomendaCriada.id, materiaisMapeados)


          return encomendaCriada
     }

     async editar(codigo: string, data: EncomendaEditarDTO) {
          const encomendaExiste = await this.repository.listarPorCodigo(codigo)
          assertResultadoExiste(encomendaExiste, CODIGOS_ERRO.ENCOMENDA_N_EXISTE_ERR, codigo)

          let encomendaEditada

          const encomendaMap = mapEncomendaEditarDTOParaDB(data)
          if(Object.keys(encomendaMap).length){
               encomendaEditada = await this.repository.editar(encomendaExiste.data.id, encomendaMap)
               assertPersistencia(encomendaEditada, CODIGOS_ERRO.ENCOMENDA_EDITAR_ERR)
          }

          if (data.materiais) {
               this.excluirMateriaisDaEncomenda(encomendaExiste.data.id)
               this.inserirMateriaisDaEncomenda(encomendaExiste.data.id, data.materiais)
          }

          return encomendaEditada
     }

     async excluir(encomenda_codigo: string) {
          const encomendaExiste = await this.repository.listarPorCodigo(encomenda_codigo)
          assertResultadoExiste(encomendaExiste, CODIGOS_ERRO.ENCOMENDA_N_EXISTE_ERR, encomenda_codigo)

          const encomendaExcluida = await this.repository.excluir(encomendaExiste.data.id)
          assertPersistencia(encomendaExcluida, CODIGOS_ERRO.ENCOMENDA_EXCLUIR_ERR, encomendaExiste.data.id)

          await this.excluirMateriaisDaEncomenda(encomendaExiste.data.id)

          return encomendaExcluida
     }
}