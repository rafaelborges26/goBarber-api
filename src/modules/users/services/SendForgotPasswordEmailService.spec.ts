import AppError from '@shared/errors/AppError'

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository'
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService'
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider'

describe('SendForgotPasswordEmail', () => {
    it('should be able to recover the password using the email', async () => {
        const fakeUsersRepository = new FakeUsersRepository()
        const fakeMailProvider = new FakeMailProvider()

        const sendEmail = jest.spyOn(fakeMailProvider, 'sendMail') //espionar se essa funcao foi executada

        const sendForgotPasswordEmail = new SendForgotPasswordEmailService(fakeUsersRepository, fakeMailProvider)

        await fakeUsersRepository.create({
            name: 'John Due',
            email: 'john@gmail.com',
            password: '123456'
        })

        await sendForgotPasswordEmail.execute({
            email: 'john@gmail.com',
        })

        expect(sendEmail).toHaveBeenCalled()

    })
})
