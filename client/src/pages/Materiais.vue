<template>
     <div class="w-100 mb-5 d-flex align-end justify-space-between">
          <h1 class="mb-n2">Materiais</h1>
          <div class="d-flex align-end w-50 justify-end">
               <div class="w-50">
                    <v-text-field density="compact" class="mr-3" variant="solo-filled" label="Pesquise por um material"
                         prepend-inner-icon="mdi-account-search-outline" hide-details>
                         <template #prepend-inner>
                              <HugeiconsIcon class="subText" stroke-width="2" size="20" :icon="Search02Icon" />
                         </template>
                    </v-text-field>
               </div>
               <v-btn color="main" @click="">Adicionar</v-btn>
          </div>
     </div>

     <v-data-table :items="materiais" :headers="materiaisHeaders">
          <template v-slot:item.unidade_medida_sigla="{ item }">
               <p>{{ item.unidade_medida_sigla.toUpperCase() }}</p>
          </template>
          <template v-slot:item.preco="{ item }">
               <p>R$ {{ item.preco }}</p>
          </template>
          <template v-slot:item.preco_x_qtd="{ item }">
               <p>R$ {{ item.preco_x_qtd }}</p>
          </template>
          <template #item.acoes="{ item }">
               <MenuAcoes @editar="" @excluir="" />
          </template>
     </v-data-table>

     <MaterialFormDialog
          v-model="dialogFormMaterial"
          :material="materialSelecionado"
          @salvo=""
     />
</template>

<script lang="ts" setup>
import { MateriaisServices } from '@/modules/materiais/materiais.services'
import type { MaterialCompleto } from '@/modules/materiais/materiais.types'
import { formatarDataHoraBR } from '@/utils/formataData'

import MenuAcoes from '@/components/common/MenuAcoes.vue'
import MaterialFormDialog from '@/components/MaterialFormDialog.vue'

import { HugeiconsIcon } from '@hugeicons/vue'
import { Search02Icon } from '@hugeicons/core-free-icons'

import { onMounted, ref } from 'vue'


const materiais = ref<MaterialCompleto[]>([])
const materiaisHeaders = [
     { title: 'Nome', value: 'nome', sortable: true },
     { title: 'Tipo', value: 'tipo_nome' },
     { title: 'Unidade Medida', value: 'unidade_medida_sigla', sortable: true },
     { title: 'Preço', value: 'preco', sortable: true },
     { title: 'Quantidade', value: 'quantidade', sortable: true },
     { title: 'Preço X Qtd', value: 'preco_x_qtd', sortable: true },
     { title: 'Data Alteração', value: 'data_alteracao', sortable: true },
     { title: 'Ações', value: 'acoes', width: '10%' }
]
const materialSelecionado = ref<MaterialCompleto | null>(null)

const dialogFormMaterial = ref(true)

async function listarMateriais() {
     const response = await MateriaisServices.listar()
     materiais.value = response.map(mat => ({
          ...mat,
          data_alteracao: String(formatarDataHoraBR(mat.data_alteracao)),
          data_criacao: String(formatarDataHoraBR(mat.data_criacao)),
     }))
}

onMounted(() => {
     listarMateriais()
})

</script>