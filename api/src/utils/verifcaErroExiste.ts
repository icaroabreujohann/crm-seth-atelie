import { Verificacao } from '../types/erro.verificacao'
import { gerenciadorMensagens } from './gerenciadorRepostas'
import { CodigoResposta } from '../types/codigo.resposta'
import { ErroCustomizado } from '../types/erro.customizado'

export function verificaErroExiste(verificacoes: Verificacao[]) {
     const erro = verificacoes.find(v => v.condicao)
     if (erro) throw new ErroCustomizado(erro.codigoResposta, erro.valor)
}