import { normalizaTexto } from '../../utils/normalizadores'
import { ProdutoMaterialView } from '../produtos/materiais/produtoMaterial.types'
import { EncomendaCriarDTO, EncomendaCriarDB, EncomendaEditarDTO, EncomendaEditarDB } from './encomendas.types'
import { EncomendaMaterialCriarDTO } from './materiais/encomendaMaterialtypes'

export const mapEncomendaCriarDTOParaDB = (
     data: EncomendaCriarDTO,
     codigo: string,
     produto_id: number
): EncomendaCriarDB => ({
     codigo,
     cliente_id: data.cliente_id,
     produto_id,

     observacoes: data.observacoes ?? '',
     pagamento_realizado: data.pagamento_realizado ?? false,
     pagamento_forma: data.pagamento_forma ?? '',
     finalizado: data.finalizado ?? false,
     entregue: data.entregue ?? false,
     local_entrega: data.local_entrega ?? '',

     data_pedido: data.data_pedido,
     data_prazo: data.data_prazo ?? new Date(data.data_pedido.getFullYear(), data.data_pedido.getMonth(), data.data_pedido.getDate() + 20)
})

export const mapEncomendaEditarDTOParaDB = (
     data: EncomendaEditarDTO,
     produto_id?: number
): EncomendaEditarDB => {
     const resultado: EncomendaEditarDB = {}
     
     if (data.observacoes !== undefined) {
          resultado.observacoes = normalizaTexto(data.observacoes) ?? ''
     }

     if (data.pagamento_realizado !== undefined) {
          resultado.pagamento_realizado = data.pagamento_realizado
     }

     if (data.pagamento_forma !== undefined) {
          resultado.pagamento_forma = normalizaTexto(data.pagamento_forma) ?? ''
     }

     if (data.finalizado !== undefined) {
          resultado.finalizado = data.finalizado
     }

     if (data.entregue !== undefined) {
          resultado.entregue = data.entregue
     }

     if (data.local_entrega !== undefined) {
          resultado.local_entrega = normalizaTexto(data.local_entrega) ?? ''
     }

     if (data.data_pedido !== undefined) {
          resultado.data_pedido = data.data_pedido
     }

     if (data.data_prazo !== undefined) {
          resultado.data_prazo = data.data_prazo
     }

     return resultado
}

export const mapProdutoMaterialParaEncomendaMaterial = (
     data: ProdutoMaterialView[]
): EncomendaMaterialCriarDTO[] => {
     const materiaisMapeados = data.map(m => ({
          material_codigo: m.codigo,
          quantidade: m.quantidade
     }))
     console.log('map data',materiaisMapeados)
     return materiaisMapeados
}