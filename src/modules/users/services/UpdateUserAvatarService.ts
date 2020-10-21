import { UpdateDateColumn } from "typeorm";

import User from '../infra/typeorm/entities/users'
import uploadConfig from '@config/upload'
import ISotrageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider'
import path from 'path'
import fs from 'fs'
import AppError from '@shared/errors/AppError'
import IUsersRepository from '../repositories/IUsersRepository'
import { inject, injectable } from 'tsyringe'


interface Request {
    user_id: string
    avatarFilename: string
}

@injectable()
class UpdateUserAvatarService {


    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('StorageProvider')
        private storageProvider: ISotrageProvider,
    ) {}

    public async execute( {user_id, avatarFilename}:Request ):Promise<User> {

        //validar se existe
        const user = await this.usersRepository.findByid(user_id)

        if(!user) {
            throw new AppError('Only authenticated user can change avatar', 401)
        }

        if(user.avatar) {
            await this.storageProvider.deleteFile(user.avatar)
        }

        const fileName = await this.storageProvider.saveFile(avatarFilename)

        //setar o novo
        user.avatar = fileName

        await this.usersRepository.save(user)

        return user
    }
}

export default UpdateUserAvatarService
