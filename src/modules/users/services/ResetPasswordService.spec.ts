import AppError from '@shared/errors/AppError'

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository'
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository'
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider'
import ResetPasswordService from './ResetPasswordService'
import { JsonWebTokenError } from 'jsonwebtoken'

let fakeUsersRepository: FakeUsersRepository
let fakeUserTokensRepository: FakeUserTokensRepository
let fakeHashProvider: FakeHashProvider
let resetPassword: ResetPasswordService

beforeEach(() => { //disparar antes de cada It
    fakeUsersRepository = new FakeUsersRepository()
    fakeUserTokensRepository = new FakeUserTokensRepository()
    fakeHashProvider = new FakeHashProvider()

    resetPassword = new ResetPasswordService(
        fakeUsersRepository,
        fakeUserTokensRepository,
        fakeHashProvider
    )
})

describe('SendForgotPasswordEmail', () => {
    it('should be able to reset the password', async () => {

        const generateHash = jest.spyOn(fakeHashProvider, 'generateHash')

        let user = await fakeUsersRepository.create({
            name: 'John Due',
            email: 'john@gmail.com',
            password: '123456'
        })

        const userToken = await fakeUserTokensRepository.generate(user.id)

        await resetPassword.execute({
            password: '123123',  //new password
            token: userToken.token
        })

        const updatedPassword = await fakeUsersRepository.findByid(user.id)

        expect(generateHash).toHaveBeenCalledWith('123123')
        expect(updatedPassword?.password).toBe('123123')
    })

    it('should not be able to reset the password with non-existing token', async () => {

        await expect(
            resetPassword.execute({
                token: 'non-existing-token',
                password: '123456'
            })
        ).rejects.toBeInstanceOf(AppError)
    })

    it('should not be able to reset the password with non-existing user', async () => {

        const { token } = await fakeUserTokensRepository.generate('non-existing-user')


        await expect(
            resetPassword.execute({
                token,
                password: '123456'
            })
        ).rejects.toBeInstanceOf(AppError)
    })

    it('should not be able to reset the password if had been more than 2 hours', async () => {

        let user = await fakeUsersRepository.create({
            name: 'John Due',
            email: 'john@gmail.com',
            password: '123456'
        })

        const userToken = await fakeUserTokensRepository.generate(user.id)

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            const customDate = new Date()

            return customDate.setHours(customDate.getHours() + 3) //primeira chamada executa essa função
        } ) //ao inves de chamar a funcao Date.now original, vai chamar a funcao q eu criei

        await expect(resetPassword.execute({
            password: '123123',
            token: userToken.token
        })).rejects.toBeInstanceOf(AppError)
    })

})
