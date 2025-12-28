import sharp from 'sharp'

export interface FotoWEBP {
     buffer: Buffer
     originalName: string
     mimeType: 'image/webp'
}

export async function converteFotosParaWEBP(fotos: Express.Multer.File[]): Promise<FotoWEBP[]> {
     const fotosConvertidas: FotoWEBP[] = []

     for (const foto of fotos) {
          const bufferWebp = await sharp(foto.buffer)
               .resize(800, 800, { fit: 'inside' })
               .webp({ quality: 80 })
               .toBuffer()

          fotosConvertidas.push({
               buffer: bufferWebp,
               originalName: foto.originalname,
               mimeType: 'image/webp'
          })
     }

     return fotosConvertidas
}    