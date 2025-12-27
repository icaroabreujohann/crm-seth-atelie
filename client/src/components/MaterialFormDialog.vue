<template>
     <v-dialog v-model="dialog" width="30vw">
          <v-card class="pa-7">
               <div class="d-flex align-center mb-5">
                    <HugeiconsIcon class="text-light mr-2" :stroke-width="2" :size="30" color="light"
                         :icon="modoEditar ? UserEdit01Icon : UserAdd01Icon" />
                    <h1>{{ modoEditar ? 'Editar Material' : 'Criar Material' }}</h1>
               </div>

               <v-form ref="vFormRef">
                    <v-row>
                         <v-col cols="12">
                              <p>Nome</p>
                              <v-text-field variant="solo-filled" v-model="formMaterialRef.nome"
                                   :rules="formRegras.obrigatorio" />
                         </v-col>
                    </v-row>
                    <v-row>
                         <v-col cols="6">
                              <p>Tipo Material</p>
                              <v-select :items="tiposMaterial" item-title="nome" item-value="id" variant="solo-filled"
                                   v-model="formMaterialRef.tipo_id" :rules="formRegras.obrigatorio" />
                         </v-col>
                         <v-col cols="6">
                              <p>Unidade de Medida</p>
                              <v-select :items="unidadesMedida" item-title="nome" item-value="id" variant="solo-filled"
                                   v-model="formMaterialRef.unidade_medida_id" :rules="formRegras.obrigatorio" />
                         </v-col>
                    </v-row>
                    <v-row>
                         <v-col cols="6">
                              <p>Preço (R$)</p>
                              <v-text-field type="number" hide-spin-buttons variant="solo-filled"
                                   v-model="formMaterialRef.preco" :rules="formRegras.obrigatorio" />
                         </v-col>
                         <v-col cols="6">
                              <p>Quantidade</p>
                              <v-text-field type="number" hide-spin-buttons variant="solo-filled"
                                   v-model="formMaterialRef.quantidade" :rules="formRegras.obrigatorio" />
                         </v-col>
                    </v-row>
                    <v-row>
                         <v-col cols="12">
                              <p>Observações</p>
                              <v-textarea variant="solo-filled" v-model="formMaterialRef.observacoes" rows="5"
                                   no-resize></v-textarea>
                         </v-col>
                    </v-row>
                    <v-row>
                         <v-col cols="6">
                              <v-btn width="100%" color="main" @click="onSalvar()">
                                   {{ modoEditar ? 'Salvar' : 'Criar' }}
                              </v-btn>
                         </v-col>
                         <v-col cols="6">
                              <v-btn width="100%" variant="tonal" @click="dialog = false">Cancelar</v-btn>
                         </v-col>
                    </v-row>
               </v-form>
          </v-card>
     </v-dialog>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted } from 'vue'
import type { MaterialCompleto, MaterialForm } from '@/modules/materiais/materiais.types';
import { usarAuxiliaresStore } from '@/stores/auxiliares.store';

import { HugeiconsIcon } from '@hugeicons/vue';
import { UserAdd01Icon, UserEdit01Icon } from '@hugeicons/core-free-icons';
import { storeToRefs } from 'pinia';

const auxiliaresStore = usarAuxiliaresStore()
const { tiposMaterial, unidadesMedida } = storeToRefs(auxiliaresStore)

const props = defineProps<{
     material?: MaterialCompleto | null
     modelValue: boolean
}>()

const emit = defineEmits<{
     (e: 'update:modelValue', value: boolean): void
     (e: 'salvo', form: MaterialForm): void
}>()

const dialog = computed({
     get: () => props.modelValue,
     set: (value) => emit('update:modelValue', value)
})

const formMaterialDefault: MaterialForm = {
     codigo: '',
     nome: '',
     tipo_id: 1,
     unidade_medida_id: 1,
     preco: 0,
     quantidade: 0,
     observacoes: '',
}
const vFormRef = ref()
const formMaterialRef = ref<MaterialForm>({ ...formMaterialDefault })

const formRegras = {
     obrigatorio: [(v: string) => !!v || 'Campo obrigatório']
}

const modoEditar = computed(() => !!props.material)

async function onSalvar() {
     const formValido = await vFormRef.value?.validate()

     if (!formValido?.valid) return
     emit('salvo', { ...formMaterialRef.value })
}

watch(
     () => props.material,
     (material) => {
          formMaterialRef.value =
               material ? {
                    codigo: material.codigo,
                    nome: material.nome,
                    tipo_id: material.tipo_id,
                    unidade_medida_id: material.unidade_medida_id,
                    preco: material.preco,
                    quantidade: material.quantidade,
                    observacoes: material.observacoes ?? null,
               }
                    : { ...formMaterialDefault }
     },
     { immediate: true }

)

onMounted(async () => {
     await auxiliaresStore.carregar()
})


</script>