import AppError from '../../../shared/errors/AppError'
import Appointment from '../infra/typeorm/entities/Appointment'
import { startOfHour, isBefore, getHours, format } from 'date-fns'
import IAppointmentsRepository from '../repositories/IAppointmentsRepository'
import { injectable ,inject } from 'tsyringe'
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository'
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider'


interface IRequest {
    provider_id: string
    user_id: string
    date: Date
}

@injectable()
class CreateAppointmentService {

    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository,

        @inject('NotificationsRepository')
        private notificationsRepository: INotificationsRepository,

        @inject('CacheProvider')
        private cacheProvider: ICacheProvider
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

       const dateFormatted = format(appointmentDate, "dd/MM/yyyy 'às' HH:mm'h'")
       await this.notificationsRepository.create({
           recipient_id: provider_id,
           content: `Ǹovo agendamento para dia ${dateFormatted}`
       })

       console.log(`provider-appointments:${provider_id}:${format(appointmentDate, 'yyyy-M-d' )}`)

       await this.cacheProvider.invalidate(`provider-appointments:${provider_id}:${format(appointmentDate, 'yyyy-M-d' )}`)

       return appointment
    }
}

export default CreateAppointmentService
