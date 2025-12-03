import { sql } from "../../config/db";
import { CriarProdutoDTO, EditarProdutoDTO, Produto } from "../../types/produtos";
import { verificaResultadoExiste } from "../../types/verifica.resultado.existe";
import { normalizaTexto } from "../../utils/normalizaTexto";

export class ProdutosRepository {
     async listar(): Promise<Produto[]> {
          return await sql`select * from produtos`
     }

     async listarPorId(id: number): Promise<Produto | null> {
          const [produto] = await sql<Produto[]>`
               select * from produtos
               where id = ${id}
               limit 1
          `

          return produto ?? null
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

     async obterProdutoPorCodigo(codigo: string): Promise<verificaResultadoExiste<Produto>> {
          const [produto] = await sql<Produto[]>`
                    select * from produtos
                    where codigo = ${codigo}
               `
          return {
               existe: !!produto,
               data: produto ?? null,
               campo: 'codigo',
          }
     }

     async obterProdutoPorId(id: number): Promise<verificaResultadoExiste<Produto>> {
          const [produto] = await sql<Produto[]>`
                    select * from produtos
                    where id = ${id}
               `
          return {
               existe: !!produto,
               data: produto ?? null,
               campo: 'Id',
          }
     }
}