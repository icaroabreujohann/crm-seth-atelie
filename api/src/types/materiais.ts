export interface Material {
     id: number,
     nome: string,
     codigo: string,
     tipo_id: number,
     unidade_medida_id: number,
     preco: number,
     quantidade: number,
     preco_x_qtd: number,
     observacoes?: string | null,
     data_criacao: string,
     data_alteracao: string,
}

export interface MaterialCompleto {
     id: number,
     nome: string,
     codigo: string,
     tipo_id: number,
     tipo_nome: string
     unidade_medida_id: number,
     unidade_medida_sigla: string,
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
     tipo_id: number,
     unidade_medida_id: number,
     preco: number,
     quantidade: number,
     observacoes: string | null,
}

export interface EditarMaterialDTO {
     nome: string,
     tipo_id: number,
     unidade_medida_id: number,
     preco: number,
     quantidade: number,
     observacoes: string | null,
}
