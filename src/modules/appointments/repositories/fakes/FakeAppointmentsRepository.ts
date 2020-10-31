import Appointment from '../../infra/typeorm/entities/Appointment' //obter formato dos dados
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository'
import {uuid} from 'uuidv4'
import { isEqual, getMonth, getYear } from 'date-fns'

import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentsDTO'
import IFIndAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFIndAllInMonthFromProviderDTO'


class AppointmentsRepository implements IAppointmentsRepository { //repository do typeorm
   private appointments: Appointment[] = []

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


    public async findByDate(date: Date): Promise<Appointment | undefined> {
        const findAppointment = this.appointments.find(appointment => isEqual(appointment.date, date))

        return findAppointment
    }


    public async create({ provider_id ,date }: ICreateAppointmentDTO): Promise<Appointment> {
        const appointment = new Appointment()

        appointment.id = uuid()
        appointment.date = date
        appointment.provider_id = provider_id

        this.appointments.push(appointment)

        return appointment
    }

}

export default AppointmentsRepository
