import { Router, request, response } from 'express'
import { getCustomRepository } from 'typeorm'
import AppointmentsRepository from '../repositories/AppointmentsRepository'
import { parseISO, } from 'date-fns'
import CreateAppointmentService from '../services/CreateAppointmentService'

const appointmentsRouter = Router()


appointmentsRouter.post('/', async (request, response ) => {

    try {

        const { provider_id, date } = request.body

        //transformação dos dados da body permanece
        const parsedDate = parseISO(date) //Transforma em Date

        const createAppointment = new CreateAppointmentService()

        const appointment = await createAppointment.execute({provider_id, date: parsedDate})

        return response.json(appointment)

    }catch (err){
        return response.status(400).json({error: err.message })
    }

})

appointmentsRouter.get('/', async (request, response )=> {
    const appointmentsRepository = getCustomRepository(AppointmentsRepository)
    const appointments = await appointmentsRepository.find() //função do type orm, retornando todos os dados
    return response.json({appointments})
})

export default appointmentsRouter
