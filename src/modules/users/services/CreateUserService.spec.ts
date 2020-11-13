import AppError from '@shared/errors/AppError'

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository'
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider'
import CreateUserService from './CreateUserService'
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider'

    let fakeUsersRepository: FakeUsersRepository
    let fakeHashProvider: FakeHashProvider
    let createUserService: CreateUserService
    let fakeCacheProvider: FakeCacheProvider
describe('CreateUser', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository()
        fakeHashProvider = new FakeHashProvider()
        fakeCacheProvider = new FakeCacheProvider()
        createUserService = new CreateUserService(fakeUsersRepository, fakeHashProvider, fakeCacheProvider)
    })

    it('should be able to create a new user', async () => {
        const user = await createUserService.execute({
            name: 'John Doe',
            email: 'john@gmail.com',
            password: '123456'

        })
        expect(user).toHaveProperty('id')
    })

    it('should not be able to create a new user with the same email from anoter', async () => {
         await createUserService.execute({
            name: 'John Doe',
            email: 'john@gmail.com',
            password: '123456'
        })

        await expect(createUserService.execute({
            name: 'John Doe',
            email: 'john@gmail.com',
            password: '123456'
        }),
        ).rejects.toBeInstanceOf(AppError)
    })
})
