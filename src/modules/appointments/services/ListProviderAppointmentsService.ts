import { inject, injectable } from 'tsyringe'
import IAppointmentsRepository from '../repositories/IAppointmentsRepository'
import Appointment from '../infra/typeorm/entities/Appointment'
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider'

interface Request {
    provider_id: string
    day: number
    month: number
    year: number
}

@injectable()
class ListProviderAppointmentsService {
    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository,

        @inject('CacheProvider')
        private cacheProvider: ICacheProvider
    ) {}

    public async execute( {provider_id, year, month, day }:Request ): Promise<Appointment[]> {

        //list redis
        const cacheData = await this.cacheProvider.recover('ooi')

        console.log(cacheData)

        const appointments = await this.appointmentsRepository.findAllInDayFromProvider({
            provider_id,
            year,
            month,
            day
        })

        //await this.cacheProvider.save('ooi', 'ooi')

        return appointments
    }

}

export default ListProviderAppointmentsService
