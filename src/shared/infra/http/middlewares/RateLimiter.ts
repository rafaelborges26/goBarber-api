import { Request, Response, NextFunction } from 'express'
import redis from 'redis'
import { RateLimiterRedis } from 'rate-limiter-flexible'
import AppError from '@shared/errors/AppError'

//utilizar redis para salvar o periodo de requisições de um ip em determinado tempo

const redisClient = redis.createClient({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    password: process.env.REDIS_PASS || undefined
})

const rateLimiter = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'ratelimit',
    points: 5, //quantas requisições permito por segundos de um ip
    duration: 1, //quantos segundos é a duração (um segundo nesse caso)
})


export default async function RateLimiter(request: Request, response: Response, next: NextFunction): Promise<void> {

    try{
        await rateLimiter.consume(request.ip)

        return next()

    }catch(err) {
        throw new AppError('Too many requests', 429)
    }
}
