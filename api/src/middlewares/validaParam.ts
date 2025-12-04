import { Request, Response, NextFunction } from 'express'
import { CODIGOS_ERRO } from '../utils/codigosRespostas'
import { ErroCustomizado } from '../types/erro.customizado'

const UUID_REGEX = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/

export function validaIdParam(req: Request, res: Response, next: NextFunction) {
     const idParam = req.params.id
     const id = Number(idParam)

     if (!Number.isInteger(id) || id <= 0) throw new ErroCustomizado(CODIGOS_ERRO.ID_INVALIDO, { id }, 400)

     req.params.id = String(id)
     next()
}

export function validaCodigoParam(req: Request, res: Response, next: NextFunction) {
     const { codigo } = req.params

     if(!codigo || !UUID_REGEX.test(codigo)) throw new ErroCustomizado(CODIGOS_ERRO.CODIGO_INVALIDO, {codigo}, 400)

     req.params.codigo = String(codigo)
     next()
}
