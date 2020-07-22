import Appointment from '../models/Appointment'
import AppointmentsRepository from '../repositories/AppointmentsRepository'
import { startOfHour } from 'date-fns'


interface RequestDTO {
    provider: string
    date: Date
}


class CreateAppointmentService {

private appointmentsRepository: AppointmentsRepository


    constructor(appointmentsRepository: AppointmentsRepository ) {
        this.appointmentsRepository = appointmentsRepository //defini o this para usar na classe
    }

    public execute({provider, date}:RequestDTO): Appointment {

    const appointmentDate = startOfHour(date)

    const findAppointmentsInSameDate = this.appointmentsRepository.findByDate(appointmentDate)

   if(findAppointmentsInSameDate) {
       throw Error('this appointment has been already booked')
       //return response.status(404).json({message: })
   }

   const appointment = this.appointmentsRepository.create(
       {provider,
        date: appointmentDate
       })

       return appointment
    }
}

export default CreateAppointmentService
