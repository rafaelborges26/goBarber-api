import { Router, request, response } from 'express'
import { uuid } from 'uuidv4'
import { startOfHour, parseISO, isEqual } from 'date-fns'

interface Appointment {
    id: string
    provider: string
    date: Date
}

const appointmentsRouter = Router()

const appointments: Appointment[] = []

appointmentsRouter.post('/', (request, response ) => {
    const { provider, date } = request.body

    const parsedDate = startOfHour(parseISO(date)) //mantem so o valor da hora e era o resto, parseIso transfora date em um objeto Date()

    const findAppointmentsInSameDate = appointments.find(appointment => isEqual(parsedDate, appointment.date))

    if(findAppointmentsInSameDate) {
        return response.status(404).json({message: 'this appointment has been already booked'})
    }

    const appointment = {
        id: uuid(),
        provider,
        date: parsedDate
    }

    appointments.push(appointment)

    return response.json(appointment)
})


export default appointmentsRouter
