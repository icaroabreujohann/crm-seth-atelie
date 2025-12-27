import { defineStore } from 'pinia'
import { CadastrosServices } from '@/modules/cadastros/cadastros.services'
import type { TipoMaterial, UnidadeMedida } from '@/modules/cadastros/cadastros.types'

interface AuxiliaresState {
     tiposMaterial: TipoMaterial[]
     unidadesMedida: UnidadeMedida[]
}

export const usarAuxiliaresStore = defineStore('auxiliares', {
     state: ():AuxiliaresState => ({
          tiposMaterial: [],
          unidadesMedida: []
     }),

     actions: {
          async carregar() {
               if (this.tiposMaterial.length) return

               const [tipos, unidades] = await Promise.all([
                    CadastrosServices.listarTiposMateriais(),
                    CadastrosServices.listarUnidadesMedida()
               ])

               this.tiposMaterial = tipos
               this.unidadesMedida = unidades
          }
     }
})