import { randomUUID } from 'crypto'
import { EncomendasRepository } from './encomendas.repository'
import { ProdutosRepository } from '../produtos/produtos.repository'
import { ClientesRepository } from '../clientes/clientes.repository'
import { assertResultadoExiste } from '../../shared/asserts/assertResultadoBusca'
import { CODIGOS_ERRO } from '../../utils/codigosRespostas'
import { CriarEncomendaDTO, EditarEncomendaDTO } from './encomendas.types'
import { adicionarDias } from '../../utils/adicionarDias'
import { EncomendaMaterialRepository } from './materiais/encomendaMaterial.repository'
import { ProdutoMaterialRepository } from '../produtos/materiais/produtoMaterial.repository'
import { CriarEncomendaMaterialRepoDTO } from './materiais/encomendaMaterial.types'

export class EncomendasServices {
     private repository = new EncomendasRepository()
     private repositoryProduto = new ProdutosRepository()
     private repositoryClientes = new ClientesRepository()
     private repositoryEncomendaMaterial = new EncomendaMaterialRepository()
     private repositoryProdutoMaterial = new ProdutoMaterialRepository()

     private async gerarCodigoEncomendaUnico(): Promise<string> {
          let codigo = randomUUID()
          let encomendaExiste = await this.repository.listarEncomendaPorCodigo(codigo)

          while (encomendaExiste.existe) {
               codigo = randomUUID()
               encomendaExiste = await this.repository.listarEncomendaPorCodigo(codigo)
          }

          return codigo
     }

     async listar() {
          return await this.repository.listar()
     }

     async listarPorCodigo(codigo: string) {
          const encomenda = await this.repository.listarEncomendaPorCodigo(codigo)
          assertResultadoExiste(encomenda, CODIGOS_ERRO.ENCOMENDA_N_EXISTE_ERR, codigo)

          return encomenda
     }

     async listarCompleta(codigo: string) {
          const encomenda = await this.repository.listarEncomendaPorCodigo(codigo)
          assertResultadoExiste(encomenda, CODIGOS_ERRO.ENCOMENDA_N_EXISTE_ERR, codigo)

          const materiais = await this.repositoryEncomendaMaterial.listarMateriaisPorEncomenda(encomenda.data.id)

          return {...encomenda, materiais}
     }

     async criarEncomenda(data: CriarEncomendaDTO) {
          const codigo = await this.gerarCodigoEncomendaUnico()

          const produto = await this.repositoryProduto.listarProdutoPorCodigo(data.produto_codigo)
          assertResultadoExiste(produto, CODIGOS_ERRO.PRODUTO_N_EXISTE_ERR, data.produto_codigo)

          const produto_materiais = await this.repositoryProdutoMaterial.listarMaterialPorProduto(produto.data.id)
          assertResultadoExiste(produto_materiais, CODIGOS_ERRO.PRODUTO_MATERIAL_N_EXISTE_ERRO, data.produto_codigo)

          const cliente = await this.repositoryClientes.listarPorId(data.cliente_id)
          assertResultadoExiste(cliente, CODIGOS_ERRO.CLIENTE_N_EXISTE_ERR, data.cliente_id)

          const encomenda = {
               ...data,
               codigo,
               produto_id: produto.data.id,
               cliente_id: cliente.data.id,
               data_prazo: adicionarDias(data.data_pedido, 20)
          }


          const encomendaCriada = await this.repository.criar(encomenda)
          assertResultadoExiste(encomendaCriada, CODIGOS_ERRO.ENCOMENDA_CRIAR_ERR, encomenda)

          const encomendaMateriais: CriarEncomendaMaterialRepoDTO[] =
               produto_materiais.data.map((m): CriarEncomendaMaterialRepoDTO => ({
                    encomenda_id: encomendaCriada.data.id,
                    material_id: m.id,
                    quantidade: m.quantidade,
                    preco_final: m.preco_final
               }));


          await Promise.all(
               encomendaMateriais.map(m => this.repositoryEncomendaMaterial.criar(m))
          )

          return encomendaCriada
     }

     async editarEncomenda(codigo: string, data: EditarEncomendaDTO) {
          const encomenda = await this.repository.listarEncomendaPorCodigo(codigo)
          assertResultadoExiste(encomenda, CODIGOS_ERRO.ENCOMENDA_N_EXISTE_ERR, codigo)

          if (data.data_pedido && !data.data_prazo) data = { ...data, data_prazo: adicionarDias(data.data_pedido, 20) }

          return await this.repository.editar(encomenda.data.id, data)
     }

     async excluirEncomenda(codigo: string) {
          const encomenda = await this.repository.listarEncomendaPorCodigo(codigo)
          assertResultadoExiste(encomenda, CODIGOS_ERRO.ENCOMENDA_N_EXISTE_ERR, codigo)

          return await this.repository.excluir(encomenda.data.id)
     }
}