import { EncomendasServices } from "@/modules/encomendas/encomendas.services";
import type { EncomendaView } from "@/modules/encomendas/encomendas.types";
import { defineStore } from "pinia";


interface EncomendaStore {
     encomendas: EncomendaView[],
     carregando: boolean,
     carregado: boolean
}

export const usarEncomendaStore = defineStore('encomendas', {
     state: (): EncomendaStore => ({
          encomendas: [],
          carregando: true,
          carregado: false
     }),

     actions: {
          async buscaEncomendas() {
               if(this.carregado) return

               this.carregando = true
               this.encomendas = await EncomendasServices.listar()
               this.carregando = false
               this.carregado = true
          }
     }
})