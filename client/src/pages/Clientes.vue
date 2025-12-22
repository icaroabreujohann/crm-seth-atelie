<template>
     <div class="w-100 mb-5 d-flex align-end justify-space-between">
          <h1 class="mb-n2">Clientes</h1>
          <div class="d-flex align-end w-50 justify-end">
               <div class="w-50">
                    <v-text-field density="compact" class="mr-3" variant="solo-filled" label="Pesquise por um cliente"
                         prepend-inner-icon="mdi-account-search-outline" hide-details />
               </div>
               <v-btn color="main" @click="abrirCriar()">Adicionar</v-btn>
          </div>
     </div>

     <v-data-table :items="clientes" :headers="clientesHeaders">
          <template #item.acoes="{ item }">
               <MenuAcoes 
                    @editar="abrirEditar(item)"
               />
          </template>
     </v-data-table>

     <ClienteFormDialog v-model="dialogFormCliente" :cliente="clienteSelecionado" @salvo="salvarCliente" />

</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { usarFeedbackStore } from '@/stores/feedbacks.store'

import { type Cliente, type ClienteForm } from '@/modules/clientes/clientes.types'
import { ClientesServices } from '@/modules/clientes/clientes.services'

import ClienteFormDialog from '@/components/ClienteFormDialog.vue'
import MenuAcoes from '@/components/common/MenuAcoes.vue'

const feedback = usarFeedbackStore()

const clientes = ref<Cliente[]>([])
const clienteSelecionado = ref<Cliente | null>(null)
const clientesHeaders = [
     { title: 'Nome', value: 'nome' },
     { title: 'Instagram', value: 'instagram' },
     { title: 'Telefone', value: 'telefone' },
     { title: 'Ações', value: 'acoes', width: '10%' }
]

const dialogFormCliente = ref(false)

async function listarClientes() {
     clientes.value = await ClientesServices.listar()
}

async function salvarCliente(form: ClienteForm) {
     await ClientesServices.salvar(form)
     listarClientes()
     dialogFormCliente.value = false
     clienteSelecionado.value = null
     feedback.sucesso('Cliente criado com sucesso')
}

function abrirCriar() {
     clienteSelecionado.value = null
     dialogFormCliente.value = true
}

function abrirEditar(cliente: Cliente) {
     clienteSelecionado.value = cliente
     dialogFormCliente.value = true
}

onMounted(() => {
     listarClientes()
})

</script>

<style scoped></style>