import {Entity, Column, PrimaryColumn, PrimaryGeneratedColumn} from 'typeorm'

interface appointmentConstructor {
    provider: string,
    date: Date
}

@Entity('appointments')
class Appointment {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    provider: string

    @Column('time with time zone')
    date: Date
}

export default Appointment
