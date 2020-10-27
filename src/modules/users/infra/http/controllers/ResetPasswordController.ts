import {Request, Response} from 'express'
import { container } from 'tsyringe'

import ResetForgotPasswordService from '@modules/users/services/ResetPasswordService'


export default class SessionsController {

    public async create(request: Request, response: Response) {

        const { password, token } = request.body

        const resetForgotPassword = container.resolve(ResetForgotPasswordService)

        await resetForgotPassword.execute({
            token,
            password
        })

        return response.status(204).json()
    }



}
