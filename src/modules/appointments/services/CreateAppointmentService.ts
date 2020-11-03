import AppError from '../../../shared/errors/AppError'
import Appointment from '../infra/typeorm/entities/Appointment'
import { startOfHour, isBefore, getHours } from 'date-fns'
import IAppointmentsRepository from '../repositories/IAppointmentsRepository'
import { injectable ,inject } from 'tsyringe'

interface IRequest {
    provider_id: string
    user_id: string
    date: Date
}

@injectable()
class CreateAppointmentService {

    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository
    ) {}

    public async execute({provider_id, user_id, date}:IRequest): Promise<Appointment> {

    const appointmentDate = startOfHour(date)

        if (isBefore(appointmentDate, Date.now())) {
            throw new AppError("You can´t create an appointment on a past date.")
        }

        if(user_id === provider_id) {
            throw new AppError('You can´t create an appointment with youself.')
        }

        if(getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17 ) {
            throw new AppError('You can only create appointments between 8am and 5pm.')
        }

    const findAppointmentsInSameDate = await this.appointmentsRepository.findByDate(appointmentDate)

   if(findAppointmentsInSameDate) {
       throw new AppError('this appointment has been already booked')
       //return response.status(404).json({message: })
   }

   const appointment = await this.appointmentsRepository.create(
       {provider_id,
        user_id,
        date: appointmentDate
       })//criação do repositorio, depois precisamos salvar

       return appointment
    }
}

export default CreateAppointmentService
