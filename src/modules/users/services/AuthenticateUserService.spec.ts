import AppError from '@shared/errors/AppError'

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository'
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider'
import AuthenticateUserService from './AuthenticateUserService'
import CreateUserService from './CreateUserService'

describe('AuthenticateUser', () => {
    it('should be able to authenticate', async () => {
        const fakeUsersRepository = new FakeUsersRepository()
        const fakeHashProvider = new FakeHashProvider()


        const createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider)
        const authenticateUser = new AuthenticateUserService(fakeUsersRepository, fakeHashProvider)

        const user = await createUser.execute({ //cria o user, para depois autenticar
            name: 'John Due',
            email: 'john@gmail.com',
            password: '123456'
        })

        const response = await authenticateUser.execute({
            email: 'john@gmail.com',
            password: '123456'
        })

        expect(response).toHaveProperty('token')
        expect(response.user).toEqual(user)

    })

})
