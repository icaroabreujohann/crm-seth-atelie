<template>
     <v-app>
          <v-navigation-drawer permanent class="pa-4">
               <!-- <v-list-item class="pa-0 ml-1 mt-3 mb-7">
                    <div class="d-flex align-center">
                         <v-icon color="main" style="font-size: 2rem;">mdi-star-four-points-box-outline</v-icon>
                         <div class="ml-2">
                              <h2>Seth Ateliê</h2>
                         </div>
                    </div>
               </v-list-item> -->

               <h5 class="subText f-bold ml-4">MENU</h5>

               <v-list-item
                    v-for="i in menuItems"
                    :to="i.rota"
                    class="mt-1"
               >
                    <div class="d-flex align-center">
                         <v-icon style="font-size: 1.2rem;">{{ i.icone }}</v-icon>
                         <h3 class="f-regular ml-2">{{ i.titulo }}</h3>
                    </div>
               </v-list-item>
          </v-navigation-drawer>
          <v-main>
               <router-view/>
          </v-main>
     </v-app>
</template>

<script lang="ts" setup>
     import { ref } from 'vue';

     const menuItems = ref([
          {titulo: 'Início', icone: 'mdi-layers-outline', rota: '/clientes'},
          {titulo: 'Clientes', icone: 'mdi-account-multiple-outline'},
          {titulo: 'Materiais', icone: 'mdi-package-variant-closed'},
          {titulo: 'Produtos', icone: 'mdi-tag-outline'},
          {titulo: 'Encomendas', icone: 'mdi-cart-outline'},
     ])

</script>