export type Cliente = {
     id: number,
     nome: string,
     instagram?: string | null,
     telefone?: string | null,
     data_criacao: string,
     data_atualizacao: string
}

export type ClienteId = {
     id: number
}

export type CriarClienteDTO = {
     nome: string,
     instagram: string | null,
     telefone: string | null,
}
export type EditarClienteDTO = {
     nome: string,
     instagram: string | null,
     telefone: string | null,
}
