import type { RespostaApi } from "@/types/resposta.api"
import type { EncomendaView } from "./encomendas.types"
import { api } from "@/plugins/api"

export const EncomendasServices = {
     async listar(): Promise<EncomendaView[]> {
          const { data } = await api.get<RespostaApi<EncomendaView[]>>('/encomendas')

          return data.data
     },

}