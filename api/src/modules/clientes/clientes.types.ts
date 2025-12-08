export interface Cliente {
     id: number,
     nome: string,
     instagram?: string | null,
     telefone?: string | null,
     dataCriacao: string,
     dataAtualizacao: string
}

export interface ClienteId {
     id: number
}

export interface CriarClienteDTO {
     nome: string,
     instagram: string | null,
     telefone: string | null,
}
export interface EditarClienteDTO {
     nome: string,
     instagram: string | null,
     telefone: string | null,
}
