<template>
     <v-dialog v-model="dialog" width="50vw">
          <v-card class="pa-10">
               <div class="d-flex align-center justify-space-between mb-5">
                    <div class="d-flex align-center">
                         <HugeiconsIcon class="text-light mr-2" :stroke-width="2" :size="30" color="light"
                              :icon="Tag01Icon" />
                         <h1>{{ modoEditar ? 'Editar Produto' : 'Criar Produto' }}</h1>
                    </div>
                    <div class="d-flex justify-center">
                         <v-btn class="mr-2" variant="tonal" @click="dialog = false">
                              <HugeiconsIcon :size="18" :icon="CancelCircleIcon" class="mr-1" />
                              Cancelar
                         </v-btn>
                         <v-btn class="mr-2" variant="tonal" v-if="props.produto" @click="abrirExcluir(props.produto)">
                              <HugeiconsIcon :size="18" :icon="Delete02Icon" class="mr-1" />
                              Excluir
                         </v-btn>
                         <v-btn color="main" @click="salvar" :disabled="!podeSalvar">
                              <HugeiconsIcon :size="18" :icon="PencilEdit02Icon" class="mr-1" />
                              {{ modoEditar ? 'Salvar' : 'Criar' }}
                         </v-btn>
                    </div>
               </div>
               <v-form ref="vFormRef">
                    <v-tabs color="main" v-model="tabsProduto" align-tabs="center">
                         <v-tab value="tabProduto">
                              <template #prepend>
                                   <HugeiconsIcon :size="20" :icon="Tag01Icon" />
                              </template>
                              Produto
                         </v-tab>
                         <v-tab value="tabMaterial">
                              <template #prepend>
                                   <HugeiconsIcon :size="20" :icon="PackageIcon" />
                              </template>
                              Material
                         </v-tab>
                    </v-tabs>

                    <v-tabs-window v-model="tabsProduto">
                         <v-tabs-window-item value="tabProduto">
                              <v-row>
                                   <v-col cols="7">
                                        <v-row>
                                             <v-col cols="12">
                                                  <p>Nome</p>
                                                  <v-text-field variant="solo-filled" :rules="regras.obrigatorio"
                                                       v-model="form.nome" />
                                             </v-col>
                                        </v-row>
                                        <v-row>
                                             <v-col cols="6">
                                                  <p>Preço</p>
                                                  <v-text-field variant="solo-filled" prefix="R$" type="number"
                                                       hide-spin-buttons v-model="form.preco"
                                                       :rules="regras.obrigatorio" />
                                             </v-col>
                                             <v-col cols="6">
                                                  <p>Tempo Médio</p>
                                                  <div class="d-flex ga-2">
                                                       <v-text-field class="w-50" variant="solo-filled" suffix="h"
                                                            type="number" min="0" hide-spin-buttons
                                                            v-model="form.tempo_medio.horas" />
                                                       <v-text-field class="w-50" variant="solo-filled" suffix="m"
                                                            type="number" min="0" max="59" hide-spin-buttons
                                                            v-model="form.tempo_medio.minutos"
                                                            :rules="regras.minutos_maximos" />
                                                  </div>
                                             </v-col>
                                        </v-row>
                                        <v-row>
                                             <v-col cols="12">
                                                  <p>Fotos</p>
                                                  <v-file-input prepend-icon="" variant="solo-filled" hide-details
                                                       multiple v-model="form.fotos" accept="image/*" chips>
                                                       <template #prepend-inner>
                                                            <HugeiconsIcon class="opacity-50" :icon="Link04Icon" />
                                                       </template>
                                                  </v-file-input>
                                             </v-col>
                                        </v-row>
                                   </v-col>
                                   <v-col cols="5">
                                        <p class="mb-5">Fotos</p>
                                        <v-carousel v-if="form?.fotos.length > 0" hide-delimiters
                                             style="border-radius: 5%;" height="35vh">
                                             <v-carousel-item v-for="foto in formProdutoFotosPreview">
                                                  <v-img :src="foto" cover></v-img>
                                             </v-carousel-item>
                                        </v-carousel>
                                        <v-card class="pa-10 d-flex flex-column justify-center align-center opacity-30"
                                             height="35vh" v-else>
                                             <HugeiconsIcon :size="120" :icon="ImageDelete01Icon" />
                                             <p class="text-center mt-5">Adicione fotos para <br> aparecerem aqui</p>
                                        </v-card>
                                   </v-col>
                              </v-row>
                         </v-tabs-window-item>

                         <v-tabs-window-item value="tabMaterial">
                              <v-data-table :items="materiaisExibicao" :headers="materiaisHeaders">
                                   <template #header.acoes="{ column }">
                                        <v-btn color="main" @click="dialogMaterialSelect = true">Adicionar</v-btn>
                                   </template>
                                   <template v-slot:item.unidade_medida_sigla="{ item }">
                                        <p>{{ item.unidade_medida_sigla.toUpperCase() }}</p>
                                   </template>
                                   <template v-slot:item.quantidade="{ item }">
                                        <v-text-field :suffix="item.unidade_medida_sigla" density="compact" hide-details
                                             hide-spin-buttons type="number" min="0" variant="solo-filled"
                                             :model-value="item.quantidade"
                                             @update:model-value="valor => atualizarQuantidade(item.material_codigo, Number(valor))" />
                                   </template>
                                   <template v-slot:item.acoes="{ item }">
                                        <div class="w-100 d-flex justify-center">
                                             <HugeiconsIcon @click="removerMaterial(item.material_codigo)" :size="20"
                                                  :icon="Delete02Icon" />
                                        </div>
                                   </template>
                              </v-data-table>
                         </v-tabs-window-item>
                    </v-tabs-window>
               </v-form>
          </v-card>
     </v-dialog>

     <MaterialSelectDialog v-model="dialogMaterialSelect" :materiaisDoProduto="materiaisCodigos"
          @select="selecionarMateriais" />

     <ConfirmaExclusao v-model="dialogConfirmaExclusao" v-if="produtoSelecionado"
          :identificador="produtoSelecionado.codigo" :tipo="'produto'" @excluir="excluir" />
</template>

<script lang="ts" setup>
import type { ProdutoForm, ProdutoView } from '@/modules/produtos/produtos.types'

import { HugeiconsIcon } from '@hugeicons/vue'
import {
     Tag01Icon,
     Link04Icon,
     PackageIcon,
     ImageDelete01Icon,
     Delete02Icon,
     CancelCircleIcon,
     PencilEdit02Icon
} from '@hugeicons/core-free-icons'
import ConfirmaExclusao from './common/ConfirmaExclusao.vue'

import { ref, watch, computed } from 'vue'
import type { VForm } from 'vuetify/components'

import { usarMaterialStore } from '@/stores/materiais.store'
import { useProdutoForm } from '@/composables/useProdutoForm'
import { useProdutoMateriais } from '@/composables/useProdutoMateriais'

const props = defineProps<{
     produto?: ProdutoView | null,
     modelValue: boolean
}>()

const emit = defineEmits<{
     (e: 'update:modelValue', value: boolean): void
     (e: 'salvo', value: Partial<ProdutoForm>): void
     (e: 'excluir', value: string | number): void
}>()

const dialog = computed({
     get: () => props.modelValue,
     set: (value) => emit('update:modelValue', value)
})

const modoEditar = computed(() => !!props.produto)
const materialStore = usarMaterialStore()

const { form, podeSalvar, regras, carregar, gerarPayloadPatch, resetar } = useProdutoForm()
const { materiaisCodigos, materiaisExibicao, atualizarQuantidade, removerMaterial, selecionarMateriais } = useProdutoMateriais(form, computed(() => materialStore.materiais))

const vFormRef = ref<VForm>()
const tabsProduto = ref<'tabProduto' | 'tabMaterial'>('tabProduto')
const produtoSelecionado = ref<ProdutoView | null>(null)
const dialogMaterialSelect = ref(false)
const dialogConfirmaExclusao = ref(false)

const materiaisHeaders = computed(() => [
     { title: 'Material', key: 'nome' },
     { title: 'Tipo', key: 'tipo_nome' },
     { title: 'Unidade Medida', key: 'unidade_medida_sigla' },
     { title: 'Quantidade', key: 'quantidade' },
     { title: '', key: 'acoes', width: '1%' }
])
const formProdutoFotosPreview = computed(() =>
     form.value.fotos?.map((file: File) =>
          URL.createObjectURL(file)
     )
)

async function salvar() {
     const formValido = await vFormRef.value?.validate()
     if (!formValido?.valid) return
     emit('salvo', modoEditar.value ? gerarPayloadPatch() : { ...form.value })
}

function excluir(identificador: string | number) {
     dialogConfirmaExclusao.value = false
     emit('excluir', identificador)
}

function abrirExcluir(produto: ProdutoView) {
     produtoSelecionado.value = produto
     dialogConfirmaExclusao.value = true
}

watch(
     () => props.produto,
     (produto) => carregar(produto ?? undefined),
     { immediate: true }
)

watch(dialog, (aberto) => {
     if (!aberto) {
          resetar()
          vFormRef.value?.resetValidation()
     }
})
</script>