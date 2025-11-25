import { Cliente, CriarClienteDTO, EditarClienteDTO } from '../../types/cliente'
import { ClientesRepository } from '../clientes/clientes.repository'

export class ClientesService {
     private repository = new ClientesRepository()

     async listarClientes() {
          const response = await this.repository.listar()
          return response
     }

     async listarClientePorId(id: number) {
          const response = await this.repository.listarPorId(id)
          return response
     }

     async criarCliente(data: CriarClienteDTO){
          const response = await this.repository.criar(data)
          return response
     }

     async editarCliente(data: EditarClienteDTO){
          const response = await this.repository.editar(data)
          return response
     }

     async excluirCliente(id: number) {
          const response = await this.repository.excluir(id)
          return response
     }
}