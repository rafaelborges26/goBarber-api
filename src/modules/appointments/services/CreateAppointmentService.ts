import AppError from '../../../shared/errors/AppError'
import Appointment from '../infra/typeorm/entities/Appointment'
import { startOfHour } from 'date-fns'
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
