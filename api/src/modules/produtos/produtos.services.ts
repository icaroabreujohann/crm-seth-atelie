import { randomUUID } from 'crypto'
import { CriarProdutoDTO, EditarProdutoDTO } from '../../types/produtos'
import { CODIGOS_ERRO } from '../../utils/codigosRespostas'
import { ProdutosRepository } from './produtos.repository'
import { PRODUTOS_DIR } from '../../infra/upload/paths'
import { salvarFotosProduto } from '../../infra/upload/produtos.salvarfotos'
import { excluirPasta } from '../../utils/filesystem/excluirPasta'
import { assertResultadoExiste } from '../../shared/asserts/assertResultadoBusca'


export class ProdutosService {
     private repository = new ProdutosRepository()

     private async gerarCodigoProdutoUnico(): Promise<string> {
          let codigo = randomUUID()
          let produtoExiste = await this.repository.obterProdutoPorCodigo(codigo)

          while (produtoExiste.existe) {
               codigo = randomUUID()
               produtoExiste = await this.repository.obterProdutoPorCodigo(codigo)
          }

          return codigo
     }

     async listar() {
          return await this.repository.listar()
     }

     async listarPorCodigo(codigo: string) {
          const produto = await this.repository.listarPorCodigo(codigo)

          assertResultadoExiste(produto, CODIGOS_ERRO.PRODUTO_N_EXISTE_ERR, codigo)
          return produto
     }

     async criarProduto(data: CriarProdutoDTO, fotos: Express.Multer.File[]) {
          const codigo: string = await this.gerarCodigoProdutoUnico()
          const fotos_url = `arquivos/produtos/${codigo}`

          await salvarFotosProduto(codigo, fotos, PRODUTOS_DIR)

          return await this.repository.criar({ ...data, codigo, fotos_url })
     }

     async editarProduto(codigo: string, data: EditarProdutoDTO) {
          const produto = await this.repository.obterProdutoPorCodigo(codigo)

          assertResultadoExiste(produto, CODIGOS_ERRO.PRODUTO_N_EXISTE_ERR, codigo)

          return await this.repository.editar(produto.data.id, data)
     }

     async excluirProduto(codigo: string) {
          const produto = await this.repository.obterProdutoPorCodigo(codigo)

          assertResultadoExiste(produto, CODIGOS_ERRO.PRODUTO_N_EXISTE_ERR, codigo)
          await excluirPasta(PRODUTOS_DIR, codigo)

          return await this.repository.excluir(produto.data.id)
     }
}