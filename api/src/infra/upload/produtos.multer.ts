import fs from 'fs'
import multer from 'multer'
export const criaPastaSeNaoExistir = (caminho: string) => {
     if (!fs.existsSync(caminho)) fs.mkdirSync(caminho, { recursive: true })
}

export const uploadProdutos = multer({
     storage: multer.memoryStorage(),
     fileFilter: (req, file, cb) => {
          if (!file.mimetype.startsWith('image/')) {
               return cb(new Error('Arquivo inválido'))
          }
          cb(null, true)
     }
})