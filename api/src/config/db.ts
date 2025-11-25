import postgres from 'postgres'
import dotenv from 'dotenv'

dotenv.config()

export const sql = postgres(process.env.DATABASE_URL!)

export const testarConexaoDb = async () => {
     try {
          const response = await sql`select now()`
          console.log('Conexão com o DB realizada.', response)
     } catch (error) {
          console.log('Erro ao conectar ao DB.')
     }
}

module.exports = { sql, testarConexaoDb }