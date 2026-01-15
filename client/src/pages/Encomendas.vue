<template>
     <div class="w-100 mb-5 d-flex align-center justify-space-between">
          <div class="d-flex align-center">
               <HugeiconsIcon class="text-light" :stroke-width="2" :size="30" :icon="ShoppingCart02Icon" />
               <h1 class="ml-2">Encomendas</h1>
          </div>
          <v-btn color="main">Adicionar</v-btn>
     </div>

     <v-row class="mt-10">
          <v-col cols="12" xl="4" lg="6" v-for="e in encomendas" :key="e.codigo">
               <v-card class="pa-5">
                    <div class="d-flex">
                         <div class="mr-3">
                              <v-img width="100" height="100" cover :key="e.produto_codigo + e.data_criacao"
                                   :src="`${api.defaults.baseURL}/arquivos/produtos/${e.produto_codigo}/1.webp?v=${Date.now()}`">
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
                              <div class="d-flex align-center">
                                   <HugeiconsIcon :storke-width="16" class="text-light mr-1" :icon="UserCircleIcon"/>
                                   <h2>{{ e.cliente_nome }}</h2>
                              </div>
                              <div class="d-flex align-center">
                                   <HugeiconsIcon :storke-width="16" class="text-light mr-1" :icon="Tag01Icon"/>
                                   <h2>{{ e.produto_nome }}</h2>
                              </div>
                              <v-chip class="mt-1" style="max-width: 70%;">
                                   <HugeiconsIcon :size="16" :icon="QrCode01Icon" />
                                   <p class="ml-2 text-ellipsis">{{ e.codigo.toUpperCase() }}</p>
                              </v-chip>
                         </div>
                    </div>
               </v-card>
          </v-col>
     </v-row>
</template>

<script setup lang="ts">
import { HugeiconsIcon } from '@hugeicons/vue';
import { ImageDelete01Icon, QrCode01Icon, Search02Icon, ShoppingCart02Icon, Tag01Icon, UserCircleIcon } from '@hugeicons/core-free-icons'
import { ref, onMounted } from 'vue';
import type { EncomendaView } from '@/modules/encomendas/encomendas.types';
import { EncomendasServices } from '@/modules/encomendas/encomendas.services';
import { api } from '@/plugins/api';

const encomendas = ref<EncomendaView[]>([])

async function listarEncomendas() {
     const response = await EncomendasServices.listar()

     encomendas.value = response
}

onMounted(() => {
     listarEncomendas()
})

</script>