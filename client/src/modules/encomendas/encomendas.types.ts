export interface EncomendaView {
    codigo: string,
    cliente_id: number,
    cliente_nome: string,
    produto_id: number,
    produto_codigo: string,
    produto_nome: string,
    preco_final: number,
    observacoes: string,
    pagamento_realizado: boolean,
    pagamento_forma: string,
    finalizado: boolean,
    entregue: boolean,
    local_entrega: string,
    data_pedido: string | null,
    data_prazo: string | null,
    data_criacao: string,
    data_alteracao: string
    materiais: EncomendaMaterialView[]
}

export interface EncomendaForm {
    codigo?: string,
    cliente_id: number,
    produto_codigo: string,
    observacoes: string,
    pagamento_realizado: boolean,
    pagamento_forma: string,
    finalizado: boolean,
    entregue: boolean,
    local_entrega: string,
    data_pedido: string | null,
    data_prazo: string | null,
    materiais: EncomendaMaterialCriarDTO[]
}
export interface EncomendaPayload {
    cliente_id: number,
    produto_codigo: string,
    observacoes: string,
    pagamento_realizado: boolean,
    pagamento_forma: string,
    finalizado: boolean,
    entregue: boolean,
    local_entrega: string,
    data_pedido: string | null,
    data_prazo: string | null,
    materiais: EncomendaMaterialCriarDTO[]
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
    data_pedido: string | null,
    data_prazo: string | null,
    materiais?: EncomendaMaterialCriarDTO[]
}

export type EncomendaEditarDTO = Partial<{
    observacoes: string,
    pagamento_realizado: boolean,
    pagamento_forma: string,
    finalizado: boolean,
    entregue: boolean,
    local_entrega: string,
    data_pedido: string | null,
    data_prazo: string | null,
    materiais: EncomendaMaterialCriarDTO[]
}>

export interface EncomendaCriarDB {
    codigo: string,
    cliente_id: number,
    produto_id: number,
    observacoes: string,
    pagamento_realizado: boolean,
    pagamento_forma: string,
    finalizado: boolean,
    entregue: boolean,
    local_entrega: string,
    data_pedido: string | null,
    data_prazo: string | null,
}

export type EncomendaEditarDB = Partial<{
    observacoes: string,
    pagamento_realizado: boolean,
    pagamento_forma: string,
    finalizado: boolean,
    entregue: boolean,
    local_entrega: string,
    data_pedido: string | null,
    data_prazo: string | null,
}>

export interface EncomendaMaterialCriarDTO {
    material_codigo: string
    quantidade: number
}

export interface EncomendaMaterialView {
    id: number
    produto_id: number
    material_id: number
    codigo: string
    material_nome: string
    material_tipo_nome: string
    material_unidade_medida_sigla: string
    quantidade: number
    preco_final: number
}
