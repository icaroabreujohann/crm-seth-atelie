<template>
     <div class="w-100 mb-5 d-flex align-end justify-space-between">
          <h1 class="mb-n2">Produtos</h1>
          <div class="d-flex align-end w-50 justify-end">
               <div class="w-50">
                    <v-text-field density="compact" class="mr-3" variant="solo-filled" label="Pesquise por um produto"
                         prepend-inner-icon="mdi-account-search-outline" hide-details>
                         <template #prepend-inner>
                              <HugeiconsIcon class="subText" :stroke-width="2" :size="20" :icon="Search02Icon" />
                         </template>
                    </v-text-field>
               </div>
               <v-btn color="main" @click="abrirCriar()">Adicionar</v-btn>
          </div>
     </div>
     <v-row class="mt-10">
          <v-col cols="12" xl="4" lg="6" v-for="(produto, index) in produtos">
               <v-card class="pa-5" @click="abrirEditar(produto)">
                    <div class="d-flex">
                         <div class="mr-3">
                              <v-img width="100" height="100" cover
                                   :src="`${api.defaults.baseURL}/arquivos/produtos/${produto.codigo}/1.webp`"></v-img>
                         </div>
                         <div>
                              <h2>{{ produto.nome }}</h2>
                              <v-chip class="mt-1" style="max-width: 70%;">
                                   <HugeiconsIcon :size="16" :icon="QrCode01Icon"/>
                                   <p class="ml-2 text-ellipsis">{{ produto.codigo.toUpperCase() }}</p>
                              </v-chip>
                         </div>
                    </div>

                    <div class="d-flex align-center justify-space-between mt-5">
                         <div>
                              <p class="subText">Preço</p>
                              <h1 class="f-regular">R$ {{substituiPontoPorVirgula(produto.preco) }}</h1>
                         </div>
                         <div v-if="produto.tempo_medio">
                              <p class="subText">Tempo Médio</p>
                              <h1 class="f-regular">{{ produto.tempo_medio.horas }}h{{ produto.tempo_medio.minutos }}m</h1>
                         </div>
                    </div>
               </v-card>
          </v-col>
     </v-row>

     <ProdutoFormDialog v-model="dialogProdutoForm" @salvo="salvarProduto"/>
</template>

<script lang="ts" setup>
import { ProdutosServices } from '@/modules/produtos/produtos.services';
import type { ProdutoView, ProdutoForm } from '@/modules/produtos/produtos.types';
import { onMounted, ref } from 'vue';
import { usarFeedbackStore } from '@/stores/feedbacks.store';

import { HugeiconsIcon } from '@hugeicons/vue';
import { QrCode01Icon, Search02Icon } from '@hugeicons/core-free-icons';
import { substituiPontoPorVirgula } from '@/utils/substituirPontoPorVirgula';
import ProdutoFormDialog from '@/components/ProdutoFormDialog.vue';
import { api } from '@/plugins/api';

const feedback = usarFeedbackStore()

const produtos = ref<ProdutoView[]>([])
const produtoSelecionado = ref<ProdutoView | null>(null)

const dialogProdutoForm = ref(true)

async function listarProdutos() {
     const response = await ProdutosServices.listar()
     produtos.value = response
     console.log(response)
}

async function salvarProduto(produto: ProdutoForm) {
     await ProdutosServices.salvar(produto)
     await listarProdutos()
     dialogProdutoForm.value = false
     feedback.sucesso('Cliente criado/editado com sucesso')
}

function abrirCriar() {
     produtoSelecionado.value = null
     dialogProdutoForm.value = true
}

function abrirEditar(produto: ProdutoView) {
     produtoSelecionado.value = produto
     dialogProdutoForm.value = true
}

onMounted(() => {
     listarProdutos()
})

</script>