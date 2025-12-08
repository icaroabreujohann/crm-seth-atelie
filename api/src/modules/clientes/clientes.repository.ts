import { sql } from '../../config/db'
import { Cliente, ClienteId, CriarClienteDTO, EditarClienteDTO } from './clientes.types'
import { normalizaTexto } from '../../utils/normalizaTexto'
import { ResultadoBusca } from "../../shared/types";
import { resultadoEncontrado, resultadoInexistente } from '../../utils/resultadoBusca'

export class ClientesRepository {

     async listar(): Promise<Cliente[]> {
          return await sql`select * from clientes order by id desc`
     }

     async listarPorId(id: number): Promise<ResultadoBusca<Cliente>> {
          const [cliente] = await sql<Cliente[]>`
               select * from clientes
               where id = ${id}
               limit 1

               `
          return cliente ? resultadoEncontrado(cliente) : resultadoInexistente()
     }

     async criar(data: CriarClienteDTO): Promise<Cliente | null> {
          const [clienteNovo] = await sql<Cliente[]>`
          insert into clientes (nome, instagram, telefone)
          values (
               ${data.nome},
               ${normalizaTexto(data.instagram)},
               ${normalizaTexto(data.telefone)}
          )
          returning *
     `
          return clienteNovo ?? null
     }

     async editar(id: number, data: EditarClienteDTO): Promise<Cliente | null> {
          const [clienteAtualizado] = await sql<Cliente[]>`
          update clientes
          set 
               nome = ${data.nome},
               instagram = ${normalizaTexto(data.instagram)},
               telefone = ${normalizaTexto(data.telefone)}
          where
               id = ${id}
          returning *
     `
          return clienteAtualizado ?? null
     }

     async excluir(id: number): Promise<Cliente | null> {
          const [clienteExcluido] = await sql<Cliente[]>`
          delete from clientes
          where id = ${id}
          returning *
     `
          return clienteExcluido ?? null
     }

     //Validações

     async obterClientePorInstagram(instagram: string): Promise<ResultadoBusca<Cliente>> {
          const [cliente] = await sql<Cliente[]>`
               select * from clientes
               where instagram = ${instagram}
          `
          return cliente ? resultadoEncontrado(cliente) : resultadoInexistente()
     }

     async obterClientePorTelefone(telefone: string): Promise<ResultadoBusca<Cliente>> {
          const [cliente] = await sql<Cliente[]>`
               select * from clientes
               where telefone = ${telefone}
          `
          return cliente ? resultadoEncontrado(cliente) : resultadoInexistente()
     }

     async obterClientePorId(id: number): Promise<ResultadoBusca<Cliente>> {
          const [cliente] = await sql<Cliente[]>`
               select * from clientes
               where id = ${id}
          `

          return cliente ? resultadoEncontrado(cliente) : resultadoInexistente()
     }
}
