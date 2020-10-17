import Appointment from '../../infra/typeorm/entities/Appointment' //obter formato dos dados
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository'
import {uuid} from 'uuidv4'

import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentsDTO'

class AppointmentsRepository implements IAppointmentsRepository { //repository do typeorm
   private appointments: Appointment[] = []

    public async findByDate(date: Date): Promise<Appointment | undefined> {
        const findAppointment = this.appointments.find(appointment => appointment.date === date)

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
