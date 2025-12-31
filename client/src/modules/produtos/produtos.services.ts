import { api } from '@/plugins/api'
import type { RespostaApi } from '@/types/resposta.api'
import type { ProdutoView, ProdutoForm, ProdutoPayload } from './produtos.types'

function produtoPayloadToFormData(form: ProdutoPayload): FormData {
     const formData = new FormData()

     formData.append('nome', form.nome)
     if (form.preco !== null) formData.append('preco', form.preco.toString())
     if (form.tempo_medio) {
          formData.append('tempo_medio[horas]', form.tempo_medio.horas.toString())
          formData.append('tempo_medio[minutos]', form.tempo_medio.minutos.toString())
     }
     if (form.materiais.length > 0) {
          form.materiais?.forEach((m, index) => {
               formData.append(`materiais[${index}][material_codigo]`, m.material_codigo)
               formData.append(`materiais[${index}][quantidade]`, m.quantidade.toString())
          })
     }

     if (form.fotos) {
          form.fotos.forEach((foto) => {
               if (foto instanceof File) {
                    formData.append('fotos', foto)
               }
          })
     }

     return formData
}

function produtoFotosToFormData(fotos: File[] | null): FormData {
     const formData = new FormData()
     if (fotos) {
          fotos.forEach((foto) => {
               if (foto instanceof File) {
                    formData.append('fotos', foto, foto.name)
               }
          })
     }

     return formData
}

async function criar(payload: ProdutoPayload) {
     const formData = produtoPayloadToFormData(payload)

     const { data } = await api.post<RespostaApi<ProdutoView>>('/produtos', formData)
     return data.data
}

async function editar(codigo: string, payload: ProdutoPayload) {
     const { fotos, ...produtoPayload } = payload

     const { data } = await api.patch<RespostaApi<ProdutoView>>(
          `/produtos/${codigo}`,
          produtoPayload
     )

     if (fotos?.length) {
          const fotosFormData = produtoFotosToFormData(fotos)
          await api.post(`/produtos/${codigo}/fotos`, fotosFormData)
     }

     return data.data
}
export const ProdutosServices = {
     async listar(): Promise<ProdutoView[]> {
          const { data } = await api.get<RespostaApi<ProdutoView[]>>('/produtos')

          return data.data
     },

     async listarPorCodigo(codigo: string): Promise<ProdutoView> {
          const { data } = await api.get<RespostaApi<ProdutoView>>(`/produtos/${codigo}/completo`)
          return data.data
     },

     async salvar(form: ProdutoForm): Promise<ProdutoView> {
          const payload: ProdutoPayload = {
               nome: form.nome,
               preco: form.preco,
               tempo_medio: form.tempo_medio,
               fotos: form.fotos,
               materiais: form.materiais ?? []
          }

          if (!form.codigo) { return await criar(payload) }

          return await editar(form.codigo, payload)
     }

}

