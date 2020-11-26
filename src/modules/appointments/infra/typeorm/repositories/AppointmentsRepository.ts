import Appointment from '../entities/Appointment' //obter formato dos dados
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository'
import {getRepository, Repository, Between, Raw} from 'typeorm' //ter acesso as funções sql
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentsDTO'
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO'
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO'


class AppointmentsRepository implements IAppointmentsRepository { //repository do typeorm
   private ormRepository: Repository<Appointment>;
    constructor() {
        this.ormRepository = getRepository(Appointment) //cria o repositorio
    }

    public async findAllInDayFromProvider({provider_id, day, month, year}: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {
        const parsedDay = String(day).padStart(2, '0')
        const parsedMonth = String(month).padStart(2, '0')
        const appointments = await this.ormRepository.find({
            where: {
                provider_id,
                date: Raw(dateFieldName =>
                    `to_char(${dateFieldName}, 'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${year}'`
                )
            },
            relations: ['user'], //tras o relacionamento de user o nome da relacao q foi criado na entidade
        })
            return appointments
    }

    public async findAllInMonthFromProvider({provider_id, month, year}: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
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

    public async findByDate(date: Date, provider_id: string): Promise<Appointment | undefined> {
        const findAppointment = await this.ormRepository.findOne({
            where: {date: date, provider_id},
        })
        return findAppointment
    }

    public async create({ provider_id, user_id, date }: ICreateAppointmentDTO): Promise<Appointment> {
        const appointment = this.ormRepository.create({ provider_id, user_id, date} )

        await this.ormRepository.save(appointment)

        return appointment
    }

}

export default AppointmentsRepository
