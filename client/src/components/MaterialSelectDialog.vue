<template>
     <v-dialog v-model="dialog" width="50vw">
          <v-card class="pa-7">
               <div class="d-flex align-center justify-space-between mb-5">
                    <div class="d-flex align-center">
                         <HugeiconsIcon class="text-light" :stroke-width="2" :size="30" :icon="PackageSearchIcon">
                         </HugeiconsIcon>
                         <h1 class="ml-2">Selecionar Materiais</h1>
                    </div>
                    <div class="w-33">
                         <v-text-field density="compact" variant="solo-filled" label="Pesquise por um material"
                              prepend-inner-icon="mdi-account-search-outline" hide-details v-model="filtroMaterial">
                              <template #prepend-inner>
                                   <HugeiconsIcon class="subText" :stroke-width="2" :size="20" :icon="Search02Icon" />
                              </template>
                         </v-text-field>
                    </div>
               </div>
               <v-data-table :items="materiaisFiltrados" :headers="materiaisHeaders">
                    <template v-slot:item.selecionar="{ item }">
                         <v-checkbox density="compact" hide-details color="main"
                              :model-value="materiaisSelecionados.has(item.codigo)"
                              @update:model-value="alternarSelecao(item.codigo)" />
                    </template>
                    <template v-slot:item.unidade_medida_sigla="{ item }">
                         <p>{{ item.unidade_medida_sigla.toUpperCase() }}</p>
                    </template>
                    <template v-slot:item.preco="{ item }">
                         <p>R$ {{ substituiPontoPorVirgula(item.preco) }}</p>
                    </template>
                    <template v-slot:item.preco_x_qtd="{ item }">
                         <p>R$ {{ substituiPontoPorVirgula(item.preco_x_qtd) }}</p>
                    </template>
               </v-data-table>
               <div class="mt-5">
                    <v-btn color="main" class="mr-2" @click="enviarSelecao">Adicionar ({{
                         materiaisSelecionados.size
                         }})</v-btn>
                    <v-btn variant="tonal" @click="dialog = false">Fechar</v-btn>
               </div>
          </v-card>
     </v-dialog>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue';
import { storeToRefs } from 'pinia';

import type { MaterialCompleto } from '@/modules/materiais/materiais.types'
import { usarMaterialStore } from '@/stores/materiais.store';

import { HugeiconsIcon } from '@hugeicons/vue';
import { PackageSearchIcon, Search02Icon } from '@hugeicons/core-free-icons';
import { substituiPontoPorVirgula } from '@/utils/substituirPontoPorVirgula';

const props = withDefaults(defineProps<{
     materiaisProps: string[] | null,
     modelValue: boolean
}>(), {
     materiaisProps: () => []
})

const emit = defineEmits<{
     (e: 'update:modelValue', value: boolean): void
     (e: 'select', materiais: string[]): void
}>()

const dialog = computed({
     get: () => props.modelValue,
     set: (value) => emit('update:modelValue', value)
})

const materialStore = usarMaterialStore()
const { materiais, carregando } = storeToRefs(materialStore)
const materiaisHeaders = [
     { title: '', key: 'selecionar', width: '1%' },
     { title: 'Nome', key: 'nome', sortable: true },
     { title: 'Tipo', key: 'tipo_nome' },
     { title: 'Unidade Medida', key: 'unidade_medida_sigla', sortable: true },
     { title: 'Preço X Qtd', key: 'preco_x_qtd', sortable: true }
]

const filtroMaterial = ref('')
const materiaisFiltrados = computed(() => {
     if (!filtroMaterial.value) return materiais.value

     const termo = filtroMaterial.value.toLowerCase()

     return materiais.value.filter(m =>
          m.codigo.toLowerCase().includes(termo) ||
          m.nome.toLowerCase().includes(termo) ||
          m.tipo_nome.toLowerCase().includes(termo)
     )
})

const materiaisSelecionados = ref<Set<string>>(new Set())


function alternarSelecao(codigo: string) {
     if (materiaisSelecionados.value.has(codigo)) {
          materiaisSelecionados.value.delete(codigo)
     } else {
          materiaisSelecionados.value.add(codigo)
     }
}

function enviarSelecao() {
     console.log('enviarSelecao(): ', Array.from(materiaisSelecionados.value))
     emit('select', Array.from(materiaisSelecionados.value))
     emit('update:modelValue', false)
}

onMounted(() => {
     materialStore.buscarMateriais()
})

watch(
     () => dialog.value,
     aberto => {
          if (aberto) {
               materiaisSelecionados.value = new Set(props.materiaisProps)
          }
     },
     { immediate: true }
)


</script>