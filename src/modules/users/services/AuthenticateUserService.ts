import { getRepository } from 'typeorm'
import { compare } from 'bcryptjs'
import User from '../entities/users'
import { sign } from 'jsonwebtoken'
import authConfig from '../../../config/auth'
import { request } from 'express'
import AppError from '../../../shared/errors/AppError'


interface Request {
    email: string
    password: string
}

interface Response {
    user : User
    token: string
}

class AuthenticateUserService {

    public async execute( { email, password}: Request ): Promise<Response>  {
        const usersRepository = getRepository(User)
        const user = await usersRepository.findOne({
            where: {email: email}
        })

    if(!user) {
        throw new AppError('Incorrect email/Password combination.', 401)

    }
        const passwordMached = await compare(password, user.password)

        if(!passwordMached) {
            throw new AppError('Incorrect email/Password combination.', 401)
        }

        const { secret, expiresIn } = authConfig.jwt

        const token = sign( {}, secret, {
            subject: user.id,
            expiresIn
        }) //1 parametro{}: n eh seguro colocar senha, pois qqr um consegue acessar, eh bom colocar id, nome do user, permissoes.. infos q iremos precisar utilizar de maneira mais facil

        return {user,token}

    }
}

export default AuthenticateUserService
