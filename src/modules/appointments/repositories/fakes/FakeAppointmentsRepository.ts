import Appointment from '../../infra/typeorm/entities/Appointment' //obter formato dos dados
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository'
import {uuid} from 'uuidv4'
import { isEqual, getMonth, getYear, getDate } from 'date-fns'

import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentsDTO'
import IFIndAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO'
import IFIndAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO'


class AppointmentsRepository implements IAppointmentsRepository { //repository do typeorm
   private appointments: Appointment[] = []


   public async findAllInDayFromProvider({ provider_id,year,day,month }:IFIndAllInDayFromProviderDTO) {

    const appointments = this.appointments.filter(appointment => {
        return (
            appointment.provider_id === provider_id &&
            getDate(appointment.date) === day && //+
            getMonth(appointment.date) + 1 === month && //+1 pq a lib começa com 0
            getYear(appointment.date) === year
        )
        })

            return appointments
   }

    public async findAllInMonthFromProvider({provider_id, month, year}: IFIndAllInMonthFromProviderDTO): Promise<Appointment[]> {

        const appointments = this.appointments.filter(appointment => {
        return (
            appointment.provider_id === provider_id &&
            getMonth(appointment.date) + 1 === month && //+1 pq a lib começa com 0
            getYear(appointment.date) === year
        )
        })

            return appointments
    }

    public async findAllIndAYFromProvider({provider_id, month, year}: IFIndAllInMonthFromProviderDTO): Promise<Appointment[]> {

        const appointments = this.appointments.filter(appointment => {
        return (
            appointment.provider_id === provider_id &&
            getMonth(appointment.date) + 1 === month && //+1 pq a lib começa com 0
            getYear(appointment.date) === year
        )
        })

            return appointments
    }

    public async findByDate(date: Date, provider_id: string): Promise<Appointment | undefined> {
        const findAppointment = this.appointments.find(appointment => isEqual(appointment.date, date) && appointment.provider_id === provider_id)

        return findAppointment
    }


    public async create({ provider_id ,date, user_id }: ICreateAppointmentDTO): Promise<Appointment> {
        const appointment = new Appointment()

        appointment.id = uuid()
        appointment.date = date
        appointment.provider_id = provider_id
        appointment.user_id = user_id

        this.appointments.push(appointment)

        return appointment
    }

}

export default AppointmentsRepository
