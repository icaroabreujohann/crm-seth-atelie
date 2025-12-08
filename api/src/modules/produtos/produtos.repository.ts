import { sql } from "../../config/db";
import { ResultadoBusca } from "../../shared/types";
import { resultadoEncontrado, resultadoInexistente } from '../../utils/resultadoBusca'
import { CriarProdutoDTO, EditarProdutoDTO, Produto } from "./produtos.types";
import { normalizaTexto } from "../../utils/normalizaTexto";

export class ProdutosRepository {
     async listar(): Promise<Produto[]> {
          return await sql`select * from produtos`
     }

     async listarPorCodigo(codigo: string): Promise<ResultadoBusca<Produto>> {
          const [produto] = await sql<Produto[]>`
               select * from produtos
               where codigo = ${codigo}
               limit 1
          `

          return produto ? resultadoEncontrado(produto) : resultadoInexistente()
     }

     async criar(data: CriarProdutoDTO): Promise<Produto | null> {
          const [produto] = await sql<Produto[]>`
               insert into produtos(nome, codigo, preco, tempo_medio, fotos_url)
               values(
                    ${data.nome},
                    ${data.codigo},
                    ${data.preco},
                    ${normalizaTexto(data.tempo_medio)},
                    ${data.fotos_url}
               )
               returning *
          `

          return produto ?? null
     }

     async editar(id: number, data: EditarProdutoDTO): Promise<Produto | null> {
          const [produto] = await sql<Produto[]>`
               update produtos
               set
                    nome        = coalesce(${data.nome}, nome),
                    preco       = coalesce(${data.preco}, preco),
                    tempo_medio = coalesce(${normalizaTexto(data.tempo_medio)}, tempo_medio),
                    data_alteracao = now()
               where id = ${id}
               returning *
               `

          return produto ?? null
     }

     async excluir(id: number): Promise<Produto | null> {
          const [produtoExcluido] = await sql<Produto[]>`
               delete from produtos
               where id = ${id}
               returning *
          `
          return produtoExcluido ?? null
     }

     //

     async obterProdutoPorCodigo(codigo: string): Promise<ResultadoBusca<Produto>> {
          const [produto] = await sql<Produto[]>`
                    select * from produtos
                    where codigo = ${codigo}
               `
          return produto ? resultadoEncontrado(produto) : resultadoInexistente()
     }

     async obterProdutoPorId(id: number): Promise<ResultadoBusca<Produto>> {
          const [produto] = await sql<Produto[]>`
                    select * from produtos
                    where id = ${id}
               `
          return produto ? resultadoEncontrado(produto) : resultadoInexistente()
     }
}