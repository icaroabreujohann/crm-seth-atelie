import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { testarConexaoDb } from './config/db'

import clientesRoutes from './modules/clientes/clientes.router'
import produtosRoutes from './modules/produtos/produtos.router'
import materiaisRoutes from './modules/materiais/materiais.router'
import { erroGlobal } from './middlewares/erroGlobal'
import path from 'path'
import { PRODUTOS_DIR } from './infra/upload/paths'

dotenv.config()

const app = express()
const port = process.env.PORT || 3001

app.use(express.json())
app.use(cors())

app.use('/clientes', clientesRoutes)
app.use('/produtos', produtosRoutes)
app.use('/materiais', materiaisRoutes)


app.use(erroGlobal)
app.use(
     '/arquivos/produtos',
     express.static(path.join(PRODUTOS_DIR))
)

app.get('/', async (req, res) => {
     res.send('<h1>teste</h1>')
})

const iniciarApi = async () => {
     try {
          await testarConexaoDb()

          app.listen(port, () => {
               console.log('A API está rodando na porta', port)
          })
     } catch (error) {
          console.log('Erro ao iniciar a API', error)
     }
}

iniciarApi()