import { sql } from '../../../config/db'
import { ResultadoBusca } from '../../../shared/types';
import { resultadoEncontrado, resultadoInexistente } from '../../../utils/resultadoBusca';
import { EncomendaMaterialCriarDB, EncomendaMaterialDB, EncomendaMaterialView } from './encomendaMaterialtypes';

export class EncomendaMaterialRepository {
     async listarMaterialPorEncomenda(encomenda_id: number): Promise<ResultadoBusca<EncomendaMaterialView[]>> {
          const materiais = await sql<EncomendaMaterialView[]>`
               select
                    em.*,
                    m.codigo as codigo,
                    m.nome as material_nome,
                    m.preco_x_qtd as material_preco_x_qtd,
                    um.sigla as material_unidade_medida_sigla,
                    mt.nome as material_tipo_nome
               from
                    encomendas_materiais em
               join materiais m
                    on m.id = em.material_id
               join unidades_medida um
                    on um.id = m.unidade_medida_id
               join materiais_tipos mt
                    on mt.id = m.tipo_id
               where em.encomenda_id = ${encomenda_id}
          `
          return materiais ? resultadoEncontrado(materiais) : resultadoInexistente()
     }

     async criar(data: EncomendaMaterialCriarDB): Promise<EncomendaMaterialDB | null> {
          const [material] = await sql<EncomendaMaterialDB[]>`
          insert into encomendas_materiais (encomenda_id,material_id,quantidade,preco_final)
          values (
               ${data.encomenda_id},
               ${data.material_id},
               ${data.quantidade},
               ${data.preco_final}
          )
          returning *
     `
          return material ?? null
     }

     async excluirPorProduto(encomenda_id: number): Promise<void> {
          const [materiaisExcluidos] = await sql`
               delete from encomendas_materiais
               where encomenda_id = ${encomenda_id}
          `
     }
}