export interface ProdutoMaterialView {
     id: number,
     produto_id: number,
     codigo: string,
     material_id: number,
     material_nome: string,
     quantidade: number,
     preco_final: number,
     material_unidade_medida_sigla: number
     material_tipo_nome: string,
}
export interface ProdutoMaterialDB {
     id: number,
     produto_id: number,
     codigo: string,
     material_id: number,
     quantidade: number,
     preco_final: number
}

export interface ProdutoMaterialCriarDTO {
     material_codigo: string
     quantidade: number
}

export interface ProdutoMaterialCriarDB {
     produto_id: number,
     material_id: number,
     quantidade: number,
     preco_final: number
}

export interface ProdutoMaterialEditarDB {
     produto_id: number,
     material_id: number,
     quantidade: number,
     preco_final: number
}