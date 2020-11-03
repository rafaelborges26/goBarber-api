import {Request, Response} from 'express'
import { container } from 'tsyringe'
import { parseISO, } from 'date-fns'

import ListProviderMonthAvailabilityService from '@modules/appointments/services/ListProviderMonthAvailabilityService'


export default class ProviderMonthAvailabilityController {

public async index(request: Request, response: Response): Promise<Response> {
    const { provider_id } = request.params //pegar id da url
    const { month, year } = request.body

    const ListProviderMonthAvailability = container.resolve(ListProviderMonthAvailabilityService)

    const availability = await ListProviderMonthAvailability.execute({
        provider_id,
        month,
        year
    })

    return response.json(availability)

}

}
