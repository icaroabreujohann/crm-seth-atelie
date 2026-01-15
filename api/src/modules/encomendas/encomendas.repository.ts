import { sql } from '../../config/db'
import { ResultadoBusca } from '../../shared/types';
import { normalizaTexto } from '../../utils/normalizadores';
import { resultadoEncontrado, resultadoInexistente } from '../../utils/resultadoBusca';
import { EncomendaCriarDB, EncomendaDB, EncomendaEditarDB, EncomendaView } from './encomendas.types';

export class EncomendasRepository {
     private selectEncomendaView = sql`
          select
               em.*,
               p.codigo as produto_codigo,
               p.nome as produto_nome,
               c.nome as cliente_nome
          from encomendas em
          join produtos p
               on p.id = em.produto_id
          join clientes c 
               on c.id = em.cliente_id
     `


     async listar(): Promise<EncomendaView[]> {
          return await sql<EncomendaView[]>`
               ${this.selectEncomendaView}
               order by em.id desc
          `
     }

     async listarPorId(id: number): Promise<ResultadoBusca<EncomendaView>> {
          const [encomenda] = await sql<EncomendaView[]>`
               ${this.selectEncomendaView}
               where em.id = ${id}
          `

          return encomenda ? resultadoEncontrado(encomenda) : resultadoInexistente()
     }

     async listarPorCodigo(codigo: string): Promise<ResultadoBusca<EncomendaView>> {
          const [encomenda] = await sql<EncomendaView[]>`
               ${this.selectEncomendaView}
               where em.codigo = ${codigo}
          `

          return encomenda ? resultadoEncontrado(encomenda) : resultadoInexistente()
     }

     async criar(data: EncomendaCriarDB): Promise<EncomendaDB | null> {
          const [encomenda] = await sql<EncomendaDB[]>`
               insert into encomendas(codigo, cliente_id, produto_id, observacoes, pagamento_realizado, pagamento_forma,finalizado, entregue, local_entrega, data_pedido, data_prazo)
               values (
                    ${data.codigo},
                    ${data.cliente_id},
                    ${data.produto_id},
                    ${normalizaTexto(data.observacoes)},
                    ${data.pagamento_realizado ?? false},
                    ${normalizaTexto(data.pagamento_forma)},
                    ${data.finalizado ?? false},
                    ${data.entregue ?? false},
                    ${normalizaTexto(data.local_entrega)},
                    ${(data.data_pedido ?? new Date())},
                    ${data.data_prazo}
                    )
               returning *
          `
          return encomenda ?? null
     }

     async editar(id: number, data: EncomendaEditarDB): Promise<EncomendaDB | null> {
          if (!Object.keys(data).length) {
               return null
          }
          const [encomenda] = await sql<EncomendaDB[]>`
               update encomendas
               set
                    ${sql(data)},
                    data_alteracao = now()
               where id = ${id}
               returning *
          `

          return encomenda ?? null
     }

     async excluir(id: number): Promise<EncomendaDB | null> {
          const [encomenda] = await sql<EncomendaDB[]>`
               delete from encomendas
               where id = ${id}
               returning *
          `

          return encomenda ?? null
     }
}