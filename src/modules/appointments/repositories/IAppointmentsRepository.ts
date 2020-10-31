import Appointment from "../infra/typeorm/entities/Appointment";
import ICreateAppointmentDTO from '../dtos/ICreateAppointmentsDTO'
import IFIndAllInMonthFromProviderDTO from '../dtos/IFIndAllInMonthFromProviderDTO'


export default interface IAppointmentsRepository {
    create(data: ICreateAppointmentDTO): Promise<Appointment>
    findByDate(date: Date): Promise<Appointment | undefined>
    findAllInMonthFromProvider(data:IFIndAllInMonthFromProviderDTO): Promise<Appointment[]>
}
