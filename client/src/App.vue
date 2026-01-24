<template>
     <v-app>
          <v-navigation-drawer permanent class="pa-4">
               <h5 class="subText f-bold ml-4">MENU</h5>
               <v-list-item
                    v-for="i in menuItems"
                    :to="i.rota"
                    class="mt-1"
               >
                    <div class="d-flex align-center">
                         <HugeiconsIcon :stroke-width="2.2" :size="18" :icon="i.icone2"></HugeiconsIcon>
                         <h3 class="f-regular ml-2">{{ i.titulo }}</h3>
                    </div>
               </v-list-item>
          </v-navigation-drawer>
          <v-main>
               <v-container class="pa-10" width="80vw" fluid>
                    
                    <v-card class="pa-10">
                         <router-view/>
                    </v-card>
               </v-container>
          </v-main>
     </v-app>

     <v-dialog v-model="feedback.aberto" width="20vw">
          <v-card class="">
               <div class="pa-5 d-flex flex-column align-center justify-center">
                    <v-img 
                         width="230px" 
                         class="mt-10"
                         :src="feedback.tipo === 'sucesso' ? '/images/sucess-dialog.png' : '/images/error-dialog.png'"
                    />

                    <h1 style="font-size: 2.5rem;" class="text-center mt-10">{{ feedback.tipo === 'sucesso' ? 'Sucesso' : 'Erro'}}</h1>
                    <p style="font" class="text-center mt-2 subText">{{ feedback.mensagem }}</p>
                    <v-btn color="main" variant="tonal" class="mt-7 mb-2" @click="feedback.fechar()">Fechar</v-btn>
               </div>
               <v-progress-linear height="5" indeterminate color="main"/>
          </v-card>
     </v-dialog>
</template>

<script lang="ts" setup>
     import { ref } from 'vue'
     import { useRoute } from 'vue-router'
     import { usarFeedbackStore } from './stores/feedbacks.store'
     import { HugeiconsIcon } from '@hugeicons/vue'
     import { Layers01Icon, UserMultiple02Icon, PackageIcon, Tag01Icon, ShoppingCart02Icon} from '@hugeicons/core-free-icons'
     const route = useRoute()

     const feedback = usarFeedbackStore()

     const menuItems = ref([
          {titulo: 'Início', icone: 'mdi-layers-outline', icone2:Layers01Icon, rota: '/'},
          {titulo: 'Clientes', icone: 'mdi-account-multiple-outline', icone2: UserMultiple02Icon, rota: '/clientes'},
          {titulo: 'Materiais', icone: 'mdi-package-variant-closed', icone2: PackageIcon, rota: '/materiais'},
          {titulo: 'Produtos', icone: 'mdi-tag-outline', icone2: Tag01Icon, rota: '/produtos'},
          {titulo: 'Encomendas', icone: 'mdi-cart-outline', icone2: ShoppingCart02Icon, rota: '/encomendas'},
     ])

</script>