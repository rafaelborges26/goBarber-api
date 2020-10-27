import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository'
import {getRepository, Repository} from 'typeorm' //ter acesso as funções sql

import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO'
import UserToken from '../entities/userToken' //obter formato dos dados
import User from '../entities/users';

//deixar os metodos prontos para uso, sem precisar utilizar a lib do typeorm fora daqui

class UserTokensRepository implements IUserTokensRepository { //repository do typeorm
   private ormRepository: Repository<UserToken>;
    constructor() {
        this.ormRepository = getRepository(UserToken) //cria o repositorio
    }


    public async findByToken(token: string): Promise<UserToken | undefined> {
        const userToken = await this.ormRepository.findOne({
            where: {token: token}
        })

        return userToken
    }

    public async generate(user_id: string): Promise<UserToken>{
        const UserToken = this.ormRepository.create({
            user_id
        })

        await this.ormRepository.save(UserToken)

        return UserToken
    }







}

export default UserTokensRepository
