export interface Material {
     id: number,
     nome: string,
     codigo: string,
     tipo: string,
     unidade_medida: string,
     preco: number,
     quantidade: number,
     preco_x_qtd: number,
     observacoes?: string | null,
     data_criacao: string,
     data_alteracao: string,
}

export interface CriarMaterialDTO {
     nome: string,
     codigo: string | null,
     tipo: string,
     unidade_medida: string,
     preco: number,
     quantidade: number,
     observacoes: string | null,
}

export interface EditarMaterialDTO {
     nome: string,
     tipo: string,
     unidade_medida: string,
     preco: number,
     quantidade: number,
     observacoes: string | null,
}
