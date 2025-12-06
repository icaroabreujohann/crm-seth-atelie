import { sql } from '../../config/db'
import { ResultadoBusca } from '../../shared/types'
import { resultadoEncontrado, resultadoInexistente } from '../../utils/resultadoBusca'
import { normalizaTexto } from '../../utils/normalizaTexto'
import { CriarMaterialDTO, EditarMaterialDTO, Material } from '../../types/materiais'

export class MateriaisRepository {

     async listar(): Promise<Material[]> {
          return await sql`select * from materiais order by id desc`
     }

     async listarPorCodigo(codigo: string): Promise<ResultadoBusca<Material>> {
          const [material] = await sql<Material[]>`
               select * from materiais
               where codigo = ${codigo}
               limit 1
          `

          return material ? resultadoEncontrado(material) : resultadoInexistente()
     }

     async criar(data: CriarMaterialDTO): Promise<Material | null> {
          const [material] = await sql<Material[]>`
               insert into materiais (nome, tipo, unidade_medida, preco, quantidade, observacoes)
                    values (
                    ${data.nome},
                    ${data.tipo},
                    ${data.unidade_medida},
                    ${data.preco},
                    ${data.quantidade},
                    ${normalizaTexto(data.observacoes)}
                    )
               returning *
          `


          return material ?? null
     }

     async editar(id: number, data: EditarMaterialDTO): Promise<Material | null> {
          const [material] = await sql<Material[]>`
               update materiais
               set
                    nome           = coalesce(${data.nome}, nome),
                    tipo           = coalesce(${data.tipo}, tipo),
                    unidade_medida = coalesce(${data.unidade_medida}, unidade_medida),
                    preco          = coalesce(${data.preco}, preco),
                    quantidade     = coalesce(${data.quantidade}, quantidade),
                    observacoes    = coalesce(${normalizaTexto(data.observacoes)}, observacoes),
                    data_alteracao = now()
               where id = ${id}
               returning *
          `

          return material ?? null
     }

     async excluir(id: number): Promise<Material | null> {
          const [materialExcluido] = await sql<Material[]>`
               delete from materiais
               where id = ${id}
               returning *
          `

          return materialExcluido ?? null
     }

     //

     async obterMaterialPorCodigo(codigo: string): Promise<ResultadoBusca<Material>> {
          const [material] = await sql<Material[]>`
               select * from materiais
               where codigo = ${codigo}
          `

          return material ? resultadoEncontrado(material) : resultadoInexistente()
     }

     async obterMaterialPorId(id: number): Promise<ResultadoBusca<Material>> {
          const [material] = await sql<Material[]>`
               select * from materiais
               where id = ${id}
          `

          return material ? resultadoEncontrado(material) : resultadoInexistente()
     }


}