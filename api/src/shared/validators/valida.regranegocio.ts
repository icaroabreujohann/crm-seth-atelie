import { Verificacao } from '../../types/erro.verificacao'
import { ErroCustomizado } from '../../types/erro.customizado'

export function validaRegraNegocio(regras: Verificacao[]){
     const erro = regras.find(v => v.condicao)
     if (erro) throw new ErroCustomizado(erro.codigoResposta, erro.valor)
}