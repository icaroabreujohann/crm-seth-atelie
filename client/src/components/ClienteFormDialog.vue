<template>
     <v-dialog v-model="dialog" width="30vw">
          <v-card class="pa-7">
               <div class="d-flex align-center mb-5">
                    <v-icon size="x-large" class="mr-2" color="light">{{ modoEditar ? 'mdi-account-edit-outline' :
                         'mdi-account-plus-outline' }}</v-icon>
                    <h1>{{ modoEditar ? 'Editar Cliente' : 'Criar Cliente' }}</h1>
               </div>

               <v-form ref="vFormRef">
                    <v-row>
                         <v-col cols="12">
                              <p>Nome</p>
                              <v-text-field variant="solo-filled" v-model="formClienteRef.nome"
                                   :rules="formRegras.obrigatorio" />
                         </v-col>
                    </v-row>
                    <v-row>
                         <v-col cols="6">
                              <p>Instagram</p>
                              <v-text-field variant="solo-filled" v-model="formClienteRef.instagram" />
                         </v-col>
                         <v-col cols="6">
                              <p>Telefone</p>
                              <v-text-field variant="solo-filled" v-model="formClienteRef.telefone" v-maska="'(##) #####-####'"/>
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
import { ref, computed, watch } from 'vue'
import { type Cliente, type ClienteForm } from '@/modules/clientes/clientes.types'

const props = defineProps<{
     cliente?: Cliente | null,
     modelValue: boolean
}>()

const emit = defineEmits<{
     (e: 'update:modelValue', value: boolean): void
     (e: 'salvo', form: ClienteForm): void
}>()

const dialog = computed({
     get: () => props.modelValue,
     set: (value) => emit('update:modelValue', value)
})

const formClienteDefault: ClienteForm = {
     id: 0,
     nome: '',
     instagram: '',
     telefone: '',
}
const vFormRef = ref()
const formClienteRef = ref<ClienteForm>({ ...formClienteDefault })

const formRegras = {
     obrigatorio: [(v: string) => !!v || 'Campo obrigatório']
}

const modoEditar = computed(() => !!props.cliente)

async function onSalvar() {
     const formValido = await vFormRef.value?.validate()

     if (!formValido?.valid) return
     emit('salvo', { ...formClienteRef.value })
}

watch(
     () => props.cliente,
     (cliente) => {
          formClienteRef.value =
               cliente ? {
                    id: cliente.id,
                    nome: cliente.nome,
                    instagram: cliente.instagram ?? null,
                    telefone: cliente.telefone ?? null
               }
                    : { ...formClienteDefault }
     },
     { immediate: true }
)

</script>