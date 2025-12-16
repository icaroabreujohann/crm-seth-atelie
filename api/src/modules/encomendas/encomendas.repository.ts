import { sql } from '../../config/db'
import { CriarEncomendaRepoDTO, EditarEncomendaDTO, Encomenda } from './encomendas.types'
import { ResultadoBusca } from '../../shared/types'
import { resultadoEncontrado, resultadoInexistente } from '../../utils/resultadoBusca'
import { normalizaTexto, normalizaUndefined } from '../../utils/normalizadores'

export class EncomendasRepository {
    async listar(): Promise<Encomenda[]> {
        return await sql<Encomenda[]>`
            select
                e.*,
                c.nome as cliente_nome,
                p.nome as produto_nome

            from encomendas e
            join clientes c
                on c.id = e.cliente_id
            join produtos p
                on p.id = e.produto_id
        `
    }

    async listarEncomendaPorCodigo(codigo: string): Promise<ResultadoBusca<Encomenda>> {
        const [encomenda] = await sql<Encomenda[]>`
            select
                e.*,
                c.nome as cliente_nome,
                p.nome as produto_nome

            from encomendas e
            join clientes c
                on c.id = e.cliente_id
            join produtos p
                on p.id = e.produto_id
            where e.codigo = ${codigo}
        `
        return encomenda ? resultadoEncontrado(encomenda) : resultadoInexistente()
    }

    async listarEncomendaPorId(id: number): Promise<ResultadoBusca<Encomenda>> {
        const [encomenda] = await sql<Encomenda[]>`
                        select * from encomendas
                        where id = ${id}
                   `
        return encomenda ? resultadoEncontrado(encomenda) : resultadoInexistente()
    }

    async criar(data: CriarEncomendaRepoDTO): Promise<ResultadoBusca<Encomenda>> {
        const [encomenda] = await sql<Encomenda[]>`
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
        return encomenda ? resultadoEncontrado(encomenda) : resultadoInexistente()
    }

async editar(id: number, data: EditarEncomendaDTO): Promise<Encomenda | null> {
    const [encomenda] = await sql<Encomenda[]>`
        update encomendas
        set observacoes         = COALESCE(${normalizaTexto(data.observacoes)}, observacoes),
            pagamento_realizado = COALESCE(${normalizaUndefined(data.pagamento_realizado)}, pagamento_realizado),
            pagamento_forma     = COALESCE(${normalizaTexto(data.pagamento_forma)}, pagamento_forma),
            finalizado          = COALESCE(${normalizaUndefined(data.finalizado)}, finalizado),
            entregue            = COALESCE(${normalizaUndefined(data.entregue)}, entregue),
            local_entrega       = COALESCE(${normalizaTexto(data.local_entrega)}, local_entrega),
            data_pedido         = COALESCE(${data.data_pedido}, data_pedido),
            data_prazo          = COALESCE(${data.data_prazo}, data_prazo)
        where id = ${id}
        returning *
    `
    return encomenda ?? null
}


    async excluir(id: number): Promise<Encomenda | null> {
        const [encomenda] = await sql<Encomenda[]>`
            delete from encomendas
            where id = ${id}
            returning *
        `

        return encomenda ?? null
    }
}