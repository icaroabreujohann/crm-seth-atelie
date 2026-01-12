import type { ProdutoForm, ProdutoView } from "@/modules/produtos/produtos.types"
import { montaPayloadPatch } from "@/utils/montarPayloadPatch"
import { computed, ref } from "vue"

export function useProdutoForm() {
     const defaultForm: ProdutoForm = {
          codigo: '',
          nome: '',
          preco: 0,
          tempo_medio: { horas: 0, minutos: 0 },
          fotos: [],
          materiais: []
     }

     const form = ref<ProdutoForm>(structuredClone(defaultForm))
     const original = ref<ProdutoForm>(structuredClone(defaultForm))

     const regras = {
          obrigatorio: [(v: string) => !!v || 'Campo obrigatório'],
          minutos_maximos: [(v: number) => v <= 59 || 'Máximo de 59 minutos.']
     }

     function carregar(produto?: ProdutoView) {
          const base = produto
               ? {
                    codigo: produto.codigo,
                    nome: produto.nome,
                    preco: produto.preco,
                    tempo_medio: { ...produto.tempo_medio },
                    fotos: [],
                    materiais: produto.materiais.map(m => ({
                         material_codigo: m.codigo,
                         quantidade: Number(m.quantidade)
                    }))
               } : structuredClone(defaultForm)
          form.value = base
          original.value = structuredClone(base)
     }

     const podeSalvar = computed(
          () => JSON.stringify(form.value) !== JSON.stringify(original.value)
     )

     function gerarPayloadPatch() {
          return montaPayloadPatch(form.value, original.value)
     }

     function resetar() {
          carregar()
     }

     return {
          form,
          regras,
          original,
          podeSalvar,
          carregar,
          gerarPayloadPatch,
          resetar
     }

}