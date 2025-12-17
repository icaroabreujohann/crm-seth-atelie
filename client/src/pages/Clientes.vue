<template>
     <v-data-table
          :items="clientes"
          :headers="clientesHeaders"
     ></v-data-table>
</template>

<script lang="ts" setup>
import { type Cliente } from '@/modules/clientes/clientes.types';
import { ClientesServices } from '@/modules/clientes/clientes.services';
import { onMounted, ref } from 'vue'


const clientes = ref<Cliente[]>([])
const clientesHeaders = [
     { title: 'Nome', value: 'nome' },
     { title: 'Instagram', value: 'instagram' },
     { title: 'Telefone', value: 'telefone' },
]

async function listarClientes() {
     clientes.value = await ClientesServices.listar()
}

onMounted(() => {
     listarClientes()
})

</script>