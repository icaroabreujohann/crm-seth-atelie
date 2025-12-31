import { randomUUID } from 'crypto'
import { CriarProdutoDTO, EditarProdutoDTO } from './produtos.types'
import { CODIGOS_ERRO } from '../../utils/respostas/codigos-resposta'
import { ProdutosRepository } from './produtos.repository'
import { PRODUTOS_DIR, PRODUTOS_DIR_API } from '../../infra/upload/paths'
import { editarFotosProduto as editarFotosProdutoFS, salvarFotosProduto } from '../../infra/upload/produtos.salvarfotos'
import { excluirPasta } from '../../infra/filesystem/excluir-pasta'
import { assertResultadoExiste } from '../../shared/asserts/assertResultadoBusca'
import { ProdutoMaterialRepository } from './materiais/produtoMaterial.repository'
import { FotoWEBP } from '../../infra/filesystem/converte-fotos'
import { mapCriarProdutoDTOParaDB, mapEditarProdutoDTOparaDB, mapProdutoDBParaView } from './produtos.mapper'
import { ProdutoMaterialService } from './materiais/produtoMaterial.services'
import { assertPersistencia } from '../../shared/asserts/assertPersistencia'
import { ProdutoMaterialCriarDTO } from './materiais/produtoMaterial.types'


export class ProdutosService {
     constructor(
          private repository = new ProdutosRepository(),
          private repositoryMateriais = new ProdutoMaterialRepository(),
          private servicesMateriais = new ProdutoMaterialService()
     ) { }

     private async gerarCodigoProdutoUnico(): Promise<string> {
          let codigo = randomUUID()
          let produtoExiste = await this.repository.listarProdutoPorCodigo(codigo)

          while (produtoExiste.existe) {
               codigo = randomUUID()
               produtoExiste = await this.repository.listarProdutoPorCodigo(codigo)
          }

          return codigo
     }

     private async inserirMateriaisDoProduto(produto_id: number, materiais: ProdutoMaterialCriarDTO[]): Promise<void> {
          if (!materiais.length) return

          for (const material of materiais) {
               await this.servicesMateriais.adicionarMaterial(produto_id, material)
          }
     }

     private async excluirMateriaisDoProduto(produto_id: number): Promise<void> {
          await this.repositoryMateriais.excluirPorProduto(produto_id)
     }

     async listar() {
          const produtos = await this.repository.listar()
          const produtosMap = produtos.map(mapProdutoDBParaView)
          return produtosMap
     }

     async listarPorCodigo(codigo: string) {
          const produto = await this.repository.listarProdutoPorCodigo(codigo)
          assertResultadoExiste(produto, CODIGOS_ERRO.PRODUTO_N_EXISTE_ERR, codigo)

          const produtoMap = mapProdutoDBParaView(produto.data)
          return produtoMap
     }

     async listarCompleto(codigo: string) {
          const produto = await this.repository.listarProdutoPorCodigo(codigo)
          assertResultadoExiste(produto, CODIGOS_ERRO.PRODUTO_N_EXISTE_ERR, codigo)

          const produtoMap = mapProdutoDBParaView(produto.data)

          const materiais = await this.repositoryMateriais.listarMaterialPorProduto(produto.data.id)
          const materiaisMapeados = materiais?.data ?? []

          return {
               ...produtoMap,
               materiais: materiaisMapeados
          }
     }

     async criarProduto(data: CriarProdutoDTO, fotos: FotoWEBP[]) {
          const codigo: string = await this.gerarCodigoProdutoUnico()
          const fotos_url = `${PRODUTOS_DIR_API}/${codigo}`

          const produtoMap = mapCriarProdutoDTOParaDB(data, codigo, fotos_url)


          const produtoCriado = await this.repository.criar(produtoMap)
          assertPersistencia(produtoCriado, CODIGOS_ERRO.PRODUTO_CRIAR_ERR)

          await this.inserirMateriaisDoProduto(produtoCriado.id, data.materiais)

          await salvarFotosProduto(codigo, fotos, PRODUTOS_DIR)
          return produtoCriado
     }

     async editarProduto(codigo: string, data: EditarProdutoDTO) {
          const produto = await this.repository.listarProdutoPorCodigo(codigo)
          assertResultadoExiste(produto, CODIGOS_ERRO.PRODUTO_N_EXISTE_ERR, codigo)

          const produtoMap = mapEditarProdutoDTOparaDB(data)
          const produtoEditado = await this.repository.editar(produto.data.id, produtoMap)
          assertPersistencia(produtoEditado, CODIGOS_ERRO.PRODUTO_EDITAR_ERR)

          if (data.materiais) {
               await this.excluirMateriaisDoProduto(produtoEditado.id)
               await this.inserirMateriaisDoProduto(produtoEditado.id, data.materiais)
          }

          return produtoEditado
     }

     async editarFotosProduto(codigo: string, fotos: FotoWEBP[]) {
          const produto = await this.repository.listarProdutoPorCodigo(codigo)
          assertResultadoExiste(produto, CODIGOS_ERRO.PRODUTO_N_EXISTE_ERR, codigo)
          await editarFotosProdutoFS(codigo, fotos, PRODUTOS_DIR)
          return produto
     }

     async excluirProduto(codigo: string) {
          const produto = await this.repository.listarProdutoPorCodigo(codigo)
          assertResultadoExiste(produto, CODIGOS_ERRO.PRODUTO_N_EXISTE_ERR, codigo)

          await this.excluirMateriaisDoProduto(produto.data.id)

          const produtoExcluido = await this.repository.excluir(produto.data.id)
          assertPersistencia(produtoExcluido, CODIGOS_ERRO.PRODUTO_EXCLUIR_ERR)

          await excluirPasta(PRODUTOS_DIR, codigo)

          return produtoExcluido
     }
}