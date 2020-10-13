import { UpdateDateColumn } from "typeorm";

import User from '../infra/typeorm/entities/users'
import uploadConfig from '@config/upload'
import path from 'path'
import fs from 'fs'
import AppError from '@shared/errors/AppError'
import IUsersRepository from '../repositories/IUsersRepository'

interface Request {
    user_id: string
    avatarFilename: string
}

class UpdateUserAvatarService {


    constructor(
        private usersRepository: IUsersRepository
    ) {}

    public async execute( {user_id, avatarFilename}:Request ):Promise<User> {

        //validar se existe
        const user = await this.usersRepository.findByid(user_id)

        if(!user) {
            throw new AppError('Only authenticated user can change avatar', 401)
        }

        if(user.avatar) {
            //deletar avatar anterior

            const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar) //juntando o caminho mais o nome do arquivo para formar um caminho só
            const userAvtarFileExists = await fs.promises.stat(userAvatarFilePath) //obterá o status do arquivo se ele existir

            if(userAvtarFileExists) {
                await fs.promises.unlink(userAvatarFilePath) //eexclui o arquivo de avatar
            }
        }

        //setar o novo
        user.avatar = avatarFilename

        await this.usersRepository.save(user)

        return user
    }
}

export default UpdateUserAvatarService
