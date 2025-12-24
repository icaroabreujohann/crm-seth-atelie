<template>
     <v-dialog v-model="dialog" width="30vw">
          <v-card class="pa-7">
               <div class="d-flex align-center mb-5">
                    <HugeiconsIcon class="text-light mr-2" :stroke-width="2" :size="30" color="light" :icon="modoEditar ? UserEdit01Icon : UserAdd01Icon" />
                    <h1>{{ modoEditar ? 'Editar Material' : 'Criar Material' }}</h1>
               </div>

               <v-form ref="vFormRef">
                    <v-row>
                         <v-col cols="12">
                              <p>Nome</p>
                              <v-text-field variant="solo-filled" v-model="formMaterialRef.nome"/>
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
import type { MaterialCompleto, MaterialForm } from '@/modules/materiais/materiais.types';
import { HugeiconsIcon } from '@hugeicons/vue';
import { UserAdd01Icon, UserEdit01Icon } from '@hugeicons/core-free-icons';
import { ref, computed, watch } from 'vue'

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
     tipo_id: 0,
     unidade_medida_id: 0,
     preco: 0,
     quantidade: 0,
     observacoes: '',
}
const vFormRef = ref()
const formMaterialRef = ref<MaterialForm>({ ...formMaterialDefault })

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


</script>