import { api } from '@/plugins/api'
import type { RespostaApi } from '@/types/resposta.api'
import type { Produto, ProdutoForm, ProdutoPayload } from './produtos.types'

function produtoPayloadToFormData(form: ProdutoPayload): FormData {
     const formData = new FormData()

     formData.append('nome', form.nome)
     if (form.preco !== null) formData.append('preco', form.preco.toString())
     if (form.tempo_medio) {
          formData.append('tempo_medio[horas]', form.tempo_medio.horas.toString())
          formData.append('tempo_medio[minutos]', form.tempo_medio.minutos.toString())
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

     const { data } = await api.post<RespostaApi<Produto>>('/produtos', formData)
     return data.data
}

async function editar(codigo: string, payload: ProdutoPayload) {
     const { fotos, ...produtoPayload } = payload

     const { data } = await api.patch<RespostaApi<Produto>>(
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
     async listar(): Promise<Produto[]> {
          const { data } = await api.get<RespostaApi<Produto[]>>('/produtos')

          return data.data
     },

     async salvar(form: ProdutoForm): Promise<Produto> {
          const payload: ProdutoPayload = {
               nome: form.nome,
               preco: form.preco,
               tempo_medio: form.tempo_medio,
               fotos: form.fotos
          }

          if (!form.codigo) { return await criar(payload) }

          return await editar(form.codigo, payload)
     }

}

