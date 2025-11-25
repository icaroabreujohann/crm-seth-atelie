export interface Encomenda {
     id: number
     titulo: string
     clienteId: number
     clienteNome: string
     notas: string | null
     precoTotal: number
     dataInclusao: Date
     dataPrazo: Date
     dataEntrega: Date | null
     dataCriacao: Date
}
