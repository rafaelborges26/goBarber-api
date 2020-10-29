import {Request, Response} from 'express'
import { container } from 'tsyringe'

import UpdateProfileService from '@modules/users/services/UpdateProfileService'
import ShowProfileService from '@modules/users/services/ShowProfileService'


export default class ProfileController {

    public async show(request: Request, response: Response) {
        const user_id = request.user.id //rota utiliza o token jwt, com ele é setado o id do user

        const ShowProfile = container.resolve(ShowProfileService)

        const user = await ShowProfile.execute({user_id})

        delete user.password;

        return response.json(user)
    }

    public async update(request: Request, response: Response) {

        const { name,email, old_password, password } = request.body

        const updateProfile = container.resolve(UpdateProfileService)

        const user_id = request.user.id

        const user = await updateProfile.execute({
            user_id,
            name,
            email,
            old_password,
            password
        })

        delete user.password

        return response.json(user)
    }
}
