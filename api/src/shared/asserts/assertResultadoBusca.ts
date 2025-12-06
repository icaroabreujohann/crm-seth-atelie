import { CodigoResposta } from '../../types/codigo.resposta';
import { ErroCustomizado } from '../../types/erro.customizado';
import { ResultadoBusca } from '../types'

export function assertResultadoExiste<T>(
     resultado: ResultadoBusca<T>,
     codigoErro: CodigoResposta,
     valor?: any
): asserts resultado is { existe: true; data: T } {
     if (!resultado.existe) {
          throw new ErroCustomizado(codigoErro, valor)
     }
}

export function assertResultadoNaoExiste<T>(
     resultado: ResultadoBusca<T>,
     codigoErro: CodigoResposta,
     valor?: any
): asserts resultado is { existe: false; data: null } {
     if (resultado.existe) {
          throw new ErroCustomizado(codigoErro, valor)
     }
}