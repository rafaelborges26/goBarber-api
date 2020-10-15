import { Router, request, response } from 'express'
import AppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository'
import { parseISO, } from 'date-fns'
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService'

import ensureAuthenticated from '@modules/users/middlewares/ensureAuthenticated'
import AppointmentsController from '../controllers/AppointmentsController'

const appointmentsRouter = Router()

const appointmentsController = new AppointmentsController()

appointmentsRouter.use(ensureAuthenticated)


//appointmentsRouter.get('/', async (request, response )=> {
//    console.log(request.user)
//    const appointments = await appointmentsRepository.find() //função do type orm, retornando todos os dados
//    return response.json({appointments})
//})

appointmentsRouter.post('/', appointmentsController.create)



export default appointmentsRouter
