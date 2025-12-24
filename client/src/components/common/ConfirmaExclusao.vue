<template>
     <v-dialog v-model="dialog" width="25vw">
          <v-card class="">
               <div class="pa-5 d-flex flex-column align-center justify-center">
                    <v-img width="300px" class="mt-10"
                         src="/images/delete-dialog.png" />

                    <h1 style="font-size: 2.5rem;" class="text-center mt-10">Atenção</h1>
                    <p style="font" class="text-center mt-2 subText">Você realmente deseja excluir o(a) {{transformaPrimeiraLetraEmMaiuscula(tipo)}}?</p>
                    <div class="d-flex justify-center w-66">
                         <v-btn variant="tonal" class="mt-7 mb-2 w-50" @click="dialog = false">Cancelar</v-btn>
                         <v-btn color="main"class="mt-7 mb-2 ml-2 w-50" @click="enviarExclusao">Excluir</v-btn>
                    </div>
               </div>
          </v-card>
     </v-dialog>
</template>

<script lang="ts" setup>
import { transformaPrimeiraLetraEmMaiuscula } from '@/utils/primeiraLetraMaiuscula'
import { ref, computed } from 'vue'


const props = defineProps<{
     identificador: number | string,
     tipo: string,
     modelValue: boolean
}>()


const emit = defineEmits<{
     (e: 'update:modelValue', value: boolean): void
     (e: 'excluir', identificador: number | string): void
}>()

const dialog = computed({
     get: () => props.modelValue,
     set: (value) => emit('update:modelValue', value)
})

function enviarExclusao(){
     emit('excluir', props.identificador)
}


</script>