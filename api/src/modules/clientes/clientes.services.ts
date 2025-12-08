import { Cliente, CriarClienteDTO, EditarClienteDTO } from './clientes.types'
import { CODIGOS_ERRO } from '../../utils/codigosRespostas'
import { validaRegraNegocio } from '../../shared/validators/valida.regranegocio'
import { ClientesRepository } from '../clientes/clientes.repository'
import { assertResultadoExiste, assertResultadoNaoExiste } from '../../shared/asserts/assertResultadoBusca'
import { resultadoInexistente } from '../../utils/resultadoBusca'

export class ClientesService {
     private repository = new ClientesRepository()

     async listarClientes() {
          return await this.repository.listar()
     }

     async listarClientePorId(id: number) {
          const cliente = await this.repository.obterClientePorId(id)

          assertResultadoExiste(cliente, CODIGOS_ERRO.CLIENTE_N_EXISTE_ERR, id)

          return cliente
     }

     async criarCliente(data: CriarClienteDTO) {

          const [clienteInstagram, clienteTelefone] = await Promise.all([
               data.instagram ? this.repository.obterClientePorInstagram(data.instagram) : Promise.resolve(resultadoInexistente<Cliente>()),
               data.telefone ? this.repository.obterClientePorTelefone(data.telefone) : Promise.resolve(resultadoInexistente<Cliente>())
          ])

          validaRegraNegocio([
               { condicao: clienteInstagram.existe, valor: clienteInstagram, codigoResposta: CODIGOS_ERRO.CLIENTE_EXISTE_ERR },
               { condicao: clienteTelefone.existe, valor: clienteTelefone, codigoResposta: CODIGOS_ERRO.CLIENTE_EXISTE_ERR }
          ])

          return await this.repository.criar(data)
     }

     async editarCliente(id: number, data: EditarClienteDTO) {

          const [clienteAtual, clienteInstagram, clienteTelefone] = await Promise.all([
               this.repository.obterClientePorId(id),
               data.instagram ? this.repository.obterClientePorInstagram(data.instagram) : Promise.resolve(resultadoInexistente<Cliente>()),
               data.telefone ? this.repository.obterClientePorTelefone(data.telefone) : Promise.resolve(resultadoInexistente<Cliente>())
          ])

          assertResultadoExiste(clienteAtual, CODIGOS_ERRO.CLIENTE_N_EXISTE_ERR, { ...data, id })

          validaRegraNegocio([
               { condicao: clienteInstagram.existe && clienteInstagram.data.id != id, valor: { ...data, id }, codigoResposta: CODIGOS_ERRO.CLIENTE_EXISTE_IG_ERR },
               { condicao: clienteTelefone.existe && clienteTelefone.data.id != id, valor: { ...data, id }, codigoResposta: CODIGOS_ERRO.CLIENTE_EXISTE_IG_ERR }
          ])

          return await this.repository.editar(id, data)
     }

     async excluirCliente(id: number) {
          const cliente = await this.repository.obterClientePorId(id)
          assertResultadoExiste(cliente, CODIGOS_ERRO.CLIENTE_N_EXISTE_ERR, id)

          return await this.repository.excluir(id)
     }
}