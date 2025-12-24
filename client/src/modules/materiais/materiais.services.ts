import { api } from '@/plugins/api'
import type { Material, MaterialCompleto, CriarMaterialDTO, EditarMaterialDTO, MaterialForm } from './materiais.types'
import type { RespostaApi } from '@/types/resposta.api'

async function criar(payload: CriarMaterialDTO): Promise<Material> {
     const { data } = await api.post<Material>('/materiais', payload)
     return data
}

async function editar(codigo: string, payload: EditarMaterialDTO): Promise<Material> {
     const { data } = await api.patch<Material>(`/materiais/${codigo}`, payload)
     return data
}

export const MateriaisServices = {

     async listar(): Promise<MaterialCompleto[]> {
          const { data } = await api.get<RespostaApi<MaterialCompleto[]>>('/materiais')

          return data.data
     },

     async listarPorId(codigo: string): Promise<MaterialCompleto> {
          const { data } = await api.get<RespostaApi<MaterialCompleto>>(`/materiais/${codigo}`)
          return data.data
     },

     async salvar(form: MaterialForm): Promise<Material> {
          const payload = {
               nome: form.nome,
               tipo_id: form.tipo_id,
               unidade_medida_id: form.unidade_medida_id,
               preco: form.preco,
               quantidade: form.quantidade,
               observacoes: form.observacoes ?? '',
          }

          if (!form.codigo) {
               return await criar(payload)
          }
          return editar(form.codigo, payload)
     },

     async excluir(codigo: string): Promise<Material> {
          const { data } = await api.delete<Material>(`/materiais/${codigo}`)
          return data
     }

}