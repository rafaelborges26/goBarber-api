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

        @inject('MailProvider')
        private mailProvider: IMailProvider,

        @inject('UserTokensRepository')
        private userTokensRepository: IUserTokensRepository
    ) {}

    public async execute({ email }: IRequest): Promise<void> { //return no formato do model definido
        const user = await this.usersRepository.findByEmail(email)

        if(!user) {
            throw new AppError('User does not exists.')
        }

        const { token } = await this.userTokensRepository.generate(user.id)

        await this.mailProvider.sendMail({
            to: {
                name: user.name,
                email: user.email,
            },
            subject: '[GoBarber] Recuperação de senha',
            templateData: {
                template: 'Olá, {{name}}: {{token}}',
                variables: { //essa variavel vai ser preenchida no {{name}} do template
                    name: user.name,
                    token: token
                }
            },

        })
    }
}

export default SendForgotPasswordEmailService
