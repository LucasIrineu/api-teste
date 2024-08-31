import express from 'express'
import 'reflect-metadata'
import cors from 'cors'
import { AppDataSource } from './database/data-source'
import routes from './app/routes/measure.routes'

export const app = express()

app.use(cors())

app.use(express.json())

app.use(routes)

AppDataSource.initialize().then(async () => {
  console.log('Database OK!')
  app.listen(process.env.PORT, () => {
    console.log(`🚀 Servidor iniciado na porta ${process.env.PORT} 🚀`)
  })
})