import { sql } from '../../config/db'
import { Cliente, CriarClienteDTO, EditarClienteDTO } from '../../types/cliente'

export async function listar(): Promise<Cliente[]> {
     return await sql`select * from clientes order by id desc`
}

export async function criar(data: CriarClienteDTO): Promise<Cliente> {
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

export async function editar(data: EditarClienteDTO): Promise<Cliente> {
     const [clienteAtualizado] = await sql<Cliente[]>`
          update clientes (nome, instagram, numero)
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

export async function excluir(id: number): Promise<Cliente> {
     const [clienteExcluido] = await sql<Cliente[]>`
          delete from clientes
          where id = ${id}
          returning *
     `
     if (!clienteExcluido) throw new Error('Falha ao excluir cliente')
     return clienteExcluido
}