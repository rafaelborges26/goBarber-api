import User from '@modules/users/infra/typeorm/entities/users'
import path from 'path'
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

        const forgotPasswordTemplate = path.resolve(__dirname, '..', 'views', 'forgot_password.hbs')

        await this.mailProvider.sendMail({
            to: {
                name: user.name,
                email: user.email,
            },
            subject: '[GoBarber] Recuperação de senha',
            templateData: {
                file: forgotPasswordTemplate,
                variables: { //essa variavel vai ser preenchida no {{name}} do template
                    name: user.name,
                    link: `${process.env.APP_WEB_URL}/reset_password?token=${token}`
                }
            },

        })
    }
}

export default SendForgotPasswordEmailService
