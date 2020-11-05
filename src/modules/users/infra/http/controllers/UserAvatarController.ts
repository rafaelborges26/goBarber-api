import {Request, Response} from 'express'
import { container } from 'tsyringe'
import { classToClass } from 'class-transformer'

import UpdateUserAvatar from '@modules/users/services/UpdateUserAvatarService'

export default class UserAvatarController {

    public async update(request: Request, response: Response) {

        const updateUserAvatar = container.resolve(UpdateUserAvatar)

        const user = await updateUserAvatar.execute({
            user_id:request.user.id,
            avatarFilename: request.file.filename
        })

        return response.json(classToClass(user))
    }
}
