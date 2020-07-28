import {Request, Response, NextFunction  } from 'express'
import { verify } from 'jsonwebtoken'
import authConfig from '../config/auth'

interface TokenPayLoad {
    iat: string,
    exp: string,
    sub: string
}

export default function ensureAuthenticated(request: Request, response: Response, next: NextFunction): void {

    //para pegar o header
    const authHeader = request.headers.authorization

    if(!authHeader) {
        throw new Error('JWT token is missing')
    }

    //obter o token
    const [, token] = authHeader.split(' ')

    const secret = authConfig.jwt.secret

try {
    const decoded = verify(token, secret)
    const { sub } = decoded as TokenPayLoad

    request.user = {
        id: sub,
    }

    return next()
} catch {
    throw new Error('Invalid JWT Token')
}

}
