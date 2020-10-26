import User from '@modules/users/infra/typeorm/entities/users'
import AppError from '@shared/errors/AppError'
//import AppError from '@shared/errors/AppError'
import { inject, injectable } from 'tsyringe'
import { isAfter, addHours } from 'date-fns'

import IHashProvider from '../providers/HashProvider/models/IHashProvider'


import IUsersRepository from '../repositories/IUsersRepository'
import IUserTokensRepository from '../repositories/IUserTokensRepository'

interface IRequest {
    token: string
    password: string
}


@injectable()
class ResetPasswordService {

    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('userTokenRepository')
        private userTokensRepository: IUserTokensRepository,

        @inject('HashProvider')
        private hashProvider: IHashProvider
    ) {}

    public async execute({ token, password }: IRequest): Promise<void> { //return no formato do model definido
        const userToken = await this.userTokensRepository.findByToken(token)

        if(!userToken) {
            throw new AppError('User token does not exists')
        }

        const user = await this.usersRepository.findByid(userToken.user_id)

        if(!user) {
            throw new AppError('User does not exists')
        }

        const tokenCreatedAt = userToken.created_at
        const compareDate = addHours(tokenCreatedAt, 2)

        if(isAfter(Date.now(), compareDate)) { //se passamos da data limite de expiração, ou seja se agora foi maior q a data de criação + 2 horas.
            throw new AppError('token expired.')
        }


        user.password = await this.hashProvider.generateHash(password)

        await this.usersRepository.save(user)

    }
}

export default ResetPasswordService
