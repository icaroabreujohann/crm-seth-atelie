import { EncomendaMaterialCriarDTO } from "./materiais/encomendaMaterialtypes"

export interface EncomendaDB {
    id: number,
    cliente_id: number,
    produto_id: number,
    preco_final: number,
    observacoes: string | null,
    pagamento_realizado: boolean,
    pagamento_forma: string | null,
    finalizado: boolean,
    entregue: boolean,
    local_entrega: string | null,
    data_pedido: Date,
    data_prazo: Date,
    data_criacao: Date,
    data_alteracao: Date
}

export interface EncomendaView {
    id: number,
    cliente_id: number,
    cliente_nome: string,
    produto_id: number,
    produto_codigo: string,
    produto_nome: string,
    preco_final: number,
    observacoes: string | null,
    pagamento_realizado: boolean,
    pagamento_forma: string | null,
    finalizado: boolean,
    entregue: boolean,
    local_entrega: string | null,
    data_pedido: string,
    data_prazo: string,
    data_alteracao: Date
}


export interface EncomendaCriarDTO {
    cliente_id: number,
    produto_codigo: string,
    observacoes?: string,
    pagamento_realizado?: boolean,
    pagamento_forma?: string,
    finalizado?: boolean,
    entregue?: boolean,
    local_entrega?: string,
    data_pedido: string,
    data_prazo?: string | null
    materiais?: EncomendaMaterialCriarDTO[]
}

export type EncomendaEditarDTO = Partial<{
    observacoes: string,
    pagamento_realizado: boolean,
    pagamento_forma: string,
    finalizado: boolean,
    entregue: boolean,
    local_entrega: string,
    data_pedido: string,
    data_prazo: string | null
    materiais: EncomendaMaterialCriarDTO[]
}>

export interface EncomendaCriarDB {
    codigo: string,
    cliente_id: number,
    produto_id: number,
    observacoes: string | null,
    pagamento_realizado: boolean,
    pagamento_forma: string | null,
    finalizado: boolean,
    entregue: boolean,
    local_entrega: string | null,
    data_pedido: string,
    data_prazo: string | null
}

export type EncomendaEditarDB = Partial<{ 
    observacoes: string,
    pagamento_realizado: boolean,
    pagamento_forma: string,
    finalizado: boolean,
    entregue: boolean,
    local_entrega: string,
    data_pedido: string,
    data_prazo: string | null
}>
