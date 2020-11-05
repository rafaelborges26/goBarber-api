import {MongoRepository, Between, Raw, ObjectIdColumn} from 'typeorm' //ter acesso as funções sql

import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository'
import ICreateNotification from '@modules/notifications/dtos/ICreateNotification'
import Notification from '../../infra/typeorm/schemas/Notification'
import { ObjectId } from 'mongodb'

class NotificationsRepository implements INotificationsRepository { //repository do typeorm

   private notifications: Notification[] = []

    public async create({ content, recipient_id,  }: ICreateNotification ): Promise<Notification> {
        const notification = new Notification()

        Object.assign(notification, { id: new ObjectId()  ,content, recipient_id })

        this.notifications.push(notification)

        return notification
    }

}

export default NotificationsRepository
