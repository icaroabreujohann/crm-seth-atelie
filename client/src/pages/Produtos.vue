<template>
     <div class="w-100 mb-5 d-flex align-end justify-space-between">
          <h1 class="mb-n2">Produtos</h1>
          <div class="d-flex align-end w-50 justify-end">
               <div class="w-50">
                    <v-text-field density="compact" class="mr-3" variant="solo-filled" label="Pesquise por um produto"
                         prepend-inner-icon="mdi-account-search-outline" hide-details v-model="filtroProdutos">
                         <template #prepend-inner>
                              <HugeiconsIcon class="subText" :stroke-width="2" :size="20" :icon="Search02Icon" />
                         </template>
                    </v-text-field>
               </div>
               <v-btn color="main" @click="abrirCriar()">Adicionar</v-btn>
          </div>
     </div>
     <v-row class="mt-10">
          <v-col cols="12" xl="4" lg="6" v-for="(produto, index) in produtosFiltrados" :key="produto.codigo">
               <v-card class="pa-5" @click="abrirEditar(produto)">
                    <div class="d-flex">
                         <div class="mr-3">
                              <v-img width="100" height="100" cover :key="produto.codigo + produto.data_alteracao"
                                   :src="`${api.defaults.baseURL}/arquivos/produtos/${produto.codigo}/1.webp?v=${produto.data_alteracao || Date.now()}`">
                                   <template #placeholder>
                                        <div class="d-flex align-center justify-center fill-height">
                                             <v-progress-circular color="main" indeterminate size="36" />
                                        </div>
                                   </template>
                                   <template #error>
                                        <div class="d-flex align-center justify-center fill-height bg-grey-lighten-3">
                                             <HugeiconsIcon :size="70" class="opacity-30" :icon="ImageDelete01Icon" />
                                        </div>
                                   </template>
                              </v-img>
                         </div>
                         <div>
                              <h2>{{ produto.nome }}</h2>
                              <v-chip class="mt-1" style="max-width: 70%;">
                                   <HugeiconsIcon :size="16" :icon="QrCode01Icon" />
                                   <p class="ml-2 text-ellipsis">{{ produto.codigo.toUpperCase() }}</p>
                              </v-chip>
                         </div>
                    </div>

                    <div class="d-flex align-center justify-space-between mt-5">
                         <div>
                              <p class="subText">Preço</p>
                              <h1 class="f-regular">R$ {{ substituiPontoPorVirgula(produto.preco) }}</h1>
                         </div>
                         <div v-if="produto.tempo_medio">
                              <p class="subText">Tempo Médio</p>
                              <h1 class="f-regular">{{ produto.tempo_medio.horas }}h{{ produto.tempo_medio.minutos }}m
                              </h1>
                         </div>
                    </div>
               </v-card>
          </v-col>
     </v-row>

     <ProdutoFormDialog @excluir="excluirProduto" v-model="dialogProdutoForm" @salvo="salvarProduto"
          :produto="produtoSelecionado" />
</template>

<script lang="ts" setup>
import { ProdutosServices } from '@/modules/produtos/produtos.services';
import type { ProdutoView, ProdutoForm } from '@/modules/produtos/produtos.types';
import { computed, onMounted, ref } from 'vue';
import { usarFeedbackStore } from '@/stores/feedbacks.store';

import { HugeiconsIcon } from '@hugeicons/vue';
import { ImageDelete01Icon, QrCode01Icon, Search02Icon } from '@hugeicons/core-free-icons';
import { substituiPontoPorVirgula } from '@/utils/substituirPontoPorVirgula';
import ProdutoFormDialog from '@/components/ProdutoFormDialog.vue';
import { api } from '@/plugins/api';
import { normalizarTextoBusca } from '@/utils/normalizarTextoBusca';

const feedback = usarFeedbackStore()

const produtos = ref<ProdutoView[]>([])
const produtoSelecionado = ref<ProdutoView | null>(null)

const filtroProdutos = ref<string>('')
const produtosFiltrados = computed(() => {
     if(!filtroProdutos.value || filtroProdutos.value == '') return produtos.value

     const termos = normalizarTextoBusca(filtroProdutos.value).split(/\s+/)

     return produtos.value.filter(p => {
          const nome = normalizarTextoBusca(p.nome)
          return termos.every(termo => nome.includes(termo))
     })
})

const dialogProdutoForm = ref(false)

async function listarProdutos() {
     const response = await ProdutosServices.listar()
     produtos.value = response
}

async function salvarProduto(produto: Partial<ProdutoForm>) {
     await ProdutosServices.salvar(produto)
     dialogProdutoForm.value = false
     feedback.sucesso('Produto criado/editado com sucesso')
     await listarProdutos()
}

async function excluirProduto(codigo: string | number) {
     await ProdutosServices.excluir(String(codigo))
     await listarProdutos()
     dialogProdutoForm.value = false
     feedback.sucesso('Produto excluído com sucesso')
}

function abrirCriar() {
     produtoSelecionado.value = null
     dialogProdutoForm.value = true
}

async function abrirEditar(produto: ProdutoView) {
     const produtoCompleto = await ProdutosServices.listarPorCodigo(produto.codigo)
     produtoSelecionado.value = produtoCompleto
     dialogProdutoForm.value = true
     console.log(produtoSelecionado.value)
}

onMounted(() => {
     listarProdutos()
})

</script>