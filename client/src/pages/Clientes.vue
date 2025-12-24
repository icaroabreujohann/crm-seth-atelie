<template>
     <div class="w-100 mb-5 d-flex align-end justify-space-between">
          <h1 class="mb-n2">Clientes</h1>
          <div class="d-flex align-end w-50 justify-end">
               <div class="w-50">
                    <v-text-field density="compact" class="mr-3" variant="solo-filled" label="Pesquise por um cliente"
                         prepend-inner-icon="mdi-account-search-outline" hide-details v-model="filtroClientes">
                         <template #prepend-inner>
                              <HugeiconsIcon class="subText" stroke-width="2" size="20" :icon="Search02Icon" />
                         </template>
                    </v-text-field>
               </div>
               <v-btn color="main" @click="abrirCriar()">Adicionar</v-btn>
          </div>
     </div>

     <v-data-table :items="clientesFiltrados" :headers="clientesHeaders">
          <template #item.acoes="{ item }">
               <MenuAcoes @editar="abrirEditar(item)" @excluir="abrirExcluir(item)" />
          </template>
     </v-data-table>

     <ClienteFormDialog v-model="dialogFormCliente" :cliente="clienteSelecionado" @salvo="salvarCliente" />
     <ConfirmaExclusao v-if="clienteSelecionado" :identificador="clienteSelecionado.id" :tipo="'cliente'"
          v-model="dialogConfirmaExclusao" @excluir="excluirCliente" />

</template>

<script lang="ts" setup>
import { onMounted, ref, computed } from 'vue'
import { usarFeedbackStore } from '@/stores/feedbacks.store'

import { type Cliente, type ClienteForm } from '@/modules/clientes/clientes.types'
import { ClientesServices } from '@/modules/clientes/clientes.services'

import { HugeiconsIcon } from '@hugeicons/vue'
import { Search02Icon } from '@hugeicons/core-free-icons'

import ClienteFormDialog from '@/components/ClienteFormDialog.vue'
import ConfirmaExclusao from '@/components/common/ConfirmaExclusao.vue'
import MenuAcoes from '@/components/common/MenuAcoes.vue'
import { formatarDataHoraBR } from '@/utils/formataData'

const feedback = usarFeedbackStore()

const clientes = ref<Cliente[]>([])
const clienteSelecionado = ref<Cliente | null>(null)
const clientesHeaders = [
     { title: 'Nome', value: 'nome', sortable: true },
     { title: 'Instagram', value: 'instagram', sortable: true },
     { title: 'Telefone', value: 'telefone', sortable: true },
     { title: 'Data Atualização', value: 'data_atualizacao', sortable: true },
     { title: 'Ações', value: 'acoes', width: '10%' }
]

const clientesFiltrados = computed(() => {
     if (!filtroClientes.value) return clientes.value

     const termo = filtroClientes.value.toLowerCase()

     return clientes.value.filter(cliente =>
          cliente.nome.toLowerCase().includes(termo) ||
          cliente.instagram?.toLowerCase().includes(termo) ||
          cliente.telefone?.includes(termo)
     )
})

const dialogFormCliente = ref(false)
const dialogConfirmaExclusao = ref(false)
const filtroClientes = ref('')

async function listarClientes() {
     const response = await ClientesServices.listar()
     clientes.value = response.map(cliente => ({
          ...cliente,
          data_atualizacao: formatarDataHoraBR(cliente.data_atualizacao)
     }))
}

async function salvarCliente(form: ClienteForm) {
     await ClientesServices.salvar(form)
     listarClientes()
     dialogFormCliente.value = false
     clienteSelecionado.value = null
     feedback.sucesso('Cliente criado com sucesso')
}

async function excluirCliente(identificador: number | string) {
     const id = Number(identificador)

     if (!Number.isInteger(id)) {
          throw new Error('ID inválido para cliente')
     }


     await ClientesServices.excluir(id)
     listarClientes()
     dialogConfirmaExclusao.value = false
     clienteSelecionado.value = null
     feedback.sucesso('Cliente excluido com sucesso')
}

function abrirCriar() {
     clienteSelecionado.value = null
     dialogFormCliente.value = true
}

function abrirEditar(cliente: Cliente) {
     clienteSelecionado.value = cliente
     dialogFormCliente.value = true
}

function abrirExcluir(cliente: Cliente) {
     clienteSelecionado.value = cliente
     dialogConfirmaExclusao.value = true
}

onMounted(() => {
     listarClientes()
})

</script>

<style scoped></style>