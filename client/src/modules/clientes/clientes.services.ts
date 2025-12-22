import { api } from '@/plugins/api'
import { type Cliente, type ClienteForm, type CriarClienteDTO } from './clientes.types'
import type { RespostaApi } from '@/types/resposta.api'

async function criar(payload: CriarClienteDTO): Promise < Cliente > {
     const { data } = await api.post<Cliente>('/clientes', payload)
     return data
}

async function editar(id: number, payload: CriarClienteDTO): Promise < Cliente > {
     const { data } = await api.patch<Cliente>(`/clientes/${id}`, payload)
     return data
}

export const ClientesServices = {
     async listar(): Promise<Cliente[]> {
          const { data } = await api.get<RespostaApi<Cliente[]>>('/clientes')

          return data.data
     },

     async listarPorId(id: number): Promise<Cliente> {
          const { data } = await api.get<RespostaApi<Cliente>>(`/clientes/${id}`)
          return data.data
     },

     async salvar(form: ClienteForm): Promise<Cliente> {
          const payload = {
               nome: form.nome,
               instagram: form.instagram,
               telefone: form.telefone
          }

          if (!form.id) {
               return await criar(payload)
          }
          return editar(form.id, payload)
     },

     async excluir(id: number): Promise<Cliente> {
          const { data } = await api.delete<Cliente>(`/clientes/${id}`)
          return data
     }
}
