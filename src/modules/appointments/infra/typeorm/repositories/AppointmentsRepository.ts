import Appointment from '../entities/Appointment' //obter formato dos dados
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository'
import {EntityRepository, Repository} from 'typeorm' //ter acesso as funções sql

@EntityRepository(Appointment)
class AppointmentsRepository extends Repository<Appointment> implements IAppointmentsRepository {

    public async findByDate(date: Date): Promise<Appointment | undefined> {
        const findAppointment = await this.findOne({
            where: {date: date},
        })
        return findAppointment
    }

}

export default AppointmentsRepository
