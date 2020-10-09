import {Entity, Column, PrimaryColumn, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn} from 'typeorm'

interface appointmentConstructor {
    provider: string,
    date: Date
}

import User from '../../users/entities/users'



@Entity('appointments')
class Appointment {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    provider_id: string

    @ManyToOne(() => User)
    @JoinColumn({name : 'provider_id'})
    provider: User

    @Column('time with time zone')
    date: Date

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date
}

export default Appointment
