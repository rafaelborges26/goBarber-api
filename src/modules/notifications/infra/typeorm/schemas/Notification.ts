import { ObjectID, Entity, Column, CreateDateColumn, UpdateDateColumn, ObjectIdColumn  } from 'typeorm'

@Entity('notifications')
class Notification {
    @ObjectIdColumn()
    id: ObjectID

    @Column()
    content: string

    @Column('uuid')
    recipient_id: string //unico relacionamento (pra qm iremos enviar a notification)

    @Column({ default: false })
    read: boolean

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date

}

export default Notification
