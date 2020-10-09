import CreateAppointmentService from "../modules/appointments/services/CreateAppointmentService"
import User from '../models/users'
import { getRepository } from 'typeorm'
import { hash } from 'bcryptjs'
import AppError from '../shared/errors/AppError'

interface Request {
    name: string
    email: string
    password: string
}

class CreateUserService {
    public async execute({ name, email, password }:Request): Promise<User> { //return no formato do model definido

        const usersRepository = getRepository(User) //obter funções do repository, delete, insert..
        const checkUserExists = await usersRepository.findOne({
            where: { email: email }//campo igual ao valor q to recebendo
        })

        if(checkUserExists) {
            throw new AppError('Email already used.')
        }

        const hashedPassword = await hash(password, 8)

        const user = usersRepository.create({
            name,
            email,
            password: hashedPassword
        })

        await usersRepository.save(user)

        return user

    }
}

export default CreateUserService
