import {Request, Response} from 'express'
import { container } from 'tsyringe'

import AuthenticateService from '@modules/users/services/AuthenticateUserService'


export default class SessionsController {

    public async create(request: Request, response: Response) {

        const { email, password } = request.body

        const authenticateUser = container.resolve(AuthenticateService)

        const { user, token } = await authenticateUser.execute({
            email,
            password
        })

        delete user.password

        return response.json({user, token})
    }



}
