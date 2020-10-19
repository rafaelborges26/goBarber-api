import { uuid } from 'uuidv4'
import IUsersRepository from '@modules/users/repositories/IUsersRepository'

import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO'
import User from '../../infra/typeorm/entities/users' //obter formato dos dados

//deixar os metodos prontos para uso, sem precisar utilizar a lib do typeorm fora daqui

class UsersRepository implements IUsersRepository { //repository do typeorm
   private users: User[] = []


    public async findByid(id: string): Promise<User | undefined> {
        const findUser = this.users.find(user => user.id === id)

        return findUser
    }

    public async findByEmail(email: string): Promise<User | undefined>{
        const findUser = this.users.find(user => user.email === email)

        return findUser
    }

    public async create(userData: ICreateUserDTO): Promise<User> {
        const user = new User()

        Object.assign(user, { id: uuid() }, userData)

        this.users.push(user)

        return user
    }

    public async save(user: User): Promise<User> {
        const findIndex = this.users.findIndex(findUser => findUser.id === user.id)

        this.users[findIndex] = user

        return user
    }

}

export default UsersRepository
