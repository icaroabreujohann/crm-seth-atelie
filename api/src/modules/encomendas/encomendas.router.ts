import { Router } from 'express'
import { EncomendasController } from './encomendas.controller'
import { validaCodigoParam } from '../../middlewares/validaParam'

const router = Router()
const controller = new EncomendasController()

router.get('/', controller.listar)
router.get('/:codigo', validaCodigoParam, controller.listarPorCodigo)
router.post('/', controller.criarEncomenda)
router.patch('/:codigo', validaCodigoParam, controller.editarEncomenda)
router.delete('/:codigo', validaCodigoParam, controller.excluirEncomenda)

export default router