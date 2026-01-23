import type { EncomendaForm, EncomendaView } from "@/modules/encomendas/encomendas.types";
import { formatarDataBR, formatarDataHoraBR } from "@/utils/formataData";
import { montaPayloadPatch } from "@/utils/montarPayloadPatch";
import { computed, ref } from "vue";

export function useEncomendaForm() {
     const defaultForm: EncomendaForm = {
          codigo: '',
          cliente_id: 0,
          produto_codigo: '',
          observacoes: '',
          pagamento_realizado: false,
          pagamento_forma: '',
          finalizado: false,
          entregue: false,
          local_entrega: '',
          data_pedido: '',
          data_prazo: '',
          materiais: []
     }

     const form = ref<EncomendaForm>(structuredClone(defaultForm))
     const original = ref<EncomendaForm>(structuredClone(defaultForm))

     const regras = {
          obrigatorio: [(v: string) => !!v || 'Campo obrigatório'],
     }

     async function carregar(encomenda?: EncomendaView) {
          if (!encomenda) {
               form.value = { ...defaultForm }
               return
          }

          const base = {
               codigo: encomenda.codigo,
               cliente_id: encomenda.cliente_id,
               produto_codigo: encomenda.produto_codigo,
               observacoes: encomenda.observacoes,
               pagamento_realizado: encomenda.pagamento_realizado,
               pagamento_forma: encomenda.pagamento_forma,
               finalizado: encomenda.finalizado,
               entregue: encomenda.entregue,
               local_entrega: encomenda.local_entrega,
               data_pedido: encomenda.data_pedido,
               data_prazo: encomenda.data_prazo,
               materiais: encomenda.materiais.map(m => ({
                    material_codigo: m.codigo,
                    quantidade: Number(m.quantidade)
               }))
          }
          form.value = structuredClone(base)
          original.value = structuredClone(base)
     }

     const podeSalvar = computed(
          () => JSON.stringify(form.value) != JSON.stringify(original.value)
     )

     function gerarPayloadPatch() {
          return montaPayloadPatch(form.value, original.value)
     }

     function resetar() {
          carregar()
     }

     return {
          form,
          original,
          regras,
          carregar,
          podeSalvar,
          resetar,
          gerarPayloadPatch
     }

}