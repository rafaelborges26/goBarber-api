import Appointment from '../entities/Appointment' //obter formato dos dados
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository'
import {getRepository, Repository} from 'typeorm' //ter acesso as funções sql

import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentsDTO'

class AppointmentsRepository implements IAppointmentsRepository { //repository do typeorm
   private ormRepository: Repository<Appointment>;
    constructor() {
        this.ormRepository = getRepository(Appointment) //cria o repositorio
    }

    public async findByDate(date: Date): Promise<Appointment | undefined> {
        const findAppointment = await this.ormRepository.findOne({
            where: {date: date},
        })
        return findAppointment
    }

    public async create({ provider_id ,date }: ICreateAppointmentDTO): Promise<Appointment> {
        const appointment = this.ormRepository.create({ provider_id, date} )

        await this.ormRepository.save(appointment)

        return appointment
    }

}

export default AppointmentsRepository
