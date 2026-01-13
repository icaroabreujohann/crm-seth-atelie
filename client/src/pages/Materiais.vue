<template>
     <div class="w-100 mb-5 d-flex align-end justify-space-between">
          <h1 class="mb-n2">Materiais</h1>
          <div class="d-flex align-end w-50 justify-end">
               <div class="w-50">
                    <v-text-field density="compact" class="mr-3" variant="solo-filled" label="Pesquise por um material"
                         prepend-inner-icon="mdi-account-search-outline" hide-details v-model="filtroMateriais">
                         <template #prepend-inner>
                              <HugeiconsIcon class="subText" :stroke-width="2" :size="20" :icon="Search02Icon" />
                         </template>
                    </v-text-field>
               </div>
               <v-btn color="main" @click="abrirCriar()">Adicionar</v-btn>
          </div>
     </div>

     <v-data-table :items="materiaisFiltrados" :headers="materiaisHeaders" item-key="codigo">
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
               <MenuAcoes @editar="abrirEditar(item)" @excluir="abrirExcluir(item)" />
          </template>
     </v-data-table>

     <MaterialFormDialog v-model="dialogFormMaterial" :material="materialSelecionado" @salvo="salvarMaterial" />

     <ConfirmaExclusao v-if="materialSelecionado" :identificador="materialSelecionado.codigo" :tipo="'material'"
          v-model="dialogConfirmaExclusao" @excluir="excluirMaterial" />
</template>

<script lang="ts" setup>
import { MateriaisServices } from '@/modules/materiais/materiais.services'
import type { MaterialCompleto, MaterialForm } from '@/modules/materiais/materiais.types'
import { formatarDataHoraBR } from '@/utils/formataData'
import { usarFeedbackStore } from '@/stores/feedbacks.store'

import MenuAcoes from '@/components/common/MenuAcoes.vue'
import MaterialFormDialog from '@/components/MaterialFormDialog.vue'
import ConfirmaExclusao from '@/components/common/ConfirmaExclusao.vue'

import { HugeiconsIcon } from '@hugeicons/vue'
import { Search02Icon } from '@hugeicons/core-free-icons'

import { computed, onMounted, ref } from 'vue'
import { normalizarTextoBusca } from '@/utils/normalizarTextoBusca'

const feedback = usarFeedbackStore()

const materiais = ref<MaterialCompleto[]>([])
const materiaisHeaders = [
     { title: 'Nome', key: 'nome', sortable: true },
     { title: 'Tipo', key: 'tipo_nome' },
     { title: 'Unidade Medida', key: 'unidade_medida_sigla', sortable: true },
     { title: 'Preço', key: 'preco', sortable: true },
     { title: 'Quantidade', key: 'quantidade', sortable: true },
     { title: 'Preço X Qtd', key: 'preco_x_qtd', sortable: true },
     { title: 'Data Alteração', key: 'data_alteracao', sortable: true },
     { title: 'Ações', key: 'acoes', width: '10%' }
]
const materialSelecionado = ref<MaterialCompleto | null>(null)

const filtroMateriais = ref<string>('')
const materiaisFiltrados = computed(() => {
     if(!filtroMateriais.value || filtroMateriais.value == '') return materiais.value

     const termos = normalizarTextoBusca(filtroMateriais.value).split(/\s+/)

     return materiais.value.filter(m => {
          const nome = normalizarTextoBusca(m.nome)
          return termos.every(termo => nome.includes(termo))
     })
})

const dialogFormMaterial = ref(false)
const dialogConfirmaExclusao = ref(false)

async function listarMateriais() {
     const response = await MateriaisServices.listar()
     materiais.value = response.map(mat => ({
          ...mat,
          data_alteracao: String(formatarDataHoraBR(mat.data_alteracao)),
          data_criacao: String(formatarDataHoraBR(mat.data_criacao)),
     }))
}

async function salvarMaterial(form: MaterialForm) {
     await MateriaisServices.salvar(form)
     await listarMateriais()
     dialogFormMaterial.value = false
     materialSelecionado.value = null
     feedback.sucesso('Material criado/editado com sucesso!')
}

async function excluirMaterial(identificador: number | string) {
     const codigo = String(identificador)

     await MateriaisServices.excluir(codigo)
     await listarMateriais()
     dialogConfirmaExclusao.value = false
     materialSelecionado.value = null
     feedback.sucesso('Material excluido com sucesso!')
}

function abrirCriar() {
     materialSelecionado.value = null
     dialogFormMaterial.value = true
}

function abrirEditar(material: MaterialCompleto) {
     materialSelecionado.value = material
     dialogFormMaterial.value = true
}

function abrirExcluir(material: MaterialCompleto) {
     materialSelecionado.value = material
     dialogConfirmaExclusao.value = true
}

onMounted(() => {
     listarMateriais()
})

</script>