import { Cliente, CriarClienteDTO, EditarClienteDTO } from '../../types/cliente'
import { CODIGOS_ERRO } from '../../utils/codigosRespostas'
import { validaRegraNegocio } from '../../validators/valida.regranegocio'
import { ClientesRepository } from '../clientes/clientes.repository'

export class ClientesService {
     private repository = new ClientesRepository()

     async listarClientes() {
          return await this.repository.listar()
     }

     async listarClientePorId(id: number) {
          const cliente = await this.repository.listarPorId(id)
          validaRegraNegocio([{ condicao: !cliente, valor: id, codigoResposta: CODIGOS_ERRO.CLIENTE_N_EXISTE_ERR }])

          return cliente
     }

     async criarCliente(data: CriarClienteDTO) {

          const [clienteInstagramExiste, clienteTelefoneExiste] = await Promise.all([
               data.instagram ? this.repository.obterClientePorInstagram(data.instagram) : { existe: false, campo: 'instragram' },
               data.telefone ? this.repository.obterClientePorTelefone(data.telefone) : { existe: false, campo: 'telefone' }
          ])

          validaRegraNegocio([
               { condicao: clienteInstagramExiste.existe, valor: clienteInstagramExiste, codigoResposta: CODIGOS_ERRO.CLIENTE_EXISTE_ERR },
               { condicao: clienteTelefoneExiste.existe, valor: clienteTelefoneExiste, codigoResposta: CODIGOS_ERRO.CLIENTE_EXISTE_ERR }
          ])

          return await this.repository.criar(data)
     }

     async editarCliente(id: number, data: EditarClienteDTO) {
          const [clienteInstagramExiste, clienteTelefoneExiste] = await Promise.all([
               data.instagram ? this.repository.obterClientePorInstagram(data.instagram) : { existe: false, campo: 'Instragram', data: null },
               data.telefone ? this.repository.obterClientePorTelefone(data.telefone) : { existe: false, campo: 'Telefone', data: null }
          ])

          validaRegraNegocio([
               {
                    condicao: clienteInstagramExiste.existe && clienteInstagramExiste.data?.id != id,
                    valor: data,
                    codigoResposta: CODIGOS_ERRO.CLIENTE_EXISTE_ERR
               },
               {
                    condicao: clienteTelefoneExiste.existe && clienteTelefoneExiste.data?.id != id,
                    valor: data,
                    codigoResposta: CODIGOS_ERRO.CLIENTE_EXISTE_ERR
               }
          ])

          return await this.repository.editar(id, data)
     }

     async excluirCliente(id: number) {
          const [clienteExisteId] = await Promise.all([
               this.repository.obterClientePorId(id)
          ])

          validaRegraNegocio([{condicao: !clienteExisteId.existe, valor: id, codigoResposta: CODIGOS_ERRO.CLIENTE_N_EXISTE_ERR}])

          return await this.repository.excluir(id)
     }
}