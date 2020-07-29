import { UpdateDateColumn } from "typeorm";

import { getRepository } from 'typeorm'
import User from '../models/users'
import uploadConfig from '../config/upload'
import path from 'path'
import fs from 'fs'

interface Request {
    user_id: string
    avatarFilename: string
}

class UpdateUserAvatarService {
    public async execute( {user_id, avatarFilename}:Request ):Promise<User> {
        const userRepository = getRepository(User)

        //validar se existe
        const user = await userRepository.findOne(user_id)

        if(!user) {
            throw new Error('Only authenticated user can change avatar')
        }

        if(user.avatar) {
            //deletar avatar anterior

            const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar) //juntando o caminho mais o nome do arquivo para excluir
            const userAvtarFileExists = await fs.promises.stat(userAvatarFilePath) //obterá o status do arquivo se ele existir

            if(userAvtarFileExists) {
                await fs.promises.unlink(userAvatarFilePath) //eexclui o arquivo de avatar
            }
        }

        //setar o novo
        user.avatar = avatarFilename

        await userRepository.save(user)

        return user
    }
}

export default UpdateUserAvatarService
