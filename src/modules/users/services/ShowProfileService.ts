
import User from '../infra/typeorm/entities/users'
import AppError from '@shared/errors/AppError'
import IUsersRepository from '../repositories/IUsersRepository'
import { inject, injectable } from 'tsyringe'


interface Request {
    user_id: string
}

@injectable()
class ShowProfile {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
    ) {}

    public async execute( {user_id }:Request ):Promise<User> {
        const user = await this.usersRepository.findByid(user_id)

        if(!user) {
            throw new AppError('User not found')
        }

        return user
    }
}

export default ShowProfile
