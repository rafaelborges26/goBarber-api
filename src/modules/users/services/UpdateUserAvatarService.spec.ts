import AppError from '@shared/errors/AppError'

import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider'
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository'
import UpdateUserAvatarService from './UpdateUserAvatarService'

describe('UpdateUserAvatar', () => {
    it('should be able to update an user', async () => {
        const fakeUsersRepository = new FakeUsersRepository()
        const fakeStorageProvider = new FakeStorageProvider()

        const updateUserAvatar = new UpdateUserAvatarService(fakeUsersRepository, fakeStorageProvider)

        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'john@gmail.com',
            password: '123456'
        })

        await updateUserAvatar.execute({
            user_id: user.id,
            avatarFilename: 'avatar.jpg'
        })

        expect(user.avatar).toBe('avatar.jpg')
    })

    it('should not be able to update an avatar from non existing user ', async () => {
        const fakeUsersRepository = new FakeUsersRepository()
        const fakeStorageProvider = new FakeStorageProvider()

        const updateUserAvatar = new UpdateUserAvatarService(fakeUsersRepository, fakeStorageProvider)

        expect(updateUserAvatar.execute({
            user_id: 'noExistingId',
            avatarFilename: 'avatar.jpg'
        })
        ).rejects.toBeInstanceOf(AppError)

    })

    it('should deleting old avatar when updating a new', async () => {
        const fakeUsersRepository = new FakeUsersRepository()
        const fakeStorageProvider = new FakeStorageProvider()

        const deleteFIle = jest.spyOn(fakeStorageProvider, 'deleteFile') //espionar o metodo deleteFIle

        const updateUserAvatar = new UpdateUserAvatarService(fakeUsersRepository, fakeStorageProvider)

        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'john@gmail.com',
            password: '123456'
        })

        await updateUserAvatar.execute({
            user_id: user.id,
            avatarFilename: 'avatar.jpg'
        })

        await updateUserAvatar.execute({
            user_id: user.id,
            avatarFilename: 'avatar2.jpg'
        })

        expect(deleteFIle).toHaveBeenCalledWith('avatar.jpg') //se tiver sido chamado com o parametro avatar.jpg, ou seja tiver sido deletado para criar o outro avatar
        expect(user.avatar).toBe('avatar2.jpg')

    })


})
