import AppError from '@shared/errors/AppError'

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository'
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService'
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider'
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository'

let fakeUsersRepository: FakeUsersRepository
let fakeMailProvider: FakeMailProvider
let fakeUserTokensRepository: FakeUserTokensRepository
let sendForgotPasswordEmail: SendForgotPasswordEmailService

beforeEach(() => { //disparar antes de cada It
    fakeUsersRepository = new FakeUsersRepository()
    fakeMailProvider = new FakeMailProvider()
    fakeUserTokensRepository = new FakeUserTokensRepository()
    sendForgotPasswordEmail = new SendForgotPasswordEmailService(
        fakeUsersRepository,
        fakeMailProvider,
        fakeUserTokensRepository
    )
})

describe('SendForgotPasswordEmail', () => {
    it('should be able to recover the password using the email', async () => {

        const sendEmail = jest.spyOn(fakeMailProvider, 'sendMail') //espionar se essa funcao foi executada

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

    it('should not be able to recorver a non-existing user password', async () => {

        jest.spyOn(fakeMailProvider, 'sendMail') //espionar se essa funcao foi executada

        await expect(sendForgotPasswordEmail.execute({
            email: 'john@gmail.com',
        })).rejects.toBeInstanceOf(AppError)
    })

    it('should generate a forgot password token', async () => {

        const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate')

        const user = await fakeUsersRepository.create({
            name: 'John Due',
            email: 'john@gmail.com',
            password: '123456'
        })

        await sendForgotPasswordEmail.execute({
            email: 'john@gmail.com',
        })

        expect(generateToken).toHaveBeenCalledWith(user.id)
    })

})
