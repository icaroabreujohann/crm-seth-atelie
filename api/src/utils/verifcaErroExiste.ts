import { Verificacao } from '../types/erro.verificacao'
import { gerenciadorMensagens } from './gerenciadorRepostas'
import { CodigoResposta } from '../types/codigo.resposta'

export function verificaErroExiste(verificacoes: Verificacao[]){
     const erro = verificacoes.find(v => v.condicao)
     if(erro) throw gerenciadorMensagens.criarMensagemErro(erro.codigoResposta, erro.valor)
}