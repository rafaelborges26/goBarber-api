import { Router, request, response } from 'express'

import ensureAuthenticated from '@modules/users/middlewares/ensureAuthenticated'
import ProvidersController from '../controllers/ProvidersController'

const providersRouter = Router()

const providersController = new ProvidersController()

providersRouter.use(ensureAuthenticated)


//appointmentsRouter.get('/', async (request, response )=> {
//    console.log(request.user)
//    const appointments = await appointmentsRepository.find() //função do type orm, retornando todos os dados
//    return response.json({appointments})
//})

providersRouter.get('/', providersController.index)



export default providersRouter
