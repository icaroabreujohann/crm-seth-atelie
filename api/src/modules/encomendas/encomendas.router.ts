import { Router } from 'express'
import { EncomendasController } from './encomendas.controller'
import { validaCodigoParam } from '../../middlewares/valida-param'

const router = Router()
const controller = new EncomendasController()

router.get('/', controller.listarEncomendas)
router.get('/:codigo/completa', validaCodigoParam, controller.listarEncomendaCompleta)
router.post('/', controller.criarEncomenda)
router.patch('/:codigo', validaCodigoParam, controller.editarEncomenda)
router.delete('/:codigo', validaCodigoParam, controller.excluirEncomenda)

export default router