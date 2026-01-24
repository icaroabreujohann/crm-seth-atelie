<template>
     <div class="w-100 mb-5 d-flex align-center justify-space-between">
          <div class="d-flex align-center">
               <HugeiconsIcon class="text-light" :stroke-width="2" :size="30" :icon="ShoppingCart02Icon" />
               <h1 class="ml-2">Encomendas</h1>
          </div>
          <v-btn color="main" @click="abrirCriar">Adicionar</v-btn>
     </div>

     <div>
          <div class="d-flex align-center">
               <HugeiconsIcon class="text-light" :stroke-width="2" :size="24" :icon="FilterIcon" />
               <h2 class="ml-2 mr-2">Filtros</h2>
               <v-btn icon @click="mostrarIcones = !mostrarIcones" density="compact" class="ml-2 btn-border">
                    <template #default>
                         <HugeiconsIcon :stroke-width="2" :size="16"
                              :icon="mostrarIcones ? ArrowDown01Icon : ArrowRight01Icon" />
                    </template>
               </v-btn>
          </div>
          <v-row class="mt-3" v-if="mostrarIcones">
               <v-col cols="3">
                    <p>Cliente</p>
                    <v-autocomplete variant="solo-filled" clearable :items="clienteStore.clientes" item-title="nome"
                         item-value="id" hide-details v-model="clienteSelecionado" spellcheck="false"/>
               </v-col>
               <v-col cols="3">
                    <p>Produto</p>
                    <v-autocomplete variant="solo-filled" clearable :items="produtoStore.produtos" item-title="nome"
                         item-value="codigo" hide-details v-model="produtoSelecionado" spellcheck="false" />
               </v-col>
               <v-col cols="2">
                    <p>Entregue?</p>
                    <v-select variant="solo-filled" :items="filtrosBooleanos" item-title="title" item-value="value"
                         v-model="filtroEntregue" hide-details />
               </v-col>
               <v-col cols="2">
                    <p>Pago?</p>
                    <v-select variant="solo-filled" :items="filtrosBooleanos" item-title="title" item-value="value"
                         v-model="filtroPago" hide-details />
               </v-col>
               <v-col cols="2">
                    <p>Finalizado?</p>
                    <v-select variant="solo-filled" :items="filtrosBooleanos" item-title="title" item-value="value"
                         v-model="filtroFinalizado" hide-details />
               </v-col>
          </v-row>
     </div>

     <v-row class="mt-5">
          <v-col cols="12" xl="4" lg="6" v-for="e in encomendasFiltradas" :key="e.codigo">
               <v-card class="pa-5" @click="abrirEditar(e)" :class="e.finalizado ? 'encomendaFinalizada' : '' ">
                    <div class="d-flex">
                         <div class="mr-3">
                              <v-img width="7.5vw" height="15vh" cover :key="e.produto_codigo + e.data_criacao"
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
                                   <HugeiconsIcon :storke-width="16" class="text-light mr-1" :icon="UserCircleIcon" />
                                   <h2>{{ e.cliente_nome }}</h2>
                              </div>
                              <div class="d-flex align-center mt-1">
                                   <HugeiconsIcon :storke-width="16" class="text-light mr-1" :icon="Tag01Icon" />
                                   <h2>{{ e.produto_nome }}</h2>
                              </div>
                              <!-- <v-chip class="mt-1">
                                   <HugeiconsIcon :size="16" :icon="QrCode01Icon" />
                                   <p class="ml-2 text-ellipsis">{{ e.data_pedido }}</p>
                              </v-chip> -->
                              <div class="d-flex align-center mt-4">
                                   <div class="mx-2">
                                        <p>Data do Pedido</p>
                                        <h4 v-if="e.data_pedido">{{ formatarDataDDMMYYYY(e.data_pedido)}}</h4>
                                   </div>
                                   <div class="mx-2">
                                        <p>Data do Prazo</p>
                                        <h4 v-if="e.data_prazo">{{ formatarDataDDMMYYYY(e.data_prazo) }}</h4>
                                        <h4 v-if="!e.data_prazo" class="subText">Sem Prazo</h4>
                                   </div>
                              </div>
                         </div>
                    </div>
               </v-card>
          </v-col>
     </v-row>

     <EncomendaFormDialog v-model="dialogEncomendaForm" :encomenda="encomendaSelecionada" @salvar="salvarEncomenda"
          @excluir="excluirEncomenda" />
</template>

<script setup lang="ts">
import { HugeiconsIcon } from '@hugeicons/vue';
import { ArrowDown01Icon, ArrowRight01Icon, CircleArrowDown01Icon, CircleArrowDown02Icon, CircleArrowRight01Icon, FilterIcon, ImageDelete01Icon, QrCode01Icon, Search02Icon, ShoppingCart02Icon, Tag01Icon, UserCircleIcon } from '@hugeicons/core-free-icons'
import { ref, onMounted, computed } from 'vue';
import type { EncomendaForm, EncomendaView } from '@/modules/encomendas/encomendas.types';
import { EncomendasServices } from '@/modules/encomendas/encomendas.services';
import { api } from '@/plugins/api';
import EncomendaFormDialog from '@/components/EncomendaFormDialog.vue';
import { usarFeedbackStore } from '@/stores/feedbacks.store';
import { usarClienteStore } from '@/stores/clientes.store';
import { usarProdutoStore } from '@/stores/produtos.store';
import { formatarDataBR, formatarDataDDMMYYYY } from '@/utils/formataData';

const feedback = usarFeedbackStore()
const clienteStore = usarClienteStore()
const produtoStore = usarProdutoStore()

const encomendas = ref<EncomendaView[]>([])
const encomendaSelecionada = ref<EncomendaView | null>(null)


const dialogEncomendaForm = ref(false)
const mostrarIcones = ref(true)

const filtrosBooleanos = [
     { title: 'Sim', value: true },
     { title: 'Não', value: false },
     { title: 'Todos', value: null },
]
const clienteSelecionado = ref<number | null>(null)
const produtoSelecionado = ref<string | null>(null)
const filtroEntregue = ref<boolean | null>(null)
const filtroPago = ref<boolean | null>(null)
const filtroFinalizado = ref<boolean | null>(null)

const encomendasFiltradas = computed(() => {
     return encomendas.value.filter(e => {
          if (clienteSelecionado.value && e.cliente_id !== clienteSelecionado.value) return false
          if (produtoSelecionado.value && e.produto_codigo !== produtoSelecionado.value) return false
          if (filtroEntregue.value !== null && e.entregue !== filtroEntregue.value) return false
          if (filtroPago.value !== null && e.pagamento_realizado !== filtroPago.value) return false
          if (filtroFinalizado.value !== null && e.finalizado !== filtroFinalizado.value) return false
          return true
     })
})


async function listarEncomendas() {
     const response = await EncomendasServices.listar()
     encomendas.value = response
}

function abrirCriar() {
     encomendaSelecionada.value = null
     dialogEncomendaForm.value = true
}

async function abrirEditar(encomenda: EncomendaView) {
     const encomendaCompleta = await EncomendasServices.listarPorCodigo(encomenda.codigo)
     encomendaSelecionada.value = encomendaCompleta
     dialogEncomendaForm.value = true
}

async function salvarEncomenda(encomenda: Partial<EncomendaForm>) {
     await EncomendasServices.salvar(encomenda)
     dialogEncomendaForm.value = false
     feedback.sucesso('Encomenda criada/editada com sucesso.')
     await listarEncomendas()
}

async function excluirEncomenda(codigo: string) {
     await EncomendasServices.excluir(codigo)
     dialogEncomendaForm.value = false
     feedback.sucesso('Encomenda excluida com sucesso')
     await listarEncomendas()
}

onMounted(() => {
     clienteStore.buscaClientes()
     produtoStore.buscaProdutos()
     listarEncomendas()
})

</script>

<style>
     .encomendaFinalizada {
          opacity: 50%;
          filter: saturate(0%);
     }
</style>