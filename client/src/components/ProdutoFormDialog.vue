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
                         <v-btn class="mr-2" color="main" @click="onSalvar">{{ modoEditar ? 'Salvar' : 'Criar' }}</v-btn>
                         <v-btn variant="tonal" @click="dialog = false">Cancelar</v-btn>
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
                                                  <v-text-field variant="solo-filled" :rules="formRegras.obrigatorio"
                                                       v-model="formProdutoRef.nome" />
                                             </v-col>
                                        </v-row>
                                        <v-row>
                                             <v-col cols="6">
                                                  <p>Preço</p>
                                                  <v-text-field variant="solo-filled" prefix="R$" type="number"
                                                       hide-spin-buttons v-model="formProdutoRef.preco"
                                                       :rules="formRegras.obrigatorio" />
                                             </v-col>
                                             <v-col cols="6">
                                                  <p>Tempo Médio</p>
                                                  <div class="d-flex ga-2">
                                                       <v-text-field class="w-50" variant="solo-filled" suffix="h"
                                                            type="number" min="0" hide-spin-buttons
                                                            v-model="formProdutoRef.tempo_medio.horas" />
                                                       <v-text-field class="w-50" variant="solo-filled" suffix="m"
                                                            type="number" min="0" max="59" hide-spin-buttons
                                                            v-model="formProdutoRef.tempo_medio.minutos"
                                                            :rules="formRegras.minutos_maximos" />
                                                  </div>
                                             </v-col>
                                        </v-row>
                                        <v-row>
                                             <v-col cols="12">
                                                  <p>Fotos</p>
                                                  <v-file-input prepend-icon="" variant="solo-filled" hide-details
                                                       multiple v-model="formProdutoRef.fotos" accept="image/*" chips>
                                                       <template #prepend-inner>
                                                            <HugeiconsIcon class="opacity-50" :icon="Link04Icon" />
                                                       </template>
                                                  </v-file-input>
                                             </v-col>
                                        </v-row>
                                   </v-col>
                                   <v-col cols="5">
                                        <p class="mb-5">Fotos</p>
                                        <v-carousel v-if="formProdutoRef?.fotos.length > 0" hide-delimiters
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
                              <v-table class="mt-5">
                                   <thead>
                                        <tr>
                                             <th>Material</th>
                                             <th>Tipo</th>
                                             <th>Unidade Medida</th>
                                             <th>Quantidade</th>
                                             <th width="5%"><v-btn color="main"
                                                       @click="dialogMaterialSelect = true">Adicionar</v-btn></th>
                                        </tr>
                                   </thead>
                                   <tbody>
                                        <tr v-for="m in materiaisSelecionadosCatalogo" :key="m.codigo">
                                             <td>{{ m.nome }}</td>
                                             <td>{{ m.tipo_nome }}</td>
                                             <td>{{ m.unidade_medida_sigla }}</td>
                                             <td>
                                                  <v-text-field :rules="formRegras.obrigatorio"
                                                       :suffix="m.unidade_medida_sigla" density="compact"
                                                       hide-details hide-spin-buttons type="number"
                                                       width="36%"
                                                       variant="solo-filled" v-model="m.quantidade" />
                                             </td>
                                             <td></td>
                                        </tr>
                                   </tbody>
                              </v-table>
                         </v-tabs-window-item>
                    </v-tabs-window>
               </v-form>
          </v-card>
     </v-dialog>

     <MaterialSelectDialog v-model="dialogMaterialSelect" :materiaisSelecionados="codigosMateriaisSelecionados"
          @select="onMaterialSelect" />

</template>

<script lang="ts" setup>

import type { ProdutoForm, ProdutoMaterialSelecionado, ProdutoView } from '@/modules/produtos/produtos.types';
import { HugeiconsIcon } from '@hugeicons/vue';
import { Tag01Icon, Link04Icon, PackageIcon, ImageDelete01Icon } from '@hugeicons/core-free-icons';
import { ref, watch, computed } from 'vue';
import type { VForm } from 'vuetify/components';
import type { MaterialCompleto } from '@/modules/materiais/materiais.types';

const props = defineProps<{
     produto?: ProdutoView | null,
     modelValue: boolean
}>()

const emit = defineEmits<{
     (e: 'update:modelValue', value: boolean): void
     (e: 'salvo', value: ProdutoForm): void
}>()

const dialog = computed({
     get: () => props.modelValue,
     set: (value) => emit('update:modelValue', value)
})

const modoEditar = computed(() => !!props.produto)

const formProdutoDefault: ProdutoForm = {
     codigo: '',
     nome: '',
     preco: 0,
     tempo_medio: {
          horas: 0,
          minutos: 0
     },
     fotos: [],
     materiais: []
}
const vFormRef = ref<VForm>()
const formProdutoRef = ref<ProdutoForm>({ ...formProdutoDefault })
const formRegras = {
     obrigatorio: [(v: string) => !!v || 'Campo obrigatório'],
     minutos_maximos: [(v: number) => v <= 59 || 'Máximo de 59 minutos.']
}
const formProdutoFotosPreview = computed(() =>
     formProdutoRef.value.fotos?.map((file: File) =>
          URL.createObjectURL(file)
     )
)

const dialogMaterialSelect = ref(false)
const tabsProduto = ref<'tabProduto' | 'tabMaterial'>('tabProduto')

//Materiais
const codigosMateriaisSelecionados = ref<string[]>([])
const materiaisSelecionadosCatalogo = ref<ProdutoMaterialSelecionado[]>([])


async function onSalvar() {
     const formValido = await vFormRef.value?.validate()

     if (!formValido?.valid) return
     emit('salvo', { ...formProdutoRef.value })
}

function onMaterialSelect(materiais: MaterialCompleto[]) {
     const materiaisAnteriores = new Map(
          materiaisSelecionadosCatalogo.value.map(m => [m.codigo, m])
     )

     materiaisSelecionadosCatalogo.value = materiais.map(m => {
          const existente = materiaisAnteriores.get(m.codigo)

          return {
               codigo: m.codigo,
               nome: m.nome,
               tipo_nome: m.tipo_nome,
               unidade_medida_sigla: m.unidade_medida_sigla,

               quantidade:
                    existente?.quantidade ??
                    m.quantidade ??
                    1,

               preco_final:
                    existente?.preco_final ??
                    m.preco_x_qtd
          }
     })

     codigosMateriaisSelecionados.value = materiais.map(m => m.codigo)

     formProdutoRef.value.materiais =
          materiaisSelecionadosCatalogo.value.map(m => ({
               material_codigo: m.codigo,
               quantidade: m.quantidade
          }))
}



watch(
     () => props.produto,
     (produto) => {
          if (!produto) {
               formProdutoRef.value = { ...formProdutoDefault }
               codigosMateriaisSelecionados.value = []
               materiaisSelecionadosCatalogo.value = []
               return
          }

          codigosMateriaisSelecionados.value =
               produto.materiais.map(m => m.material_codigo)

          materiaisSelecionadosCatalogo.value =
               produto.materiais.map(m => ({
                    codigo: m.material_codigo,
                    nome: m.material_nome,
                    tipo_nome: m.material_tipo_nome,
                    unidade_medida_sigla: m.material_unidade_medida_sigla,
                    quantidade: m.quantidade,
                    preco_final: m.preco_final
               }))
     },
     { immediate: true }
)

watch(
     materiaisSelecionadosCatalogo,
     (materiais) => {
          formProdutoRef.value.materiais = materiais.map(m => ({
               material_codigo: m.codigo,
               quantidade: m.quantidade
          }))
     },
     { deep: true }
)



watch(dialog, (aberto) => {
     if (!aberto) {
          formProdutoRef.value = { ...formProdutoDefault }
          codigosMateriaisSelecionados.value = []
          materiaisSelecionadosCatalogo.value = []
          vFormRef.value?.resetValidation()
     }
})

</script>