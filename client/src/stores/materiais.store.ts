import { defineStore } from 'pinia'
import { MateriaisServices } from '@/modules/materiais/materiais.services'
import type { MaterialCompleto } from '@/modules/materiais/materiais.types'

interface MaterialStore {
     materiais: MaterialCompleto[],
     carregando: boolean,
     carregado: boolean
}

export const usarMaterialStore = defineStore('materiais', {
     state: (): MaterialStore => ({
          materiais: [],
          carregando: true,
          carregado: false
     }),

     actions: {
          async buscarMateriais() {
               if(this.carregado) return

               this.carregando = true
               this.materiais = await MateriaisServices.listar()
               this.carregando = false
               this.carregado = true
          }
     }
})