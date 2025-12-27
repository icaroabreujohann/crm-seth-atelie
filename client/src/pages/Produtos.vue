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
               <v-btn color="main" @click="">Adicionar</v-btn>
          </div>
     </div>
     <v-row class="mt-10">
          <v-col cols="12" xl="4" lg="6" v-for="(produto, index) in produtos">
               <v-card class="pa-5">
                    <h2>{{ produto.nome }}</h2>
                    <v-chip>
                         <HugeiconsIcon :size="20" :stroke-width="1.3" :icon="Money03Icon"/>
                         <p class="ml-1">R${{ substituiPontoPorVirgula(produto.preco) }}</p>
                    </v-chip>
               </v-card>
          </v-col>
     </v-row>

     <MaterialSelectDialog v-model="dialogMaterialSelect"/>
</template>

<script lang="ts" setup>
import { ProdutosServices } from '@/modules/produtos/produtos.services';
import type { Produto } from '@/modules/produtos/produtos.types';
import { formatarDataHoraBR } from '@/utils/formataData';
import { onMounted, ref } from 'vue';

import { HugeiconsIcon } from '@hugeicons/vue';
import { Money03Icon, Search02Icon } from '@hugeicons/core-free-icons';
import { substituiPontoPorVirgula } from '@/utils/substituirPontoPorVirgula';

import MaterialSelectDialog from '@/components/MaterialSelectDialog.vue';

const produtos = ref<Produto[]>([])

const dialogMaterialSelect = ref(true)

async function listarProdutos() {
     const response = await ProdutosServices.listar()
     produtos.value = response
     console.log(response)
}

onMounted(() => {
     listarProdutos()
})

</script>