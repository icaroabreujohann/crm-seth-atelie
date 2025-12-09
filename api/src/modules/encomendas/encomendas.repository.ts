import { sql } from '../../config/db'
import { CriarEncomendaRepoDTO, EditarEncomendaDTO, Encomenda } from './encomendas.types'
import { ResultadoBusca } from '../../shared/types'
import { resultadoEncontrado, resultadoInexistente } from '../../utils/resultadoBusca'
import { normalizaTexto } from '../../utils/normalizaTexto'

export class EncomendasRepository {
    async listar(): Promise<Encomenda[]> {
        return await sql<Encomenda[]>`
            select *
            from encomendas`
    }

    async listarPorCodigo(codigo: string): Promise<ResultadoBusca<Encomenda>> {
        const [encomenda] = await sql<Encomenda[]>`
                        select * from encomendas
                        where codigo = ${codigo}
                   `
        return encomenda ? resultadoEncontrado(encomenda) : resultadoInexistente()
    }

    async listarPorId(id: number): Promise<ResultadoBusca<Encomenda>> {
        const [encomenda] = await sql<Encomenda[]>`
                        select * from encomendas
                        where id = ${id}
                   `
        return encomenda ? resultadoEncontrado(encomenda) : resultadoInexistente()
    }

    async criar(data: CriarEncomendaRepoDTO): Promise<Encomenda | null> {
        const [encomenda] = await sql<Encomenda[]>`
            insert into encomendas(cliente_id, produto_id, observacoes, pagamento_realizado, pagamento_forma,finalizado, entregue, local_entrega, data_pedido)
            values (
                ${data.cliente_id},
                ${data.produto_id},
                ${normalizaTexto(data.observacoes)},
                ${data.pagamento_realizado ?? false},
                ${normalizaTexto(data.pagamento_forma)},
                ${data.finalizado ?? false},
                ${data.entregue ?? false},
                ${normalizaTexto(data.local_entrega)},
                ${(data.data_pedido ?? new Date())}
                )
            returning *
        `
        return encomenda ?? null
    }

    async editar(id: number, data: EditarEncomendaDTO): Promise<Encomenda | null> {
        const [encomenda] = await sql<Encomenda[]>`
            update encomendas
            set observacoes         = COALESCE(${normalizaTexto(data.observacoes)}, ''),
                pagamento_realizado = COALESCE(${data.pagamento_realizado}, false),
                pagamento_forma     = COALESCE(${normalizaTexto(data.pagamento_forma)}, ''),
                finalizado          = COALESCE(${data.finalizado}, false),
                entregue            = COALESCE(${data.entregue}, false),
                local_entrega       = COALESCE(${normalizaTexto(data.local_entrega)}, ''),
                data_pedido         =          ${data.data_pedido},
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