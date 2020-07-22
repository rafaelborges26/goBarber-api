import {uuid} from 'uuidv4'

interface appointmentConstructor {
    provider: string,
    date: Date
}

class Appointment {
    id: string

    provider: string

    date: Date

    constructor({ provider, date }:Omit<Appointment, 'id'>) { //Omit é pra ignorar o id no construtor
        this.id = uuid()
        this.provider = provider
        this.date = date
    }
}

export default Appointment
