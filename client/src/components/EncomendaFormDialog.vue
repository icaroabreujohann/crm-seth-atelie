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
                    <v-tabs color="main" v-model="abaAtiva" align-tabs="center">
                         <v-tab value="encomenda">
                              <template #prepend>
                                   <HugeiconsIcon :size="20" :icon="Tag01Icon" />
                              </template>
                              Produto
                         </v-tab>
                         <v-tab value="material" :disabled="!modoEditar">
                              <template #prepend>
                                   <HugeiconsIcon :size="20" :icon="PackageIcon" />
                              </template>
                              Material
                         </v-tab>
                    </v-tabs>
                    <v-tabs-window class="mt-5" v-model="abaAtiva">
                         <v-tabs-window-item value="encomenda">
                              <v-row>
                                   <v-col cols="6">
                                        <p>Cliente</p>
                                        <v-text-field :model-value="clienteSelecionado?.nome || ''" readonly
                                             @click="dialogClienteSelect = true" variant="solo-filled"></v-text-field>
                                   </v-col>
                                   <v-col cols="6">
                                        <p>Produto</p>
                                        <v-text-field :model-value="produtoSelecionado?.nome || ''" readonly
                                             @click="dialogProdutoSelect = true" variant="solo-filled"></v-text-field>
                                   </v-col>
                              </v-row>
                              <v-row>
                                   <v-col cols="6">
                                        <p>Data do Pedido</p>
                                        <v-text-field type="date" variant="solo-filled" v-model="form.data_pedido"
                                             :rules="regras.obrigatorio"></v-text-field>
                                   </v-col>
                                   <v-col cols="6">
                                        <p>Data da Entrega</p>
                                        <v-text-field type="date" variant="solo-filled"
                                             v-model="form.data_prazo"></v-text-field>
                                   </v-col>
                              </v-row>
                              <v-row>
                                   <v-col>
                                        <v-checkbox color="main" density="compact" hide-details
                                             v-model="form.pagamento_realizado">
                                             <template #label>Pagamento Realizado?</template>
                                        </v-checkbox>
                                   </v-col>
                                   <v-col>
                                        <v-checkbox color="main" density="compact" hide-details v-model="form.entregue">
                                             <template #label>Entregue?</template>
                                        </v-checkbox>
                                   </v-col>
                              </v-row>
                              <v-row>
                                   <v-col cols="6">
                                        <p>Forma de Pagamento</p>
                                        <v-text-field variant="solo-filled" v-model="form.pagamento_forma" />
                                   </v-col>
                                   <v-col cols="6">
                                        <p>Local de Entrega</p>
                                        <v-text-field variant="solo-filled" v-model="form.local_entrega" />
                                   </v-col>
                              </v-row>
                              <v-row>
                                   <v-col cols="12">
                                        <p>Observações</p>
                                        <v-textarea rows="3" variant="solo-filled" no-resize hide-details
                                             v-model="form.observacoes" />
                                   </v-col>
                              </v-row>
                         </v-tabs-window-item>

                         <v-tabs-window-item value="material">
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

     <MaterialSelectDialog v-model="dialogMaterialSelect" :materiaisProps="materiaisCodigos"
          @select="selecionarMateriais" />
     <ClienteSelectDialog v-model="dialogClienteSelect" @select="selecionarCliente" />
     <ProdutoSelectDialog v-model="dialogProdutoSelect" @select="selecionarProduto" />
</template>

<script setup lang="ts">
import { useEncomendaForm } from '@/composables/useEncomendaForm';
import type { EncomendaForm, EncomendaView } from '@/modules/encomendas/encomendas.types';
import { HugeiconsIcon } from '@hugeicons/vue';
import { CancelCircleIcon, Delete02Icon, PackageIcon, PencilEdit02Icon, ShoppingCart02Icon, Tag01Icon } from '@hugeicons/core-free-icons';
import { computed, ref, watch } from 'vue';
import ClienteSelectDialog from './ClienteSelectDialog.vue';
import type { VForm } from 'vuetify/components';
import type { Cliente } from '@/modules/clientes/clientes.types';
import type { ProdutoView } from '@/modules/produtos/produtos.types';
import MaterialSelectDialog from './MaterialSelectDialog.vue';
import { useEncomendaMateriais } from '@/composables/useEncomendaMateriais';
import { usarMaterialStore } from '@/stores/materiais.store';

const props = defineProps<{
     encomenda?: EncomendaView | null,
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

type AbaEncomenda = 'encomenda' | 'material'
const abaAtiva = ref<AbaEncomenda>('encomenda')

const materialStore = usarMaterialStore()

const { form, original, regras, carregar, podeSalvar, resetar } = useEncomendaForm()
const { materiaisCodigos, materiaisHeaders, materiaisExibicao, atualizarQuantidade, removerMaterial, selecionarMateriais } = useEncomendaMateriais(form, computed(() => materialStore.materiais))

const dialogMaterialSelect = ref(true)
const dialogClienteSelect = ref(false)
const dialogProdutoSelect = ref(false)

const clienteSelecionado = ref<Cliente | null>(null)
const produtoSelecionado = ref<ProdutoView | null>(null)

function selecionarCliente(cliente: Cliente) {
     clienteSelecionado.value = cliente
     form.value.cliente_id = cliente.id
     dialogClienteSelect.value = false
}

function selecionarProduto(produto: ProdutoView) {
     produtoSelecionado.value = produto
     form.value.produto_codigo = produto.codigo
     dialogProdutoSelect.value = false
}

watch(
     () => props.encomenda,
     (encomenda) => carregar(encomenda ?? undefined),
     { immediate: true }
)

watch(dialog, (aberto) => {
     if (!aberto) {
          resetar()
          vFormRef.value?.resetValidation()
     }
})


</script>