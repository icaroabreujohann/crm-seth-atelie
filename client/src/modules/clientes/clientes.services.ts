import { api } from '@/plugins/api'
import { type Cliente, type CriarClienteDTO } from './clientes.types'
import type { RespostaApi } from '@/types/resposta.api'

export const ClientesServices = {
     async listar(): Promise<Cliente[]> {
          const { data } = await api.get<RespostaApi<Cliente[]>>('/clientes')
          console.log('cliente service listar', data.data)
          return data.data
     },

     async listarPorId(id: number): Promise<Cliente> {
          const { data } = await api.get<RespostaApi<Cliente>>(`/clientes/${id}`)
          return data.data
     },

     async criar(payload: CriarClienteDTO): Promise<Cliente> {
          const { data } = await api.post<Cliente>('/clientes', payload)
          return data
     },

     async editar(id: number, payload: CriarClienteDTO): Promise<Cliente> {
          const { data } = await api.patch<Cliente>(`/clientes/${id}`, payload)
          return data
     },

     async excluir(id: number): Promise<Cliente> {
          const { data } = await api.delete<Cliente>(`/clientes/${id}`)
          return data
     }
}
