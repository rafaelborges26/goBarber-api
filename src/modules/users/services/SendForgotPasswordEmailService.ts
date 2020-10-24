import User from '@modules/users/infra/typeorm/entities/users'
//import AppError from '@shared/errors/AppError'
import { inject, injectable } from 'tsyringe'
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider'

import IUsersRepository from '../repositories/IUsersRepository'
import IUserTokensRepository from '../repositories/IUserTokensRepository'

import AppError from '@shared/errors/AppError'

interface IRequest {
    email: string
}


@injectable()
class SendForgotPasswordEmailService {

    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('IMailProvider')
        private mailProvider: IMailProvider,

        @inject('usersTokenRepository')
        private userTokensRepository: IUserTokensRepository
    ) {}

    public async execute({ email }: IRequest): Promise<void> { //return no formato do model definido
        const user = await this.usersRepository.findByEmail(email)

        if(!user) {
            throw new AppError('User does not exists.')
        }

        await this.userTokensRepository.generate(user.id)

        this.mailProvider.sendMail(email, 'Pedido de recuperação de senha')
    }
}

export default SendForgotPasswordEmailService
