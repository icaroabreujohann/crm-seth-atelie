import { Router } from 'express'
import { validaCodigoParam, validaIdParam } from '../../middlewares/validaParam'
import { MaterialsController } from './materiais.controller'

const router = Router()
const controller = new MaterialsController()

router.get('/', controller.listarMateriais)
router.get('/:codigo', validaCodigoParam, controller.listarMaterialCodigo)
router.post('/', controller.criarMaterial)
router.patch('/:codigo', validaCodigoParam, controller.editarMaterial)
router.delete('/:codigo', validaCodigoParam, controller.excluirMaterial)