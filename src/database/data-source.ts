import { configDotenv } from 'dotenv'
import 'dotenv/config'
import path from 'path'
import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { CreateMeasuresTable1724879856714 } from './migrations/1724879856714-CreateMeasuresTable'
import Measure from '../app/entities/Measure'

const port = process.env.DB_PORT as number | undefined

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: port,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: false,
    subscribers: [],

    entities: [Measure],
    migrations: [CreateMeasuresTable1724879856714]
})
