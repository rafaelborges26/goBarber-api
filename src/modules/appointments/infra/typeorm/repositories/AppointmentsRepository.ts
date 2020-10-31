import Appointment from '../entities/Appointment' //obter formato dos dados
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository'
import {getRepository, Repository, Between, Raw} from 'typeorm' //ter acesso as funções sql
import { startOfMonth, endOfMonth } from 'date-fns'
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentsDTO'
import IFIndAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFIndAllInMonthFromProviderDTO'


class AppointmentsRepository implements IAppointmentsRepository { //repository do typeorm
   private ormRepository: Repository<Appointment>;
    constructor() {
        this.ormRepository = getRepository(Appointment) //cria o repositorio
    }

    public async findAllInMonthFromProvider({provider_id, month, year}: IFIndAllInMonthFromProviderDTO): Promise<Appointment[]> {
        const parsedMonth = String(month).padStart(2, '0')
        const appointments = await this.ormRepository.find({
            where: {
                provider_id,
                date: Raw(dateFieldName =>
                    `to_char(${dateFieldName}, 'MM-YYYY') = '${parsedMonth}-${year}'`
                )
            }
        })
            return appointments
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
