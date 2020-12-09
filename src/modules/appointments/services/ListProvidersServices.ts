import { inject, injectable } from 'tsyringe'

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider'
import User from '@modules/users/infra/typeorm/entities/users'
import IUsersRepository from '@modules/users/repositories/IUsersRepository'
import AppError from '@shared/errors/AppError'
import { classToClass } from 'class-transformer'

interface Request {
    user_id: string
}

@injectable()
class ListProvidersService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('CacheProvider')
        private cacheProvider: ICacheProvider

    ) {}

    public async execute( {user_id }:Request ):Promise<User[]> {
        let users = await this.cacheProvider.recover<User[]>(`providers-list:${user_id}`) //os dados estao sendo buscados do cache
        //let users //para limpar o cache, descomentar essa linha e comentar a de cima
        if(!users) {

        users = await this.usersRepository.findAllProviders(
            {expect_user_id: user_id}
        )

        //console.log('a query no banco feita')

        if(!users) {
            throw new AppError('User not found')
        }

        await this.cacheProvider.save(`providers-list:${user_id}`, classToClass(users))

        }

        return users
    }
}

export default ListProvidersService
