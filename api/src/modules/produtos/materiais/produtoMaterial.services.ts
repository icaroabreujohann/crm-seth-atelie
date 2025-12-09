import { ProdutoMaterialRepository } from './produtoMaterial.repository'
import { ProdutosRepository } from '../produtos.repository'
import { MateriaisRepository } from '../../materiais/materiais.repository'
import { CriarProdutoMaterialDTO, EditarProdutoMaterialDTO } from './produtoMaterial.types'
import { assertResultadoExiste } from '../../../shared/asserts/assertResultadoBusca'
import { CODIGOS_ERRO } from '../../../utils/codigosRespostas'
import { validaRegraNegocio } from '../../../shared/validators/valida.regranegocio'

export class ProdutoMaterialService {
     private repository = new ProdutoMaterialRepository()
     private repositoryMaterial = new MateriaisRepository()
     private repositoryProdutos = new ProdutosRepository()

     async listarMaterialPorProduto(produto_codigo: string) {
          const produto = await this.repositoryProdutos.obterProdutoPorCodigo(produto_codigo)
          assertResultadoExiste(produto, CODIGOS_ERRO.PRODUTO_N_EXISTE_ERR, produto_codigo)

          return await this.repository.listarPorProduto(produto.data.id)
     }

     async adicionarMaterial(produto_codigo: string, data: CriarProdutoMaterialDTO) {
          const produto = await this.repositoryProdutos.obterProdutoPorCodigo(produto_codigo)
          assertResultadoExiste(produto, CODIGOS_ERRO.PRODUTO_N_EXISTE_ERR, produto_codigo)

          const material = await this.repositoryMaterial.obterMaterialPorCodigo(data.material_codigo)
          assertResultadoExiste(material, CODIGOS_ERRO.MATERIAL_N_EXISTE_ERR, data.material_codigo)

          const materialProduto = {
               produto_id: produto.data.id,
               material_id: material.data.id,
               quantidade: data.quantidade,
               preco_final: material.data.preco_x_qtd * data.quantidade
          }
          return await this.repository.criar(materialProduto)
     }

     async editarMaterial(produto_codigo: string, id: number, data: EditarProdutoMaterialDTO) {
          const produto = await this.repositoryProdutos.obterProdutoPorCodigo(produto_codigo)
          assertResultadoExiste(produto, CODIGOS_ERRO.PRODUTO_N_EXISTE_ERR, produto_codigo)

          const materialProduto = await this.repository.obterMaterialProdutoPorId(id)
          assertResultadoExiste(materialProduto, CODIGOS_ERRO.PRODUTO_MATERIAL_N_EXISTE_ERRO, produto_codigo)

          const material = await this.repositoryMaterial.obterMaterialPorId(materialProduto.data.material_id)
          assertResultadoExiste(material, CODIGOS_ERRO.MATERIAL_N_EXISTE_ERR, materialProduto.data.material_id)

          validaRegraNegocio([{ condicao: materialProduto.data.produto_id != produto.data.id, valor: materialProduto, codigoResposta: CODIGOS_ERRO.PRODUTO_MATERIAL_N_CORRESPONDE_ERRO }])

          const dataMaterial = { quantidade: data.quantidade, preco_final: material.data.preco_x_qtd * data.quantidade }
          return await this.repository.editar(id, dataMaterial)
     }

     async excluirMaterial(produto_codigo: string, id: number) {
          const produto = await this.repositoryProdutos.obterProdutoPorCodigo(produto_codigo)
          assertResultadoExiste(produto, CODIGOS_ERRO.PRODUTO_N_EXISTE_ERR, produto_codigo)

          const materialProduto = await this.repository.obterMaterialProdutoPorId(id)
          assertResultadoExiste(materialProduto, CODIGOS_ERRO.PRODUTO_MATERIAL_N_EXISTE_ERRO, id)

          validaRegraNegocio([{ condicao: materialProduto.data.produto_id != produto.data.id, valor: materialProduto, codigoResposta: CODIGOS_ERRO.PRODUTO_MATERIAL_N_CORRESPONDE_ERRO }])

          return await this.repository.excluir(id)
     }
}