import { sql } from '../../config/db'
import { Cliente, CriarClienteDTO, EditarClienteDTO } from '../../types/cliente'

export class ClientesRepository {

     async listar(): Promise<Cliente[]> {
          return await sql`select * from clientes order by id desc`
     }

     async listarPorId(id: number): Promise<Cliente[]> {
          return await sql`
          select * from clientes
          where id = ${id}
     `
     }

     async criar(data: CriarClienteDTO): Promise<Cliente> {
          const [clienteNovo] = await sql<Cliente[]>`
          insert into clientes (nome, instagram, numero)
          values (
               ${data.nome},
               ${data.instagram},
               ${data.numero}
          )
          returning *
     `
          if (!clienteNovo) throw new Error('Falha ao criar cliente')
          return clienteNovo
     }

     async editar(data: EditarClienteDTO): Promise<Cliente> {
          const [clienteAtualizado] = await sql<Cliente[]>`
          update clientes
          set 
               nome = ${data.nome},
               instragram = ${data.instagram},
               numero = ${data.numero}
          where
               id = ${data.id}
          returning *
     `
          if (!clienteAtualizado) throw new Error('Falha ao editar cliente')
          return clienteAtualizado
     }

     async excluir(id: number): Promise<Cliente> {
          const [clienteExcluido] = await sql<Cliente[]>`
          delete from clientes
          where id = ${id}
          returning *
     `
          if (!clienteExcluido) throw new Error('Falha ao excluir cliente')
          return clienteExcluido
     }
}
