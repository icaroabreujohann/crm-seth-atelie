import { Router } from 'express'
import { ProdutosController } from './produtos.controller'
import { ProdutoMaterialController } from './materiais/produtoMaterial.controller'
import { validaCodigoParam, validaIdParam } from '../../middlewares/valida-param'
import { uploadProdutos } from '../../infra/upload/produtos.multer'

const router = Router()
const controller = new ProdutosController()
const controllerMateriais = new ProdutoMaterialController()


//Principal
router.get('/', controller.listarProdutos)
router.get('/:codigo/completo', validaCodigoParam, controller.listarProdutoCompleto)
router.get('/:codigo', validaCodigoParam, controller.listarProdutoCodigo)
router.post('/', uploadProdutos.array('fotos'), controller.criarProduto)
router.patch('/:codigo', validaCodigoParam, controller.editarProduto)
router.post('/:codigo/fotos', validaCodigoParam, uploadProdutos.array('fotos'), controller.editarFotosProduto)
router.delete('/:codigo', validaCodigoParam, controller.excluirProduto)

router.get('/:codigo/materiais', validaCodigoParam, controllerMateriais.listarPorProduto)
router.post('/:codigo/materiais', validaCodigoParam, controllerMateriais.adicionarMaterialProduto)
router.patch('/:codigo/materiais/:id', validaCodigoParam, validaIdParam, controllerMateriais.editarMaterialProduto)
router.delete('/:codigo/materiais/:id', validaCodigoParam, validaIdParam, controllerMateriais.excluirMaterialProduto)

export default router