import { randomUUID } from 'crypto'
import { EncomendasRepository } from './encomendas.repository'
import { ProdutosRepository } from '../produtos/produtos.repository'
import { ClientesRepository } from '../clientes/clientes.repository'
import { assertResultadoExiste } from '../../shared/asserts/assertResultadoBusca'
import { CODIGOS_ERRO } from '../../utils/codigosRespostas'
import { CriarEncomendaDTO, EditarEncomendaDTO } from './encomendas.types'

export class EncomendasServices {
     private repository = new EncomendasRepository()
     private repositoryProduto = new ProdutosRepository()
     private repositoryClientes = new ClientesRepository()

     private async gerarCodigoProdutoUnico(): Promise<string> {
          let codigo = randomUUID()
          let encomendaExiste = await this.repository.listarPorCodigo(codigo)

          while (encomendaExiste.existe) {
               codigo = randomUUID()
               encomendaExiste = await this.repository.listarPorCodigo(codigo)
          }

          return codigo
     }

     async listar() {
          return await this.repository.listar()
     }

     async listarPorCodigo(codigo: string) {
          const encomenda = await this.repository.listarPorCodigo(codigo)
          assertResultadoExiste(encomenda, CODIGOS_ERRO.ENCOMENDA_N_EXISTE_ERR, codigo)

          return encomenda
     }

     async criarEncomenda(data: CriarEncomendaDTO) {
          const codigo = await this.gerarCodigoProdutoUnico()

          const produto = await this.repositoryProduto.listarPorCodigo(data.produto_codigo)
          assertResultadoExiste(produto, CODIGOS_ERRO.PRODUTO_N_EXISTE_ERR, data.produto_codigo)

          const cliente = await this.repositoryClientes.listarPorId(data.cliente_id)
          assertResultadoExiste(cliente, CODIGOS_ERRO.CLIENTE_N_EXISTE_ERR, data.cliente_id)
          
          return this.repository.criar({...data, codigo, produto_id: produto.data.id})
     }

     async editarEncomenda(codigo: string, data: EditarEncomendaDTO){
          const encomenda = await this.repository.listarPorCodigo(codigo)
          assertResultadoExiste(encomenda, CODIGOS_ERRO.ENCOMENDA_N_EXISTE_ERR, codigo)

          return this.repository.editar(encomenda.data.id, data)
     }

     async excluirEncomenda(codigo: string) {
          const encomenda = await this.repository.listarPorCodigo(codigo)
          assertResultadoExiste(encomenda, CODIGOS_ERRO.ENCOMENDA_N_EXISTE_ERR, codigo)

          return this.repository.excluir(encomenda.data.id)
     }
}