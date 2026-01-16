<template>
     <v-dialog v-model="dialog" width="45vw">
          <v-card class="pa-10">
               <div class="d-flex align-center justify-space-between">
                    <div class="d-flex align-center">
                         <HugeiconsIcon class="text-light mr-2" :stroke-width="2" :size="30" :icon="Tag01Icon" />
                         <h1>Selecione um Produto</h1>
                    </div>
                    <div class="w-33 mr-n5">
                         <v-text-field density="compact" variant="solo-filled" label="Pesquise por um produto"
                              prepend-inner-icon="mdi-account-search-outline" hide-details v-model="filtroProdutos">
                              <template #prepend-inner>
                                   <HugeiconsIcon class="subText" :stroke-width="2" :size="20" :icon="Search02Icon" />
                              </template>
                         </v-text-field>
                    </div>
                    <v-btn variant="tonal" @click="dialog = false" width="15%">
                         <HugeiconsIcon :size="18" :icon="CancelCircleIcon" class="mr-1" />
                         Cancelar
                    </v-btn>
               </div>
               <v-card v-if="produtoStore.carregando" width="100%"
                    class="pa-10 d-flex align-center flex-column justify-center mt-5 no-border">
                    <v-progress-circular color="main" indeterminate :size="83" :width="6"></v-progress-circular>
                    <p class="subText mt-3">Carregando Produtos</p>
               </v-card>
               <div class="mt-5" v-else-if="produtoStore.carregado">
                    <v-row>
                         <v-col cols="12" md="4" v-for="produto in produtosFiltrados" :key="produto.codigo">
                              <v-card class="pa-5" @click="selecionarProduto(produto)">
                                   <v-img aspect-ratio="1" cover width="100%"
                                        :key="produto.codigo + produto.data_alteracao"
                                        :src="`${api.defaults.baseURL}/arquivos/produtos/${produto.codigo}/1.webp?v=${produto.data_alteracao || Date.now()}`">
                                        <template #placeholder>
                                             <div class="d-flex align-center justify-center fill-height">
                                                  <v-progress-circular color="main" indeterminate size="36" />
                                             </div>
                                        </template>
                                        <template #error>
                                             <div
                                                  class="d-flex align-center justify-center fill-height bg-grey-lighten-3">
                                                  <HugeiconsIcon :size="70" class="opacity-30"
                                                       :icon="ImageDelete01Icon" />
                                             </div>
                                        </template>
                                   </v-img>
                                   <h2 class="mt-3">{{ produto.nome }}</h2>
                                   <div class="d-flex align-center justify-space-between mt-2">
                                        <div>
                                             <p class="subText">Preço</p>
                                             <h2 class="f-regular">R$ {{ substituiPontoPorVirgula(produto.preco) }}</h2>
                                        </div>
                                   </div>
                              </v-card>
                         </v-col>
                    </v-row>
               </div>
          </v-card>
     </v-dialog>
</template>


<script setup lang="ts">
import type { ProdutoView } from '@/modules/produtos/produtos.types';
import { api } from '@/plugins/api';
import { usarProdutoStore } from '@/stores/produtos.store';
import { normalizarTextoBusca } from '@/utils/normalizarTextoBusca';
import { substituiPontoPorVirgula } from '@/utils/substituirPontoPorVirgula';
import { CancelCircleIcon, ImageDelete01Icon, Search02Icon, Tag01Icon, UserMultiple02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import { onMounted, ref } from 'vue';
import { computed } from 'vue';


const props = defineProps<{
     modelValue: boolean
}>()

const emit = defineEmits<{
     (e: 'update:modelValue', value: boolean): void
     (e: 'select', cliente: ProdutoView): void
}>()

const dialog = computed({
     get: () => props.modelValue,
     set: (value) => emit('update:modelValue', value)
})

const produtoStore = usarProdutoStore()
const produtos = computed(() => produtoStore.produtos)

const filtroProdutos = ref<string>('')
const produtosFiltrados = computed(() => {
     if (!filtroProdutos.value || filtroProdutos.value == '') return produtos.value

     const termos = normalizarTextoBusca(filtroProdutos.value).split(/\s+/)

     return produtos.value.filter(p => {
          const nome = normalizarTextoBusca(p.nome)
          return termos.every(termo => nome.includes(termo))
     })
})

function selecionarProduto(produto: ProdutoView){
     emit('select', produto)
     dialog.value = false
}

onMounted(() => {
     produtoStore.buscaProdutos()
})

</script>
