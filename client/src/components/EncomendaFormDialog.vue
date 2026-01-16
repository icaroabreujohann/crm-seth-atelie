<template>
     <v-dialog v-model="dialog" width="50vw">
          <v-card class="pa-10">
               <div class="d-flex align-center justify-space-between mb-5">
                    <div class="d-flex align-center">
                         <HugeiconsIcon class="text-light mr-2" :stroke-width="2" :size="30" color="light"
                              :icon="ShoppingCart02Icon" />
                         <h1>{{ modoEditar ? 'Editar Encomenda' : 'Criar Encomenda' }}</h1>
                    </div>
                    <div class="d-flex justify-center">
                         <v-btn class="mr-2" variant="tonal" @click="dialog = false">
                              <HugeiconsIcon :size="18" :icon="CancelCircleIcon" class="mr-1" />
                              Cancelar
                         </v-btn>
                         <v-btn class="mr-2" variant="tonal" v-if="props.encomenda" @click="">
                              <HugeiconsIcon :size="18" :icon="Delete02Icon" class="mr-1" />
                              Excluir
                         </v-btn>
                         <v-btn color="main" @click="" :disabled="!podeSalvar">
                              <HugeiconsIcon :size="18" :icon="PencilEdit02Icon" class="mr-1" />
                              {{ modoEditar ? 'Salvar' : 'Criar' }}
                         </v-btn>
                    </div>
               </div>
               <v-form ref="vFormRef">
                    <v-row>
                         <v-col cols="6">
                              <p>Cliente</p>
                              <v-text-field :model-value="clienteSelecionado?.nome || ''" readonly @click="dialogClienteSelect = true" variant="solo-filled"></v-text-field>
                         </v-col>
                         <v-col cols="6">
                              <p>Produto</p>
                              <v-text-field :model-value="produtoSelecionado?.nome || ''" readonly @click="dialogProdutoSelect = true" variant="solo-filled"></v-text-field>
                         </v-col>
                    </v-row>
                    <v-row>
                         <v-col cols="6">
                              <p>Data do Pedido</p>
                              <v-text-field type="date" variant="solo-filled"></v-text-field>
                         </v-col>
                         <v-col cols="6">
                              <p>Data da Entrega</p>
                              <v-text-field type="date" variant="solo-filled"></v-text-field>
                         </v-col>
                    </v-row>
                    <v-row>
                         <v-col>
                              <v-checkbox color="main" density="compact" hide-details>
                                   <template #label>Pagamento Realizado?</template>
                              </v-checkbox>
                         </v-col>
                         <v-col>
                              <v-checkbox color="main" density="compact" hide-details>
                                   <template #label>Entregue?</template>
                              </v-checkbox>
                         </v-col>
                    </v-row>
                    <v-row>
                         <v-col cols="6">
                              <p>Forma de Pagamento</p>
                              <v-text-field variant="solo-filled" />
                         </v-col>
                         <v-col cols="6">
                              <p>Local de Entrega</p>
                              <v-text-field variant="solo-filled" />
                         </v-col>
                    </v-row>
                    <v-row>
                         <v-col cols="12">
                              <p>Observações</p>
                              <v-textarea rows="3" variant="solo-filled" no-resize hide-details/>
                         </v-col>
                    </v-row>
               </v-form>
          </v-card>
     </v-dialog>

     <ClienteSelectDialog v-model="dialogClienteSelect" @select="selecionarCliente"/>
     <ProdutoSelectDialog v-model="dialogProdutoSelect" @select="selecionarProduto"/>
</template>

<script setup lang="ts">
import { useEncomendaForm } from '@/composables/useEncomendaForm';
import type { EncomendaForm } from '@/modules/encomendas/encomendas.types';
import { HugeiconsIcon } from '@hugeicons/vue';
import { CancelCircleIcon, Delete02Icon, PencilEdit02Icon, ShoppingCart02Icon, Tag01Icon } from '@hugeicons/core-free-icons';
import { computed, ref } from 'vue';
import ClienteSelectDialog from './ClienteSelectDialog.vue';
import type { VForm } from 'vuetify/components';
import type { Cliente } from '@/modules/clientes/clientes.types';
import type { ProdutoView } from '@/modules/produtos/produtos.types';

const props = defineProps<{
     encomenda?: EncomendaForm | null,
     modelValue: boolean
}>()

const emit = defineEmits<{
     (e: 'update:modelValue', value: boolean): void
}>()

const dialog = computed({
     get: () => props.modelValue,
     set: (value) => emit('update:modelValue', value)
})

const vFormRef = ref<VForm>()

const modoEditar = computed(() => !!props.encomenda)

const { form, original, regras, carregar, podeSalvar, resetar } = useEncomendaForm()

const dialogClienteSelect = ref(false)
const dialogProdutoSelect = ref(false)

const clienteSelecionado = ref<Cliente | null>(null)
const produtoSelecionado = ref<ProdutoView | null>(null)

function selecionarCliente(cliente: Cliente) {
     clienteSelecionado.value = cliente
     form.value.cliente_id = cliente.id
     dialogClienteSelect.value = false
}

function selecionarProduto(produto: ProdutoView){
     produtoSelecionado.value = produto
     form.value.produto_codigo = produto.codigo
     dialogProdutoSelect.value = false
}
</script>