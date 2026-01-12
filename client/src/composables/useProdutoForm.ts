import { ProdutosServices } from "@/modules/produtos/produtos.services"
import type { ProdutoForm, ProdutoView } from "@/modules/produtos/produtos.types"
import { montaPayloadPatch } from "@/utils/montarPayloadPatch"
import { urlParaFile } from "@/utils/urlParaFile"
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

     async function carregar(produto?: ProdutoView) {
          if (!produto) {
               form.value = { ...defaultForm }
               return
          }

          const fotosProduto = await ProdutosServices.listarFotos(produto.codigo)
          const arquivos: File[] = await Promise.all(
               fotosProduto.map(async (url, i) => {
                    const res = await fetch(url)
                    const blob = await res.blob()
                    return new File([blob], `${i + 1}.webp`, { type: blob.type })
               })
          )

          const base = {
               codigo: produto.codigo,
               nome: produto.nome,
               preco: produto.preco,
               tempo_medio: { ...produto.tempo_medio },
               fotos: arquivos,
               materiais: produto.materiais.map(m => ({
                    material_codigo: m.codigo,
                    quantidade: Number(m.quantidade)
               }))
          }
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