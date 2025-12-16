<template>
     <v-app>
          <v-navigation-drawer permanent class="pa-2">
               <v-list-item class="pa-0 ml-1 mt-3 mb-7">
                    <div class="d-flex align-center">
                         <v-icon color="main" style="font-size: 2.5rem;">mdi-star-four-points-box-outline</v-icon>
                         <div class="ml-2">
                              <h3 class="text-main">Seth Ateliê</h3>
                              <p class="subText mt-n1">Gestor de encomendas</p>
                         </div>
                    </div>
               </v-list-item>


               <v-list-item
                    v-for="i in menuItems"
                    :to="i.rota"
                    class="mt-2"
               >
                    <div class="d-flex align-center">
                         <v-icon size="small">{{ i.icone }}</v-icon>
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
          {titulo: 'Início', icone: 'mdi-home-variant-outline', rota: '/clientes'},
          {titulo: 'Clientes', icone: 'mdi-account-group-outline'},
          {titulo: 'Materiais', icone: 'mdi-package-variant'},
          {titulo: 'Produtos', icone: 'mdi-tag-text-outline'},
          {titulo: 'Encomendas', icone: 'mdi-truck-outline'},
     ])

</script>