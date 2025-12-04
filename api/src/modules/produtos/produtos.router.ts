import { Router } from 'express'
import { ProdutosController } from './produtos.controller'
import { validaCodigoParam, validaIdParam } from '../../middlewares/validaParam'
import { uploadProdutos } from '../../infra/upload/produtos.multer'

const router = Router()
const controller = new ProdutosController()

router.get('/', controller.listarProdutos)
router.get('/:id', validaCodigoParam, controller.listarProdutoCodigo)
router.post('/', uploadProdutos.array('fotos'), controller.criarProduto)
router.patch('/:id', validaCodigoParam, controller.editarProduto)
router.delete('/:id/:codigo', validaCodigoParam, controller.excluirProduto)

export default router