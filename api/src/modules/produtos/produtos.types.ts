import { TempoMedio } from "../../types/tempo.medio"

export interface ProdutoView {
     id: number,
     codigo: string,
     nome: string,
     preco: number,
     fotos_url: string,
     tempo_medio: {
          horas: number,
          minutos: number
     },
     data_criacao: Date,
     data_alteracao: Date
}

//DTO's
export interface CriarProdutoDTO {
     nome: string,
     preco: number,
     tempo_medio: TempoMedio
}

export interface EditarProdutoDTO {
     nome: string,
     preco: number,
     tempo_medio: TempoMedio
}

//DB

export interface CriarProdutoDB {
     nome: string,
     codigo: string,
     preco: number,
     tempo_medio: number,
     fotos_url: string | null
}
export interface EditarProdutoDB {
     nome: string,
     preco: number,
     tempo_medio: number
}

export interface ProdutoDB {
     id: number,
     codigo: string,
     nome: string,
     preco: number,
     fotos_url: string,
     tempo_medio: number,
     data_criacao: Date,
     data_alteracao: Date
}