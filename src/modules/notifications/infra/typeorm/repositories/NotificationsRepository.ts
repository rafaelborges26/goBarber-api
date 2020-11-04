import {getMongoRepository, MongoRepository, Between, Raw} from 'typeorm' //ter acesso as funções sql

import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository'
import ICreateNotification from '@modules/notifications/dtos/ICreateNotification'
import Notification from '../schemas/Notification'

class NotificationsRepository implements INotificationsRepository { //repository do typeorm
   private ormRepository: MongoRepository<Notification>;
    constructor() {
        this.ormRepository = getMongoRepository(Notification, 'mongo') //cria o repositorio
    }


    public async create({ content, recipient_id,  }: ICreateNotification ): Promise<Notification> {
        const notification = this.ormRepository.create({ content, recipient_id } )

        await this.ormRepository.save(notification)

        return notification
    }

}

export default NotificationsRepository
