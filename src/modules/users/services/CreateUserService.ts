import CreateAppointmentService from "@modules/appointments/services/CreateAppointmentService"
import User from '@modules/users/infra/typeorm/entities/users'
import { hash } from 'bcryptjs'
import AppError from '@shared/errors/AppError'

import IUsersRepository from '../repositories/IUsersRepository'

interface IRequest {
    name: string
    email: string
    password: string
}



class CreateUserService {

    constructor(
        private usersRepository: IUsersRepository
    ) {}

    public async execute({ name, email, password }:IRequest): Promise<User> { //return no formato do model definido

        const checkUserExists = await this.usersRepository.findByEmail(email)

        if(checkUserExists) {
            throw new AppError('Email already used.')
        }

        const hashedPassword = await hash(password, 8)

        const user = await this.usersRepository.create({
            name,
            email,
            password: hashedPassword
        })

        return user

    }
}

export default CreateUserService
