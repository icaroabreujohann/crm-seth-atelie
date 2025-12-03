import { Router } from 'express'
import { ProdutosController } from './produtos.controller'
import { validaIdParam } from '../../middlewares/validaIdParam'

const router = Router()
const controller = new ProdutosController()

router.get('/', controller.listarProdutos)
router.get('/:id', validaIdParam, controller.listarProdutoPorId)
router.post('/', controller.criarProduto)
router.patch('/:id', validaIdParam, controller.editarProduto)
router.delete('/:id', validaIdParam, controller.excluirProduto)

export default router