export interface ProdutoMaterial {
     id: number,
     produto_id: number,
     material_id: number,
     material_nome: string,
     quantidade: number,
     preco_final: number
}

export interface CriarProdutoMaterialDTO {
     material_codigo: string
     quantidade: number
}

export interface CriarProdutoMaterialRepoDTO {
     produto_id: number,
     material_id: number,
     quantidade: number,
     preco_final: number
}

export interface EditarProdutoMaterialDTO {
     quantidade: number
}
export interface EditarProdutoMaterialRepoDTO {
     quantidade: number,
     preco_final: number
}