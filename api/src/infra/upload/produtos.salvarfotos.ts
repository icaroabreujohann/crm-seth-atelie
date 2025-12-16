import fs from 'fs/promises'
import path from 'path'
import { criaPastaSeNaoExistir } from './produtos.multer'
import { excluirPasta } from '../../utils/filesystem/excluirPasta'
import { PRODUTOS_TMP_DIR } from './paths'
import { excluirArquivosPasta } from '../../utils/filesystem/excluirArquivosPasta'

export const salvarFotosProduto = async (codigo: string, fotos: Express.Multer.File[], caminho: string) => {
     const pastaProduto = path.join(caminho, codigo)
     criaPastaSeNaoExistir(pastaProduto)

     await Promise.all([
          fotos.map((foto, index) => {
               const ext = path.extname(foto.originalname)
               const nomeArquivo = `${index + 1}${ext}`

               const destino = path.join(pastaProduto, nomeArquivo)
               return fs.rename(foto.path, destino)
          }),

          await excluirArquivosPasta(PRODUTOS_TMP_DIR)
     ]
     )
}

export const editarFotosProduto = async (codigo: string, fotos: Express.Multer.File[], caminho: string) => {
     const pastaProduto = path.join(caminho, codigo)
     criaPastaSeNaoExistir(pastaProduto)

     const arquivosExistentes = await fs.readdir(pastaProduto)
     await Promise.all([
          arquivosExistentes.map((arquivo) => {
               const caminhoArquivo = path.join(pastaProduto, arquivo)
               return fs.unlink(caminhoArquivo)
          }),

          fotos.map((foto, index) => {
               const ext = path.extname(foto.originalname)
               const nomeArquivo = `${index + 1}${ext}`

               const destino = path.join(pastaProduto, nomeArquivo)
               return fs.rename(foto.path, destino)
          }),

          await excluirArquivosPasta(PRODUTOS_TMP_DIR)
     ])
}