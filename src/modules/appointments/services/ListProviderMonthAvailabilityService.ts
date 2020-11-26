import { inject, injectable } from 'tsyringe'
import IAppointmentsRepository from '../repositories/IAppointmentsRepository'
import { getDate, getDaysInMonth, isAfter } from 'date-fns'

interface Request {
    provider_id: string
    month: number
    year: number
}

type IResponse = Array<{ //interface de array
    day: number
    available: boolean
}>

@injectable()
class ListProviderMonthAvailabilityService {
    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository
    ) {}

    public async execute( {provider_id, year, month }:Request ): Promise<IResponse> {
       const appointments = await this.appointmentsRepository.findAllInMonthFromProvider({
           provider_id,
           year,
           month
       })



       const numberOfDaysInMonth = getDaysInMonth(new Date(year, month -1)) //pegar o dia do mes se tem 29, 30 e 31

       const eachDayArray = Array.from(
           { length: numberOfDaysInMonth },
           (_, index) => index + 1, //pois como o array começa em 0 e 0 n tem mes
       ) //criar um array do msm numero de dias obtidos

       const availability = eachDayArray.map(day => {
        const compareDate = new Date(year, month - 1, day, 23, 59, 59)

            const appointmentsInDay = appointments.filter(appointment => { //agendamentos de cada dia
                return getDate(appointment.date) === day;
            })
            return {
                 day,
                 available: isAfter( compareDate, new Date()) && appointmentsInDay.length < 10 //se tiver menos que 10 agendamentos, temos um horario disponivel nesse dia
               }                    //para validar se o dia ja passou
        }) //entrando em todos os dias do mes

        return availability
    }
}

export default ListProviderMonthAvailabilityService
