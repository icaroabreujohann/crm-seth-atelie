export interface Encomenda {
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

export interface CriarEncomendaDTO {
    cliente_id: number,
    produto_codigo: number,
    observacoes: string | null,
    pagamento_realizado: boolean | null,
    pagamento_forma: string | null,
    finalizado: boolean | null,
    entregue: boolean,
    local_entrega: string | null,
    data_pedido: Date | null,
}

export interface CriarEncomendaRepoDTO {
    cliente_id: number,
    produto_id: number,
    observacoes: string | null,
    pagamento_realizado: boolean | null,
    pagamento_forma: string | null,
    finalizado: boolean | null,
    entregue: boolean | null,
    local_entrega: string | null,
    data_pedido: Date | null,
}

export interface EditarEncomendaDTO {
    observacoes: string | null,
    pagamento_realizado: boolean | null,
    pagamento_forma: string | null,
    finalizado: boolean | null,
    entregue: boolean | null,
    local_entrega: string | null,
    data_pedido: Date | null,
}
