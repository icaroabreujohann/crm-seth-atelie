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


export class ProdutosService {
     constructor(
          private repository = new ProdutosRepository(),
          private repositoryMateriais = new ProdutoMaterialRepository()
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

          const produtoCompleto = { produto: produtoMap, materiais }
          return produtoCompleto
     }

     async criarProduto(data: CriarProdutoDTO, fotos: FotoWEBP[]) {
          const codigo: string = await this.gerarCodigoProdutoUnico()
          const fotos_url = `${PRODUTOS_DIR_API}/${codigo}`

          const produtoMap = mapCriarProdutoDTOParaDB(data, codigo, fotos_url)

          await salvarFotosProduto(codigo, fotos, PRODUTOS_DIR)
          return await this.repository.criar(produtoMap)
     }

     async editarProduto(codigo: string, data: EditarProdutoDTO) {
          const produto = await this.repository.listarProdutoPorCodigo(codigo)
          assertResultadoExiste(produto, CODIGOS_ERRO.PRODUTO_N_EXISTE_ERR, codigo)

          const produtoMap = mapEditarProdutoDTOparaDB(data)
          return await this.repository.editar(produto.data.id, produtoMap)
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
          await excluirPasta(PRODUTOS_DIR, codigo)

          return await this.repository.excluir(produto.data.id)
     }
}