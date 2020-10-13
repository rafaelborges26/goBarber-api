import User from '../infra/typeorm/entities/users'
import ICreateUserDTO from '../dtos/ICreateUserDTO'

export default interface IUsersRepository {

    //criar somente os metodos q o service user usa:

    findByid(id: string):Promise<User | undefined>
    findByEmail(email: string):Promise<User | undefined>
    create(data: ICreateUserDTO): Promise<User> //como vamos receber mais de uma informação, criar um dto
    save(user: User): Promise<User>
}
