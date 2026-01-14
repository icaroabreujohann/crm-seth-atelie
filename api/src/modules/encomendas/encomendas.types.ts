export interface EncomendaView {
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
    data_pedido: Date,
    data_prazo?: Date
}

export interface EncomendaCriarDB {
    codigo: string,
    cliente_id: number,
    produto_id: string,
    observacoes: string,
    pagamento_realizado: boolean,
    pagamento_forma: string,
    finalizado: boolean,
    entregue: boolean,
    local_entrega: string,
    data_pedido: Date,
    data_prazo: Date
}
