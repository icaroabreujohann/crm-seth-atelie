import { CriarProdutoDTO, CriarProdutoDB, EditarProdutoDTO, EditarProdutoDB, ProdutoView, ProdutoDB } from './produtos.types'
import { converteHorasParaMinutos, converteMinutosParaHoras } from '../../utils/datas/converte-horas-minutos'

export const mapProdutoDBParaView = (produto: ProdutoDB): ProdutoView => ({
     id: produto.id,
     codigo: produto.codigo,
     nome: produto.nome,
     preco: produto.preco,
     fotos_url: produto.fotos_url,
     tempo_medio: converteMinutosParaHoras(produto.tempo_medio),
     data_criacao: produto.data_criacao,
     data_alteracao: produto.data_alteracao
})

export const mapCriarProdutoDTOParaDB = (
     data: CriarProdutoDTO,
     codigo: string,
     fotos_url: string
): CriarProdutoDB => ({
     nome: data.nome,
     preco: data.preco,
     codigo,
     fotos_url,
     tempo_medio: converteHorasParaMinutos(
          data.tempo_medio.horas,
          data.tempo_medio.minutos
     )
})

export const mapEditarProdutoDTOparaDB = (
     data: EditarProdutoDTO
): EditarProdutoDB => ({
     nome: data.nome,
     preco: data.preco,
     tempo_medio: converteHorasParaMinutos(
          data.tempo_medio.horas,
          data.tempo_medio.minutos
     )
})