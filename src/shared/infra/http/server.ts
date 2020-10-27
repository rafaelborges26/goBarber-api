import 'reflect-metadata'
import express, { Request, Response, NextFunction } from 'express'
import 'express-async-errors'
import routes from './routes'
import '../typeorm'
import uploadConfig from '@config/upload'
import AppError from '@shared/errors/AppError'
import cors from 'cors'
import '@shared/container'

const app = express()

app.use(cors())
app.use(express.json())
app.use('/file', express.static(uploadConfig.uploadsFolder))
app.use(routes)

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
