import Appointment from '../models/Appointment'
import AppointmentsRepository from '../repositories/AppointmentsRepository'
import { startOfHour } from 'date-fns'
import { getCustomRepository } from 'typeorm'


interface RequestDTO {
    provider: string
    date: Date
}


class CreateAppointmentService {

    public async execute({provider, date}:RequestDTO): Promise<Appointment> {

    const appointmentsRepository = getCustomRepository(AppointmentsRepository) //para dar a variavel o poder de utilizar comandos sql
    const appointmentDate = startOfHour(date)

    const findAppointmentsInSameDate = await appointmentsRepository.findByDate(appointmentDate)

   if(findAppointmentsInSameDate) {
       throw Error('this appointment has been already booked')
       //return response.status(404).json({message: })
   }

   const appointment = appointmentsRepository.create(
       {provider,
        date: appointmentDate
       })//criação do repositorio, depois precisamos salvar

       await appointmentsRepository.save(appointment) //salvando a criação do registro

       return appointment
    }
}

export default CreateAppointmentService
