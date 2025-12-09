import {sql} from '../../config/db'
import {CriarEncomendaRepoDTO, EditarEncomendaDTO, Encomenda} from './encomendas.types'
import {ResultadoBusca} from '../../shared/types'
import {resultadoEncontrado, resultadoInexistente} from '../../utils/resultadoBusca'
import {normalizaTexto} from '../../utils/normalizaTexto'

export class EncomendasRepository {
    async listarEncomendas(): Promise<Encomenda[]> {
        return await sql<Encomenda[]>`select *
                                      from encomendas`
    }

    async listarEncomendaPorCodigo(codigo: string): Promise<ResultadoBusca<Encomenda | null>> {
        const [encomenda] = await sql<Encomenda[]>`
            select *
            from encomendas
            where codigo = ${ codigo }]
        `
        return encomenda ? resultadoEncontrado(encomenda) : resultadoInexistente()
    }

    async criar(data: CriarEncomendaRepoDTO): Promise<Encomenda | null> {
        const [encomenda] = await sql<Encomenda[]>`
            insert into encomendas(cliente_id, produto_id, observacoes, pagamento_realizado, pagamento_forma,
                                   finalizado, entregue, local_entrega, data_pedido)
            values (${ data.cliente_id },
                    ${ data.produto_id },
                    ${ normalizaTexto(data.observacoes) },
                    ${ data.pagamento_realizado ?? false },
                    ${ normalizaTexto(data.pagamento_forma) },
                    ${ data.finalizado ?? false },
                    ${ data.entregue ?? false },
                    ${ normalizaTexto(data.local_entrega) },
                    ${ (data.data_pedido ?? new Date()) })
            returning *
        `
        return encomenda ?? null
    }

    async editar(codigo: string, data: EditarEncomendaDTO): Promise<Encomenda | null> {
        const [encomenda] = await sql<Encomenda[]>`
            update encomendas
            set observacoes         = ${ normalizaTexto(data.observacoes) },
                pagamento_realizado = ${ data.pagamento_realizado },
                pagamento_forma     = ${ normalizaTexto(data.pagamento_forma) },
                finalizado          = ${ data.finalizado },
                entregue            = ${ data.entregue },
                local_entrega       = ${ normalizaTexto(data.local_entrega) },
                data_pedido         = ${ data.data_pedido }
            where codigo = ${ codigo }
            returning *
        `
        return encomenda ?? null
    }
}