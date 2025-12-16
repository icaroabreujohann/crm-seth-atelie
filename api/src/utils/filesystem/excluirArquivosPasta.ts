import fs from 'fs/promises'
import path from 'path'

export const excluirArquivosPasta = async (caminho: string) => {
     const arquivos = await fs.readdir(caminho)

     await Promise.all(
          arquivos.map(arquivo =>
               fs.rm(path.join(caminho, arquivo), {recursive: true, force: true})
          )
     )
}