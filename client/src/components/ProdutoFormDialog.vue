<template>
     <v-dialog v-model="dialog" width="35vw">
          <v-card class="pa-7">
               <div class="d-flex align-center mb-5">
                    <HugeiconsIcon class="text-light mr-2" :stroke-width="2" :size="30" color="light"
                         :icon="modoEditar ? UserEdit01Icon : UserAdd01Icon" />
                    <h1>{{ modoEditar ? 'Editar Produto' : 'Criar Produto' }}</h1>
               </div>
               <v-form ref="vFormRef">
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
                              <v-text-field variant="solo-filled" prefix="R$" type="number" hide-spin-buttons
                                   v-model="formProdutoRef.preco" :rules="formRegras.obrigatorio" />
                         </v-col>
                         <v-col cols="6">
                              <p>Tempo Médio</p>
                              <div class="d-flex ga-2">
                                   <v-text-field class="w-50" variant="solo-filled" suffix="h" type="number" min="0"
                                        hide-spin-buttons v-model="formProdutoRef.tempo_medio.horas" />
                                   <v-text-field class="w-50" variant="solo-filled" suffix="m" type="number" min="0"
                                        max="59" hide-spin-buttons v-model="formProdutoRef.tempo_medio.minutos" :rules="formRegras.minutos_maximos" />
                              </div>
                         </v-col>
                    </v-row>
                    <v-row>
                         <v-col cols="12">
                              <p>Fotos</p>
                              <v-file-input prepend-icon="" variant="solo-filled" hide-details multiple
                                   v-model="formProdutoRef.fotos" accept="image/*" chips>
                                   <template #prepend-inner>
                                        <HugeiconsIcon class="opacity-50" :icon="Link04Icon" />
                                   </template>
                              </v-file-input>
                         </v-col>
                    </v-row>
                    <div v-if="formProdutoRef.fotos?.length">
                         <p class="mb-2 mt-5 subText">Preview</p>
                         <v-card class="pa-2" style="border-radius: 10px !important;">
                              <v-row>
                                   <v-col cols="12" xl="3" lg="6" v-for="foto in formProdutoFotosPreview">
                                        <v-img :src="foto" rounded width="120" height="120" cover></v-img>
                                   </v-col>
                              </v-row>
                         </v-card>
                    </div>
                    <v-row class="mt-5">
                         <v-col cols="6">
                              <v-btn class="w-100" color="main" @click="onSalvar">{{ modoEditar ? 'Editar' : 'Criar'
                              }}</v-btn>
                         </v-col>
                         <v-col cols="6">
                              <v-btn class="w-100" variant="tonal" @click="dialog = false">Cancelar</v-btn>
                         </v-col>
                    </v-row>
               </v-form>
          </v-card>
     </v-dialog>
</template>

<script lang="ts" setup>

import { ref, computed, watch } from 'vue';
import type { Produto, ProdutoForm } from '@/modules/produtos/produtos.types';
import { HugeiconsIcon } from '@hugeicons/vue';
import { Link04Icon, UserAdd01Icon, UserEdit01Icon } from '@hugeicons/core-free-icons';

const props = defineProps<{
     produto?: Produto | null,
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
}
const vFormRef = ref()
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

async function onSalvar() {
     const formValido = await vFormRef.value?.validate()

     if (!formValido?.valid) return
     emit('salvo', { ...formProdutoRef.value })
}

watch(
     () => props.produto,
     (produto) => {
          formProdutoRef.value =
               produto ? {
                    codigo: produto.codigo,
                    nome: produto.nome,
                    preco: produto.preco,
                    tempo_medio: produto.tempo_medio,
                    fotos: produto.fotos
               } : { ...formProdutoDefault }
     }, { immediate: true }
)

watch(dialog, (aberto) => {
     if (!aberto) {
          formProdutoRef.value = { ...formProdutoDefault }
          vFormRef.value?.resetValidation()
     }
})

</script>