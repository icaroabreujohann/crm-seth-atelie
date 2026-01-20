import type { RespostaApi } from "@/types/resposta.api"
import type { EncomendaForm, EncomendaPayload, EncomendaView } from "./encomendas.types"
import { api } from "@/plugins/api"

async function criar(encomenda: Partial<EncomendaPayload>) {
     const { data } = await api.post<RespostaApi<EncomendaView>>('/encomendas', encomenda)
     return data.data
}

async function editar(codigo: string, encomenda: Partial<EncomendaPayload>) {
     const { data } = await api.patch<RespostaApi<EncomendaView>>(`/encomendas/${codigo}`, encomenda)
     return data.data
}

export const EncomendasServices = {

     async listar(): Promise<EncomendaView[]> {
          const { data } = await api.get<RespostaApi<EncomendaView[]>>('/encomendas')

          return data.data
     },

     async listarPorCodigo(codigo: string): Promise<EncomendaView> {
          const { data } = await api.get<RespostaApi<EncomendaView>>(`/encomendas/${codigo}/completa`)
          return data.data
     },

     async salvar(form: Partial<EncomendaForm>) {
          console.log('form', form)
          const payload: Partial<EncomendaPayload> = {
               cliente_id: form.cliente_id,
               produto_codigo: form.produto_codigo,
               observacoes: form.observacoes,
               pagamento_realizado: form.pagamento_realizado,
               pagamento_forma: form.pagamento_forma,
               finalizado: form.finalizado,
               entregue: form.entregue,
               local_entrega: form.local_entrega,
               data_pedido: form.data_pedido,
               data_prazo: form.data_prazo,
               materiais: form.materiais
          }

          if (!form.codigo) { return await criar(payload) }
          return await editar(form.codigo, payload)
     },

     async excluir(codigo: string): Promise<EncomendaView> {
          const { data } = await api.delete<RespostaApi<EncomendaView>>(`/encomendas/${codigo}`)
          return data.data
     },
}