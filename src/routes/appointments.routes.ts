import { Router, request, response } from 'express'
import AppointmentsRepository from '../repositories/AppointmentsRepository'
import { parseISO, } from 'date-fns'
import CreateAppointmentService from '../services/CreateAppointmentService'

const appointmentsRouter = Router()

const appointmentsRepository = new AppointmentsRepository() //pegar os metodos de interação com os dados

appointmentsRouter.post('/', (request, response ) => {

    try {

        const { provider, date } = request.body

        //transformação dos dados da body permanece
        const parsedDate = parseISO(date) //Transforma em Date

        const createAppointment = new CreateAppointmentService(appointmentsRepository)

        const appointment = createAppointment.execute({provider, date: parsedDate})

        return response.json(appointment)

    }catch (err){
        return response.status(400).json({error: err.message })
    }

})

appointmentsRouter.get('/', (request, response )=> {
    const appointments = appointmentsRepository.all() //retornando o array
    return response.json({appointments})
})

export default appointmentsRouter
