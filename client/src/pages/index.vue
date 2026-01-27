<template>
     <v-container fluid style="height: 80vh;" class="pa-0 d-flex flex-column">
          <div class="d-flex align-center">
               <HugeiconsIcon class="text-light" :stroke-width="2" :size="36" :icon="ShoppingBasket01Icon" />
               <h1 class="ml-2">Início</h1>
          </div>
          <v-row class="mt-5 flex-grow-1 h-0">
               <v-col cols="7">
                    <v-card class="pa-10 h-100">
                    </v-card>
               </v-col>
               <v-col cols="5">
                    <v-card class="pa-10 h-100 d-flex flex-column">
                         <div>
                              <div class="d-flex align-center">
                                   <HugeiconsIcon class="text-light" :icon="ShoppingCart02Icon" />
                                   <h2 class="ml-2">Entregas Pendentes</h2>
                              </div>
                              <div class="d-flex align-center justify-space-between mt-10">
                                   <h2 class="f-regular">{{ tituloMes.mes }}, {{ tituloMes.ano }}</h2>
                                   <div class="d-flex align-center">
                                        <v-btn size="30" icon variant="tonal" class="mr-2" @click="mesAnterior">
                                             <HugeiconsIcon :icon="ArrowLeft01Icon" />
                                        </v-btn>
                                        <v-btn size="30" icon color="main" @click="proximoMes">
                                             <HugeiconsIcon :icon="ArrowRight01Icon" />
                                        </v-btn>
                                   </div>
                              </div>
                         </div>

                         <v-list class="mt-5 flex-grow-1 overflow-y-auto" style="min-height: 0;"
                              v-if="encomendasDoMes.length">
                              <v-list-item v-for="item in encomendasDoMes" :key="item.codigo" class="pa-0">
                                   <v-card class="d-flex pa-6 mb-3 align-center">
                                        <div>
                                             <h2 class="f-regular text-center">{{ item.data_prazo?.slice(8) }}</h2>
                                             <p class="text-center">{{ tituloMes.mes_abreviado }}</p>
                                        </div>
                                        <v-divider class="mx-6 my-5" vertical />
                                        <v-card class="pa-5 d-flex w-100">
                                             <div class="align-start">
                                                  <v-img class="flex-shrink-0" width="3vw" height="6vh" cover
                                                       :key="item.produto_codigo + item.data_criacao"
                                                       :src="`${api.defaults.baseURL}/arquivos/produtos/${item.produto_codigo}/1.webp?v=${Date.now()}`">
                                                       <template #placeholder>
                                                            <div class="d-flex align-center justify-center fill-height">
                                                                 <v-progress-circular color="main" indeterminate
                                                                      size="36" />
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
                                             </div>

                                             <div class="ml-3">
                                                  <h3>{{ item.cliente_nome }}</h3>
                                                  <p>{{ item.produto_nome }}</p>
                                             </div>
                                        </v-card>
                                   </v-card>
                              </v-list-item>
                         </v-list>

                         <!-- <v-virtual-scroll class="mt-5 flex-grow-1" :items="encomendasDoMes"
                              v-if="encomendasDoMes.length" style="min-height: 0;">
                              <template #default="{ item }">
                                   <v-card class="d-flex pa-6 mb-3 align-center">
                                        <div>
                                             <h2 class="f-regular text-center">{{ item.data_prazo?.slice(8) }}</h2>
                                             <p class="text-center">{{ tituloMes.mes_abreviado }}</p>
                                        </div>
                                        <v-divider class="mx-6 my-5" vertical />
                                        <v-card class="pa-5 d-flex w-100">
                                             <div class="align-start">
                                                  <v-img class="flex-shrink-0" width="3vw" height="6vh" cover
                                                       :key="item.produto_codigo + item.data_criacao"
                                                       :src="`${api.defaults.baseURL}/arquivos/produtos/${item.produto_codigo}/1.webp?v=${Date.now()}`">
                                                       <template #placeholder>
                                                            <div class="d-flex align-center justify-center fill-height">
                                                                 <v-progress-circular color="main" indeterminate
                                                                      size="36" />
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
                                             </div>

                                             <div class="ml-3">
                                                  <h3>{{ item.cliente_nome }}</h3>
                                                  <p>{{ item.produto_nome }}</p>
                                             </div>
                                        </v-card>
                                   </v-card>
                              </template>
                         </v-virtual-scroll> -->
                    </v-card>
               </v-col>
          </v-row>
     </v-container>
</template>

<script setup lang="ts">
import { HugeiconsIcon } from '@hugeicons/vue';
import { ArrowLeft01Icon, ArrowRight01Icon, ImageDelete01Icon, ShoppingBasket01Icon, ShoppingCart02Icon } from '@hugeicons/core-free-icons';
import { usarClienteStore } from '@/stores/clientes.store';
import { usarProdutoStore } from '@/stores/produtos.store';
import { usarEncomendaStore } from '@/stores/encomendas.store';
import { computed, onMounted, ref } from 'vue';
import { useAgendaEncomendas } from '@/composables/useAgendaEncomendas';
import { storeToRefs } from 'pinia';
import { api } from '@/plugins/api';

const clienteStore = usarClienteStore()
const produtoStore = usarProdutoStore()
const encomendaStore = usarEncomendaStore()

const clientes = storeToRefs(clienteStore)
const produtos = storeToRefs(produtoStore)
const { encomendas } = storeToRefs(encomendaStore)

const mesAtual = ref(new Date())

const tituloMes = computed(() => {
     const data = mesAtual.value
     const mesCompleto = data.toLocaleString('pt-BR', { month: 'long' })
     const ano = data.getFullYear().toString()

     return {
          mes: mesCompleto.charAt(0).toUpperCase() + mesCompleto.slice(1),
          mes_abreviado: mesCompleto.charAt(0).toUpperCase() + mesCompleto.slice(1, 3),
          ano
     }
})

const encomendasDoMes = computed(() => {
     const mes = mesAtual.value.getMonth()
     const ano = mesAtual.value.getFullYear()

     return encomendas.value
          .filter(e => {
               if (!e.data_prazo) return false

               const data = new Date(e.data_prazo)
               return (
                    data.getMonth() === mes &&
                    data.getFullYear() === ano &&
                    !e.finalizado
               )
          })
          .sort((a, b) => {
               const dataA = new Date(a.data_prazo!).getTime()
               const dataB = new Date(b.data_prazo!).getTime()
               return dataA - dataB // crescente
          })
})

function proximoMes() {
     const d = new Date(mesAtual.value)
     d.setMonth(d.getMonth() + 1)
     mesAtual.value = d
}

function mesAnterior() {
     const d = new Date(mesAtual.value)
     d.setMonth(d.getMonth() - 1)
     mesAtual.value = d
}

onMounted(() => {
     clienteStore.buscaClientes()
     produtoStore.buscaProdutos()
     encomendaStore.buscaEncomendas()
})



</script>