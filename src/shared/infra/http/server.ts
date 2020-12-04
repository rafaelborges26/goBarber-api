import 'reflect-metadata'
import 'dotenv/config'

import RateLimiter from './middlewares/RateLimiter'
import express, { Request, Response, NextFunction } from 'express'
import 'express-async-errors'
import routes from './routes'
import '../typeorm'
import uploadConfig from '@config/upload'
import AppError from '@shared/errors/AppError'
import cors from 'cors'
import '@shared/container'
import { errors } from 'celebrate'

const app = express()

app.use(cors())
app.use(express.json())
app.use('/files', express.static(uploadConfig.uploadsFolder)) //colocando antes do middleware RateLimiter para nao limitar a qtdd de requests para buscar imagens
app.use(RateLimiter)
app.use(routes)

app.use(errors())

app.use((err: Error, request: Request, response: Response, next:NextFunction) => {

    if(err instanceof AppError) {
        //se o erro for conhecido
        return response.status(err.statusCode).json({
            status: 'error',
            message: err.message,
        })
    }

    console.error(err)

    return response.status(500).json({
        status: 'error',
        message: 'Internal server error',
    })

})

app.listen('3333', () => {
    console.log('Server started')
})
