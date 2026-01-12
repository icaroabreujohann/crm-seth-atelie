import { computed, type Ref } from 'vue'
import type { ProdutoForm } from '@/modules/produtos/produtos.types'
import type { Material } from '@/modules/materiais/materiais.types'
import { usarMaterialStore } from '@/stores/materiais.store'

const materialStore = usarMaterialStore()
export function useProdutoMateriais(
     form: Ref<ProdutoForm>,
     catalogo: Ref<Material[]>
) {

     const materiaisCodigos = computed(() =>
          form.value.materiais.map(m => m.material_codigo)
     )

     const materiaisExibicao = computed(() => {
          const catalogo = new Map(
               materialStore.materiais.map(m => [m.codigo, m])
          )

          return form.value.materiais.map(m => {
               const material = catalogo.get(m.material_codigo)
               return {
                    material_codigo: m.material_codigo,
                    quantidade: m.quantidade,
                    nome: material?.nome ?? 'Material não encontrado',
                    tipo_nome: material?.tipo_nome ?? '-',
                    unidade_medida_sigla: material?.unidade_medida_sigla ?? '',
                    preco_x_qtd: material?.preco_x_qtd ?? 0
               }
          })
     })

     function atualizarQuantidade(codigo: string, quantidade: number) {
          const material = form.value.materiais
               .find(m => m.material_codigo === codigo)

          if (material) material.quantidade = quantidade
     }

     function removerMaterial(codigo: string) {
          form.value.materiais =
               form.value.materiais.filter(
                    m => m.material_codigo !== codigo
               )
     }

     function selecionarMateriais(codigos: string[]) {
          const anteriores = new Map(
               form.value.materiais.map(m => [
                    m.material_codigo,
                    m.quantidade
               ])
          )

          const catalogoQtd = new Map(
               catalogo.value.map(m => [
                    m.codigo,
                    m.quantidade ?? 1
               ])
          )

          form.value.materiais = codigos.map(codigo => ({
               material_codigo: codigo,
               quantidade:
                    anteriores.get(codigo) ??
                    catalogoQtd.get(codigo) ??
                    1
          }))
     }

     return {
          materiaisCodigos,
          materiaisExibicao,
          atualizarQuantidade,
          removerMaterial,
          selecionarMateriais
     }
}
