import Appointment from '../entities/Appointment' //obter formato dos dados
import {EntityRepository, Repository} from 'typeorm' //ter acesso as funções sql

@EntityRepository(Appointment)
class AppointmentsRepository extends Repository<Appointment> {

    public async findByDate(date: Date): Promise<Appointment | null> {
        const findAppointment = await this.findOne({
            where: {date: date},
        })
        return findAppointment || null
    }

}

export default AppointmentsRepository
