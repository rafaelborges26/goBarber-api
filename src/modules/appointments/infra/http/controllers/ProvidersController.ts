import {Request, Response} from 'express'
import { container } from 'tsyringe'
import { parseISO, } from 'date-fns'

import ListProvidersService from '@modules/appointments/services/ListProvidersServices'


export default class AppointmentsController {

public async index(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id

    const listProviders = container.resolve(ListProvidersService)

    const provider = await listProviders.execute({user_id})

    return response.json(provider)

}

}
