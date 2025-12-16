import { sql } from '../../../config/db'
import { ResultadoBusca } from '../../../shared/types';
import { resultadoEncontrado, resultadoInexistente } from '../../../utils/resultadoBusca';
import { CriarEncomendaMaterialRepoDTO, EditarEncomendaMaterialRepoDTO, EncomendaMaterial } from './encomendaMaterial.types';

export class EncomendaMaterialRepository  {
     async listarMateriaisPorEncomenda(encomenda_id: number): Promise<ResultadoBusca<EncomendaMaterial[]>> {
          const materiais = await sql<EncomendaMaterial[]>`
          select
          em.*,
          m.nome as material_nome,
          m.preco_x_qtd as material_preco_x_qtd
          from
          encomendas_materiais em
          join materiais m
          on m.id = em.material_id
          where em.encomenda_id = ${encomenda_id}
          
          `
          return materiais ? resultadoEncontrado(materiais) : resultadoInexistente()
     }
     
     async listarMaterialPorId(id: number): Promise<ResultadoBusca<EncomendaMaterial>> {
          const [material] = await sql<EncomendaMaterial[]>`
                    select * from encomendas_materiais
                    where id = ${id}
               `
          return material ? resultadoEncontrado(material) : resultadoInexistente()
     }

     async criar(data: CriarEncomendaMaterialRepoDTO): Promise<EncomendaMaterial | null> {
          const [material] = await sql<EncomendaMaterial[]>`
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

     async editar(id: number, data: EditarEncomendaMaterialRepoDTO): Promise<EncomendaMaterial | null> {
          const [material] = await sql<EncomendaMaterial[]>`
          update encomendas_materiais
          set
               quantidade = ${data.quantidade},
               preco_final = ${data.preco_final}
          where id = ${id}
          returning *
          `
          return material ?? null
     }

     async excluir(id: number): Promise<EncomendaMaterial | null> {
          const [material] = await sql<EncomendaMaterial[]>`
               delete from encomendas_materiais
               where id = ${id}
               returning *
          `
          return material ?? null
     }

     //

}