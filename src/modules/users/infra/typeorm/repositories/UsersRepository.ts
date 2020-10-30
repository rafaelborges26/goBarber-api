import IUsersRepository from '@modules/users/repositories/IUsersRepository'
import {getRepository, Repository, Not} from 'typeorm' //ter acesso as funções sql

import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO'
import User from '../entities/users' //obter formato dos dados
import IFindAllProvider from '@modules/users/dtos/IFindAllProviderDTO'

//deixar os metodos prontos para uso, sem precisar utilizar a lib do typeorm fora daqui

class UsersRepository implements IUsersRepository { //repository do typeorm
   private ormRepository: Repository<User>;
    constructor() {
        this.ormRepository = getRepository(User) //cria o repositorio
    }


    public async findAllProviders({expect_user_id}:IFindAllProvider ):Promise<User[]>{
        let users: User[]
           if(expect_user_id) {
             users = await this.ormRepository.find({
                 where: {
                     id: Not(expect_user_id)
                }
             })
           } else {
            users = await this.ormRepository.find()
           }

           return users
    }

    public async findByid(id: string): Promise<User | undefined> {
        const user = await this.ormRepository.findOne(id)

        return user
    }

    public async findByEmail(email: string): Promise<User | undefined>{
        const user = await this.ormRepository.findOne({
            where: {email: email}

        })

        return user
    }

    public async create({ name, email, password }: ICreateUserDTO): Promise<User> {
        const user = this.ormRepository.create({ name, email, password} )

        await this.ormRepository.save(user)

        return user
    }

    public async save(user: User): Promise<User> {
        return this.ormRepository.save(user)
    }

}

export default UsersRepository
