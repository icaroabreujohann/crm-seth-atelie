import { CODIGOS_ERRO } from '../../utils/codigosRespostas'
import { ErroCustomizado } from '../../types/erro.customizado'

export function validaRequisicao<T extends Record<string, any>>(
     data: T,
     dadosNecessarios: (keyof T)[]
): void {
     const dadosFaltando = dadosNecessarios.filter(d => {
          return data[d] == undefined || data[d] == null
     })

     if (dadosFaltando.length > 0) throw new ErroCustomizado(CODIGOS_ERRO.DADOS_INCOMPLETOS, { dadosFaltando, dadosNecessarios }, 400)
}

export function validaTipoDado(dado: unknown, tipo: 'string' | 'number' | 'boolean' | 'object' | 'array'): void {
     const tipoReal = Array.isArray(dado) ? 'array' : typeof dado

     if (tipoReal != tipo) throw new ErroCustomizado(CODIGOS_ERRO.DADO_TIPO_INVALIDO, { tipoEnviado: tipoReal, tipoEsperado: tipo }, 400)
}