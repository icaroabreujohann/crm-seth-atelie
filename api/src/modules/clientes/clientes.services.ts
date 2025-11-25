import { Cliente, CriarClienteDTO, EditarClienteDTO } from '../../types/cliente'
import { CODIGOS_ERRO } from '../../utils/codigosRespostas'
import { verificaErroExiste } from '../../utils/verifcaErroExiste'
import { ClientesRepository } from '../clientes/clientes.repository'

export class ClientesService {
     private repository = new ClientesRepository()

     async listarClientes() {
          return await this.repository.listar()
     }

     async listarClientePorId(id: number) {
          const cliente = await this.repository.listarPorId(id)

          verificaErroExiste([{ condicao: cliente.length === 0, valor: id, codigoResposta: CODIGOS_ERRO.CLIENTE_N_EXISTE_ERR }])

          return cliente
     }

     async criarCliente(data: CriarClienteDTO) {
          return await this.repository.criar(data)
     }

     async editarCliente(data: EditarClienteDTO) {
          return await this.repository.editar(data)
     }

     async excluirCliente(id: number) {
          return await this.repository.excluir(id)
     }
}