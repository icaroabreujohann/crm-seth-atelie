import { randomUUID } from 'crypto'
import { CriarProdutoDTO, EditarProdutoDTO } from './produtos.types'
import { CODIGOS_ERRO } from '../../utils/respostas/codigos-resposta'
import { ProdutosRepository } from './produtos.repository'
import { PRODUTOS_DIR } from '../../infra/upload/paths'
import { editarFotosProduto as editarFotosProdutoFS, salvarFotosProduto } from '../../infra/upload/produtos.salvarfotos'
import { excluirPasta } from '../../infra/filesystem/excluir-pasta'
import { assertResultadoExiste } from '../../shared/asserts/assertResultadoBusca'
import { ProdutoMaterialRepository } from './materiais/produtoMaterial.repository'


export class ProdutosService {
     private repository = new ProdutosRepository()
     private repositoryMateriais = new ProdutoMaterialRepository()

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
          return await this.repository.listar()
     }

     async listarPorCodigo(codigo: string) {
          const produto = await this.repository.listarProdutoPorCodigo(codigo)

          assertResultadoExiste(produto, CODIGOS_ERRO.PRODUTO_N_EXISTE_ERR, codigo)
          return produto
     }

     async listarCompleto(codigo: string) {
          const produto = await this.repository.listarProdutoPorCodigo(codigo)
          assertResultadoExiste(produto, CODIGOS_ERRO.PRODUTO_N_EXISTE_ERR, codigo)

          const materiais = await this.repositoryMateriais.listarMaterialPorProduto(produto.data.id)

          const produtoCompleto = { ...produto, materiais }
          return produtoCompleto
     }

     async criarProduto(data: CriarProdutoDTO, fotos: Express.Multer.File[]) {
          const codigo: string = await this.gerarCodigoProdutoUnico()
          const fotos_url = `${PRODUTOS_DIR}/${codigo}`

          await salvarFotosProduto(codigo, fotos, PRODUTOS_DIR)

          return await this.repository.criar({ ...data, codigo, fotos_url })
     }

     async editarProduto(codigo: string, data: EditarProdutoDTO) {
          const produto = await this.repository.listarProdutoPorCodigo(codigo)

          assertResultadoExiste(produto, CODIGOS_ERRO.PRODUTO_N_EXISTE_ERR, codigo)
          return await this.repository.editar(produto.data.id, data)
     }

     async editarFotosProduto(codigo: string, fotos: Express.Multer.File[]) {
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