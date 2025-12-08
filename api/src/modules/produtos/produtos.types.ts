export interface Produto {
     id: number,
     codigo: string,
     nome: string,
     preco: number,
     fotos_url: string,
     tempo_medio: string,
     data_criacao: Date,
     data_alteracao: Date
}

export interface CriarProdutoDTO {
     nome: string,
     codigo: string | null,
     preco: number,
     tempo_medio: string | null,
     fotos_url: string | null
}

export interface EditarProdutoDTO {
     nome: string,
     preco: number,
     tempo_medio: string | null,
}