import { sql } from '../../../config/db'
import { ResultadoBusca } from '../../../shared/types';
import { resultadoEncontrado, resultadoInexistente } from '../../../utils/resultadoBusca';
import { Produto } from '../produtos.types';
import { CriarProdutoMaterialRepoDTO, EditarProdutoMaterialRepoDTO, ProdutoMaterial } from './produtoMaterial.types';

export class ProdutoMaterialRepository {
     async listarPorProduto(produto_id: number): Promise<ResultadoBusca<ProdutoMaterial[]>> {
          const materiais = await sql<ProdutoMaterial[]>`
               select
                    pm.*,
                    m.nome as material_nome,
                    m.preco_x_qtd as material_preco_x_qtd
               from
                    produtos_materiais pm
               join materiais m
                    on m.id = pm.material_id
               where pm.produto_id = ${produto_id}

          `
          return materiais ? resultadoEncontrado(materiais) : resultadoInexistente()
     }

     async criar(data: CriarProdutoMaterialRepoDTO): Promise<ProdutoMaterial | null> {
          const [material] = await sql<ProdutoMaterial[]>`
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

     async editar(id: number, data: EditarProdutoMaterialRepoDTO): Promise<ProdutoMaterial | null> {
          const [material] = await sql<ProdutoMaterial[]>`
          update produtos_materiais
          set
               quantidade = ${data.quantidade},
               preco_final = ${data.preco_final}
          where id = ${id}
          returning *
          `
          return material ?? null
     }

     async excluir(id: number): Promise<ProdutoMaterial | null> {
          const [material] = await sql<ProdutoMaterial[]>`
               delete from produtos_materiais
               where id = ${id}
               returning *
          `
          return material ?? null
     }

     //

     async obterMaterialProdutoPorId(id: number): Promise<ResultadoBusca<ProdutoMaterial>> {
          const [material] = await sql<ProdutoMaterial[]>`
                    select * from produtos_materiais
                    where id = ${id}
               `
          return material ? resultadoEncontrado(material) : resultadoInexistente()
     }
}