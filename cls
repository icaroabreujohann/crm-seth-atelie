[1mdiff --git a/api/src/modules/clientes/clientes.services.ts b/api/src/modules/clientes/clientes.services.ts[m
[1mindex e730187..247a84b 100644[m
[1m--- a/api/src/modules/clientes/clientes.services.ts[m
[1m+++ b/api/src/modules/clientes/clientes.services.ts[m
[36m@@ -28,8 +28,8 @@[m [mexport class ClientesService {[m
           ])[m
 [m
           validaRegraNegocio([[m
[31m-               { condicao: clienteInstagram.existe, valor: clienteInstagram, codigoResposta: CODIGOS_ERRO.CLIENTE_EXISTE_ERR },[m
[31m-               { condicao: clienteTelefone.existe, valor: clienteTelefone, codigoResposta: CODIGOS_ERRO.CLIENTE_EXISTE_ERR }[m
[32m+[m[32m               { condicao: clienteInstagram.existe, valor: clienteInstagram, codigoResposta: CODIGOS_ERRO.CLIENTE_EXISTE_IG_ERR },[m
[32m+[m[32m               { condicao: clienteTelefone.existe, valor: clienteTelefone, codigoResposta: CODIGOS_ERRO.CLIENTE_EXISTE_TEL_ERR }[m
           ])[m
 [m
           return await this.repository.criar(data)[m
[36m@@ -47,7 +47,7 @@[m [mexport class ClientesService {[m
 [m
           validaRegraNegocio([[m
                { condicao: clienteInstagram.existe && clienteInstagram.data.id != id, valor: { ...data, id }, codigoResposta: CODIGOS_ERRO.CLIENTE_EXISTE_IG_ERR },[m
[31m-               { condicao: clienteTelefone.existe && clienteTelefone.data.id != id, valor: { ...data, id }, codigoResposta: CODIGOS_ERRO.CLIENTE_EXISTE_IG_ERR }[m
[32m+[m[32m               { condicao: clienteTelefone.existe && clienteTelefone.data.id != id, valor: { ...data, id }, codigoResposta: CODIGOS_ERRO.CLIENTE_EXISTE_TEL_ERR }[m
           ])[m
 [m
           return await this.repository.editar(id, data)[m
[1mdiff --git a/client/src/modules/clientes/clientes.services.ts b/client/src/modules/clientes/clientes.services.ts[m
[1mindex d331631..0263844 100644[m
[1m--- a/client/src/modules/clientes/clientes.services.ts[m
[1m+++ b/client/src/modules/clientes/clientes.services.ts[m
[36m@@ -1,11 +1,21 @@[m
 import { api } from '@/plugins/api'[m
[31m-import { type Cliente, type CriarClienteDTO } from './clientes.types'[m
[32m+[m[32mimport { type Cliente, type ClienteForm, type CriarClienteDTO } from './clientes.types'[m
 import type { RespostaApi } from '@/types/resposta.api'[m
 [m
[32m+[m[32masync function criar(payload: CriarClienteDTO): Promise < Cliente > {[m
[32m+[m[32m     const { data } = await api.post<Cliente>('/clientes', payload)[m
[32m+[m[32m     return data[m
[32m+[m[32m}[m
[32m+[m
[32m+[m[32masync function editar(id: number, payload: CriarClienteDTO): Promise < Cliente > {[m
[32m+[m[32m     const { data } = await api.patch<Cliente>(`/clientes/${id}`, payload)[m
[32m+[m[32m     return data[m
[32m+[m[32m}[m
[32m+[m
 export const ClientesServices = {[m
      async listar(): Promise<Cliente[]> {[m
           const { data } = await api.get<RespostaApi<Cliente[]>>('/clientes')[m
[31m-          [m
[32m+[m
           return data.data[m
      },[m
 [m
[36m@@ -14,14 +24,17 @@[m [mexport const ClientesServices = {[m
           return data.data[m
      },[m
 [m
[31m-     async criar(payload: CriarClienteDTO): Promise<Cliente> {[m
[31m-          const { data } = await api.post<Cliente>('/clientes', payload)[m
[31m-          return data[m
[31m-     },[m
[32m+[m[32m     async salvar(form: ClienteForm): Promise<Cliente> {[m
[32m+[m[32m          const payload = {[m
[32m+[m[32m               nome: form.nome,[m
[32m+[m[32m               instagram: form.instagram,[m
[32m+[m[32m               telefone: form.telefone[m
[32m+[m[32m          }[m
 [m
[31m-     async editar(id: number, payload: CriarClienteDTO): Promise<Cliente> {[m
[31m-          const { data } = await api.patch<Cliente>(`/clientes/${id}`, payload)[m
[31m-          return data[m
[32m+[m[32m          if (!form.id) {[m
[32m+[m[32m               return await criar(payload)[m
[32m+[m[32m          }[m
[32m+[m[32m          return editar(form.id, payload)[m
      },[m
 [m
      async excluir(id: number): Promise<Cliente> {[m
[1mdiff --git a/client/src/modules/clientes/clientes.types.ts b/client/src/modules/clientes/clientes.types.ts[m
[1mindex 765c1fb..c4d6537 100644[m
[1m--- a/client/src/modules/clientes/clientes.types.ts[m
[1m+++ b/client/src/modules/clientes/clientes.types.ts[m
[36m@@ -7,6 +7,13 @@[m [mexport type Cliente = {[m
      data_atualizacao: string[m
 }[m
 [m
[32m+[m[32mexport type ClienteForm = {[m
[32m+[m[32m     id?: number[m
[32m+[m[32m     nome: string[m
[32m+[m[32m     instagram: string | null[m
[32m+[m[32m     telefone: string | null[m
[32m+[m[32m}[m
[32m+[m
 export type ClienteId = {[m
      id: number[m
 }[m
[1mdiff --git a/client/src/pages/Clientes.vue b/client/src/pages/Clientes.vue[m
[1mindex 451bd07..d1c5517 100644[m
[1m--- a/client/src/pages/Clientes.vue[m
[1m+++ b/client/src/pages/Clientes.vue[m
[36m@@ -3,140 +3,74 @@[m
           <h1 class="mb-n2">Clientes</h1>[m
           <div class="d-flex align-end w-50 justify-end">[m
                <div class="w-50">[m
[31m-                    <v-text-field[m
[31m-                         density="compact"[m
[31m-                         class="mr-3"[m
[31m-                         variant="solo-filled"[m
[31m-                         label="Pesquise por um cliente"[m
[31m-                         prepend-inner-icon="mdi-account-search-outline"[m
[31m-                         hide-details[m
[31m-                    />[m
[32m+[m[32m                    <v-text-field density="compact" class="mr-3" variant="solo-filled" label="Pesquise por um cliente"[m
[32m+[m[32m                         prepend-inner-icon="mdi-account-search-outline" hide-details />[m
                </div>[m
[31m-               <v-btn color="main" @click="">Adicionar</v-btn>[m
[32m+[m[32m               <v-btn color="main" @click="abrirCriar()">Adicionar</v-btn>[m
           </div>[m
      </div>[m
 [m
[31m-     <v-data-table[m
[31m-          :items="clientes"[m
[31m-          :headers="clientesHeaders"[m
[31m-     >[m
[32m+[m[32m     <v-data-table :items="clientes" :headers="clientesHeaders">[m
           <template #item.acoes="{ item }">[m
[31m-               <MenuAcoes/>[m
[32m+[m[32m               <MenuAcoes[m[41m [m
[32m+[m[32m                    @editar="abrirEditar(item)"[m
[32m+[m[32m               />[m
           </template>[m
      </v-data-table>[m
 [m
[31m-     <v-dialog v-model="modalCriarCliente" width="30vw">[m
[31m-          <v-card class="pa-7">[m
[31m-               <div class="d-flex align-center mb-5">[m
[31m-                    <v-icon size="x-large" class="mr-2" color="light">mdi-account-plus-outline</v-icon>[m
[31m-                    <h1>Criar Cliente</h1>[m
[31m-               </div>[m
[31m-               <v-form[m
[31m-                    ref="formCriarRef"[m
[31m-                    v-model="formCriarValido"[m
[31m-               >[m
[31m-                    <v-row>[m
[31m-                         <v-col cols="12">[m
[31m-                              <p>Nome</p>[m
[31m-                              <v-text-field[m
[31m-                                   variant="solo-filled"[m
[31m-                                   v-model="formCliente.nome"[m
[31m-                                   :rules="formRegras.obrigatorio"[m
[31m-                              />[m
[31m-                         </v-col>[m
[31m-                    </v-row>[m
[31m-                    <v-row>[m
[31m-                         <v-col cols="6">[m
[31m-                              <p>Instagram</p>[m
[31m-                              <v-text-field[m
[31m-                                   variant="solo-filled"[m
[31m-                                   v-model="formCliente.instagram"[m
[31m-                              />[m
[31m-                         </v-col>[m
[31m-                         <v-col cols="6">[m
[31m-                              <p>Telefone</p>[m
