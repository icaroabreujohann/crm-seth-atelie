import fs from 'fs/promises'
import path from 'path'
import { criaPastaSeNaoExistir } from './produtos.multer'
import { excluirPasta } from '../filesystem/excluir-pasta'
import { PRODUTOS_TMP_DIR } from './paths'
import { excluirArquivosPasta } from '../filesystem/excluir-arquivos-pasta'
import { FotoWEBP } from '../../middlewares/converte-fotos'

export const salvarFotosProduto = async (codigo: string, fotos: FotoWEBP[], caminho: string) => {
     const pastaProduto = path.join(caminho, codigo)
     criaPastaSeNaoExistir(pastaProduto)

     await Promise.all([
          ...fotos.map((foto, index) => {
               const nomeArquivo = `${index + 1}.webp`
               const destino = path.join(pastaProduto, nomeArquivo)

               return fs.writeFile(destino, foto.buffer)
          }),

          excluirArquivosPasta(PRODUTOS_TMP_DIR)
     ]
     )
}

export const editarFotosProduto = async (codigo: string, fotos: FotoWEBP[], caminho: string) => {
     const pastaProduto = path.join(caminho, codigo)
     criaPastaSeNaoExistir(pastaProduto)

     const arquivosExistentes = await fs.readdir(pastaProduto)

     await Promise.all([
          ...arquivosExistentes.map((arquivo) =>
               fs.unlink(path.join(pastaProduto, arquivo))
          ),

          ...fotos.map((foto, index) => {
               const nomeArquivo = `${index + 1}.webp`
               const destino = path.join(pastaProduto, nomeArquivo)

               return fs.writeFile(destino, foto.buffer)
          }),

          excluirArquivosPasta(PRODUTOS_TMP_DIR),
     ])

}