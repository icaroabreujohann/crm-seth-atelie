<template>
     <div class="d-flex align-center">
          <HugeiconsIcon class="text-light" :stroke-width="2" :size="36" :icon="ShoppingBasket01Icon" />
          <h1 class="ml-2">Início</h1>
     </div>
     <v-row class="mt-5">
          <v-col cols="4">
               <v-card class="pa-10">
                    <div class="d-flex align-center">
                         <HugeiconsIcon class="text-light" :stroke-width="2" :size="24" :icon="UserGroupIcon" />
                         <h2 class="f-regular text-black ml-2">Clientes</h2>
                    </div>
                    <h1 class="f-bold" style="font-size: 3rem;">{{ clientes.length }}</h1>
               </v-card>
          </v-col>
          <v-col cols="4">
               <v-card class="pa-10">
                    <div class="d-flex align-center">
                         <HugeiconsIcon class="text-light" :stroke-width="2" :size="24" :icon="ShoppingCart02Icon" />
                         <h2 class="f-regular text-black ml-2">Encomendas</h2>
                    </div>
                    <div class="d-flex align-center justify-space-between">
                         <h1 class="f-bold" style="font-size: 3rem;">{{ encomenda.length }}</h1>
                         <v-chip color="green"><p>+57% </p> <HugeiconsIcon :icon="ArrowUpRight03Icon"/></v-chip>
                    </div>
               </v-card>
          </v-col>
          <v-col cols="4">
               <v-card class="pa-10">
                    
               </v-card>
          </v-col>
     </v-row>
</template>

<script setup lang="ts">
import { HugeiconsIcon } from '@hugeicons/vue';
import { ArrowUpRight03Icon, ShoppingBasket01Icon, ShoppingCart01Icon, ShoppingCart02Icon, UserGroupIcon } from '@hugeicons/core-free-icons';
import { usarClienteStore } from '@/stores/clientes.store';
import { usarProdutoStore } from '@/stores/produtos.store';
import { usarEncomendaStore } from '@/stores/encomendas.store';
import { onMounted, ref } from 'vue';
import type { Cliente } from '@/modules/clientes/clientes.types';
import type { ProdutoView } from '@/modules/produtos/produtos.types';
import type { EncomendaView } from '@/modules/encomendas/encomendas.types';

const clienteStore = usarClienteStore()
const produtoStore = usarProdutoStore()
const encomendaStore = usarEncomendaStore()

const clientes = ref<Cliente[]>([])
const produtos = ref<ProdutoView[]>([])
const encomenda = ref<EncomendaView[]>([])

onMounted(() => {
     clienteStore.buscaClientes()
     produtoStore.buscaProdutos()
     encomendaStore.buscaEncomendas()

     clientes.value = clienteStore.clientes
     produtos.value = produtoStore.produtos
     encomenda.value = encomendaStore.encomendas
})

</script>