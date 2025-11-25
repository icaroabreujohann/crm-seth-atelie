export interface Cliente {
     id: number,
     nome: string,
     instagram?: string | null,
     numero?: string | null,
     dataCriacao: string,
     dataAtualizacao: string
}

export interface CriarClienteDTO {
     nome: string,
     instagram: string | null,
     numero: string | null,
}
export interface EditarClienteDTO {
     id: number,
     nome: string,
     instagram: string | null,
     numero: string | null,
}
