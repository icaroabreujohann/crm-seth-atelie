import { sql } from '../../../config/db'
import { ResultadoBusca } from '../../../shared/types';
import { resultadoEncontrado, resultadoInexistente } from '../../../utils/resultadoBusca';
import { ProdutoMaterialCriarDB, ProdutoMaterialDB, ProdutoMaterialView } from './produtoMaterial.types';

export class ProdutoMaterialRepository {
     async listarMaterialPorProduto(produto_id: number): Promise<ResultadoBusca<ProdutoMaterialView[]>> {
          const materiais = await sql<ProdutoMaterialView[]>`
               select
                    pm.*,
                    m.codigo as codigo,
                    m.nome as material_nome,
                    m.preco_x_qtd as material_preco_x_qtd,
                    um.sigla as material_unidade_medida_sigla,
                    mt.nome as material_tipo_nome
               from
                    produtos_materiais pm
               join materiais m
                    on m.id = pm.material_id
               join unidades_medida um
                    on um.id = m.unidade_medida_id
               join materiais_tipos mt
                    on mt.id = m.tipo_id
               where pm.produto_id = ${produto_id}
          `
          return materiais ? resultadoEncontrado(materiais) : resultadoInexistente()
     }

     async criar(data: ProdutoMaterialCriarDB): Promise<ProdutoMaterialDB | null> {
          const [material] = await sql<ProdutoMaterialDB[]>`
          insert into produtos_materiais (produto_id,material_id,quantidade,preco_final)
          values (
               ${data.produto_id},
               ${data.material_id},
               ${data.quantidade},
               ${data.preco_final}
          )
          returning *
     `
          return material ?? null
     }

     async excluirPorProduto(produto_id: number): Promise<void> {
          const [materiaisExcluidos] = await sql`
               delete from produtos_materiais
               where produto_id = ${produto_id}
          `
     }
}