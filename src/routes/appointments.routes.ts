import { Router, request, response } from 'express'
import { getCustomRepository } from 'typeorm'
import AppointmentsRepository from '../repositories/AppointmentsRepository'
import { parseISO, } from 'date-fns'
import CreateAppointmentService from '../services/CreateAppointmentService'

import ensureAuthenticated from '../middlewares/ensureAuthenticated'

const appointmentsRouter = Router()

appointmentsRouter.use(ensureAuthenticated)

appointmentsRouter.post('/', async (request, response ) => {

        const { provider_id, date } = request.body

        //transformação dos dados da body permanece
        const parsedDate = parseISO(date) //Transforma em Date

        const createAppointment = new CreateAppointmentService()

        const appointment = await createAppointment.execute({provider_id, date: parsedDate})

        return response.json(appointment)

})

appointmentsRouter.get('/', async (request, response )=> {
    console.log(request.user)
    const appointmentsRepository = getCustomRepository(AppointmentsRepository)
    const appointments = await appointmentsRepository.find() //função do type orm, retornando todos os dados
    return response.json({appointments})
})

export default appointmentsRouter
