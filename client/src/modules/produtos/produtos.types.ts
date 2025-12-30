import type { TempoMedio } from "@/types/tempo.medio"

export interface Produto {
     id: number,
     codigo: string,
     nome: string,
     preco: number,
     fotos_url: string,
     tempo_medio: TempoMedio,
     data_criacao: Date,
     data_alteracao: Date
     fotos: File[] | null
}
export interface ProdutoPayload {
     nome: string,
     preco: number,
     tempo_medio: TempoMedio,
     fotos: File[] | null,
}

export interface ProdutoForm extends ProdutoPayload {
     codigo: string
}