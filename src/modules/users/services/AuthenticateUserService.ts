import User from '../infra/typeorm/entities/users'
import { sign } from 'jsonwebtoken'
import authConfig from '@config/auth'
import AppError from '@shared/errors/AppError'
import { inject, injectable } from 'tsyringe'

import IHashProvider from '../providers/HashProvider/models/IHashProvider'
import IUsersRepository from '../repositories/IUsersRepository'


interface IRequest {
    email: string
    password: string
}

interface IResponse {
    user : User
    token: string
}
@injectable()
class AuthenticateUserService {

    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('HashProvider')
        private hashProvider: IHashProvider
    ) {}

    public async execute( { email, password}: IRequest ): Promise<IResponse>  {
        const user = await this.usersRepository.findByEmail(email)

    if(!user) {
        throw new AppError('Incorrect email/Password combination.', 401)

    }
        const passwordMached = await this.hashProvider.compareHash(password, user.password)

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
