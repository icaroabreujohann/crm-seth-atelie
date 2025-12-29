import { sql } from "../../config/db";
import { ResultadoBusca } from "../../shared/types";
import { resultadoEncontrado, resultadoInexistente } from '../../utils/resultadoBusca'
import { CriarProdutoDB, CriarProdutoDTO, EditarProdutoDB, EditarProdutoDTO, ProdutoDB } from "./produtos.types";
import { normalizaTexto } from "../../utils/normalizadores";

export class ProdutosRepository {
     async listar(): Promise<ProdutoDB[]> {
          return await sql`select * from produtos`
     }

     async listarProdutoPorCodigo(codigo: string): Promise<ResultadoBusca<ProdutoDB>> {
          const [produto] = await sql<ProdutoDB[]>`
               select * from produtos
               where codigo = ${codigo}
               limit 1
          `

          return produto ? resultadoEncontrado(produto) : resultadoInexistente()
     }

     async listarProdutoPorId(id: number): Promise<ResultadoBusca<ProdutoDB>> {
          const [produto] = await sql<ProdutoDB[]>`
               select * from produtos
               where id = ${id}
               limit 1
          `

          return produto ? resultadoEncontrado(produto) : resultadoInexistente()
     }

     async criar(data: CriarProdutoDB): Promise<ProdutoDB | null> {
          const [produto] = await sql<ProdutoDB[]>`
               insert into produtos(nome, codigo, preco, tempo_medio, fotos_url)
               values(
                    ${data.nome},
                    ${data.codigo},
                    ${data.preco},
                    ${(data.tempo_medio)},
                    ${data.fotos_url}
               )
               returning *
          `

          return produto ?? null
     }

     async editar(id: number, data: EditarProdutoDB): Promise<ProdutoDB | null> {
          const [produto] = await sql<ProdutoDB[]>`
               update produtos
               set
                    nome        = coalesce(${data.nome}, nome),
                    preco       = coalesce(${data.preco}, preco),
                    tempo_medio = coalesce(${(data.tempo_medio)}, tempo_medio),
                    data_alteracao = now()
               where id = ${id}
               returning *
               `

          return produto ?? null
     }

     async excluir(id: number): Promise<ProdutoDB | null> {
          const [produtoExcluido] = await sql<ProdutoDB[]>`
               delete from produtos
               where id = ${id}
               returning *
          `
          return produtoExcluido ?? null
     }
}