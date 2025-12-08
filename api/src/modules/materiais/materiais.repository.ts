import { sql } from '../../config/db'
import { ResultadoBusca } from '../../shared/types'
import { resultadoEncontrado, resultadoInexistente } from '../../utils/resultadoBusca'
import { normalizaTexto } from '../../utils/normalizaTexto'
import { CriarMaterialDTO, EditarMaterialDTO, Material, MaterialCompleto } from './materiais.types'

export class MateriaisRepository {

     async listar(): Promise<MaterialCompleto[]> {
          return await sql`
               select
                    mat.*,
                    um.sigla as unidade_medida_sigla,
                    mt.nome as tipo_nome
               from materiais mat
               join materiais_tipos mt 
                    on mat.tipo_id = mt.id
               join unidades_medida um 
                    on um.id = mat.unidade_medida_id
               order by mat.id desc
          `
     }

     async listarPorCodigo(codigo: string): Promise<ResultadoBusca<MaterialCompleto>> {
          const [material] = await sql<MaterialCompleto[]>`
               select
                    mat.*,
                    um.sigla as unidade_medida_sigla,
                    mt.nome as tipo_nome
               from materiais mat
               join materiais_tipos mt 
                    on mat.tipo_id = mt.id
               join unidades_medida um 
                    on um.id = mat.unidade_medida_id
               where mat.codigo = ${codigo}
          `

          return material ? resultadoEncontrado(material) : resultadoInexistente()
     }

     async criar(data: CriarMaterialDTO): Promise<Material | null> {
          const [material] = await sql<Material[]>`
               insert into materiais (nome, tipo_id, unidade_medida_id, preco, quantidade, observacoes)
                    values (
                    ${data.nome},
                    ${data.tipo_id},
                    ${data.unidade_medida_id},
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
                    tipo_id           = coalesce(${data.tipo_id}, tipo_id),
                    unidade_medida_id = coalesce(${data.unidade_medida_id}, unidade_medida_id),
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

     async obterMaterialPorCodigo(codigo: string): Promise<ResultadoBusca<MaterialCompleto>> {
          const [material] = await sql<MaterialCompleto[]>`
               select
                    mat.*,
                    um.sigla as unidade_medida_sigla,
                    mt.nome as tipo_nome
               from materiais mat
               join materiais_tipos mt 
                    on mat.tipo_id = mt.id
               join unidades_medida um 
                    on um.id = mat.unidade_medida_id
               where mat.codigo = ${codigo}
          `

          return material ? resultadoEncontrado(material) : resultadoInexistente()
     }

     async obterMaterialPorId(id: number): Promise<ResultadoBusca<Material>> {
          const [material] = await sql<Material[]>`
               select
                    mat.*,
                    um.sigla as unidade_medida_sigla,
                    mt.nome as tipo_nome
               from materiais mat
               join materiais_tipos mt 
                    on mat.tipo_id = mt.id
               join unidades_medida um 
                    on um.id = mat.unidade_medida_id
               where mat.id = ${id}
          `

          return material ? resultadoEncontrado(material) : resultadoInexistente()
     }


}