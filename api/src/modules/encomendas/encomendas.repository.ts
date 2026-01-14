import { sql } from '../../config/db'
import { ResultadoBusca } from '../../shared/types';
import { normalizaTexto } from '../../utils/normalizadores';
import { resultadoEncontrado, resultadoInexistente } from '../../utils/resultadoBusca';
import { EncomendaCriarDB, EncomendaView } from './encomendas.types';

export class EncomendasRepository {
     async listar(): Promise<EncomendaView[]> {
          return await sql<EncomendaView[]>`
               select
                    em.*,
                    p.nome as produto_nome,
                    c.nome as cliente_nome
               from encomendas em
               join produtos p
                    on p.id = em.produto_id
               join clientes c 
                    on c.id = em.cliente_id
               order by em.id desc
          `
     }

     async listarPorId(id: number): Promise<ResultadoBusca<EncomendaView>> {
          const [encomenda] = await sql<EncomendaView[]>`
          select
                    em.*,
                    p.nome as produto_nome,
                    c.nome as cliente_nome
               from encomendas em
               join produtos p
                    on p.id = em.produto_id
               join clientes c 
                    on c.id = em.cliente_id
               where em.id = ${id}
          `

          return encomenda ? resultadoEncontrado(encomenda) : resultadoInexistente()
     }

     async listarPorCodigo(codigo: string): Promise<ResultadoBusca<EncomendaView>> {
          const [encomenda] = await sql<EncomendaView[]>`
          select
                    em.*,
                    p.nome as produto_nome,
                    c.nome as cliente_nome
               from encomendas em
               join produtos p
                    on p.id = em.produto_id
               join clientes c 
                    on c.id = em.cliente_id
               where em.codigo = ${codigo}
          `

          return encomenda ? resultadoEncontrado(encomenda) : resultadoInexistente()
     }

     async criar(data: EncomendaCriarDB): Promise<EncomendaView | null> {
          const [encomenda] = await sql<EncomendaView[]>`
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

     async excluir(id: number): Promise<EncomendaView | null> {
          const [encomenda] = await sql<EncomendaView[]>`
               delete from encomendas
               where id = ${id}
               returning *
          `

          return encomenda ?? null
     }
}