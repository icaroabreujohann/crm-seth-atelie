import type { TempoMedio } from "@/types/tempo.medio";

export interface ProdutoView {
     id: number
     codigo: string
     nome: string
     preco: number
     fotos_url: string | null
     tempo_medio: TempoMedio
     data_criacao: Date
     data_alteracao: Date
     materiais: ProdutoMaterialView[]
     fotos: File[]
}

export interface ProdutoForm {
     codigo?: string
     nome: string
     preco: number
     tempo_medio: TempoMedio
     materiais?: ProdutoMaterialCriarDTO[]
     fotos: File[]
}

export interface ProdutoPayload {
     nome: string
     preco: number
     tempo_medio: {
          horas: number
          minutos: number
     },
     fotos?: File[],
     materiais: {
          material_codigo: string
          quantidade: number
     }[]
}

export interface ProdutoCriarDTO {
     nome: string
     preco: number
     tempo_medio: TempoMedio
     materiais?: ProdutoMaterialCriarDTO[]
     fotos: File[]
}
export interface ProdutoEditarDTO {
     nome?: string
     preco?: number
     tempo_medio?: TempoMedio
     materiais: ProdutoMaterialCriarDTO[] | []
     fotos?: File[]
}

//ProdutoMaterial

export interface ProdutoMaterialView {
     id: number
     produto_id: number
     material_id: number
     material_codigo: string
     material_nome: string
     material_tipo_nome: string
     material_unidade_medida_sigla: string
     quantidade: number
     preco_final: number
}

export interface ProdutoMaterialCriarDTO {
     material_codigo: string
     quantidade: number
}

export interface ProdutoMaterialSelecionado {
     codigo: string
     nome: string
     tipo_nome: string
     unidade_medida_sigla: string
     quantidade: number
     preco_final: number
}