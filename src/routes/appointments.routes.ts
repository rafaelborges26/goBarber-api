import { Router, request, response } from 'express'
import { startOfHour, parseISO, } from 'date-fns'
import AppointmentsRepository from '../repositories/AppointmentsRepository'

const appointmentsRouter = Router()

const appointmentsRepository = new AppointmentsRepository() //pegar os metodos de interação com os dados

appointmentsRouter.post('/', (request, response ) => {
    const { provider, date } = request.body

    const parsedDate = startOfHour(parseISO(date)) //mantem so o valor da hora e era o resto, parseIso transfora date em um objeto Date()

     const findAppointmentsInSameDate = appointmentsRepository.findByDate(parsedDate)

    if(findAppointmentsInSameDate) {
        return response.status(404).json({message: 'this appointment has been already booked'})
    }

    const appointment = appointmentsRepository.create(
        {provider,
         date: parsedDate
        })

    return response.json(appointment)
})

appointmentsRouter.get('/', (request, response )=> {
    const appointments = appointmentsRepository.all() //retornando o array
    return response.json({appointments})
})

export default appointmentsRouter
