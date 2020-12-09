import { inject, injectable } from 'tsyringe'
import { classToClass } from 'class-transformer'
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

        const cacheKey = `provider-appointments:${provider_id}:${year}-${month}-${day}`

        //list redis
        let appointments = await this.cacheProvider.recover<Appointment[]>(cacheKey)

        //let appointments (para tirar o cache ativa essa linha e comenta a de cima)

        if(!appointments) {
            appointments = await this.appointmentsRepository.findAllInDayFromProvider({
                provider_id,
                year,
                month,
                day
            })

            await this.cacheProvider.save(cacheKey, classToClass(appointments)) //salvar no cache os campos setados no classTOClass
        }



        return appointments
    }

}

export default ListProviderAppointmentsService
