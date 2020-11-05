import { Router, request, response } from 'express'
import AppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository'
import { parseISO, } from 'date-fns'
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService'
import { celebrate, Segments, Joi } from 'celebrate'

import ensureAuthenticated from '@modules/users/middlewares/ensureAuthenticated'
import AppointmentsController from '../controllers/AppointmentsController'
import ProviderAppointmentController from '../controllers/ProviderAppointmentController'


const appointmentsRouter = Router()

const appointmentsController = new AppointmentsController()
const providerAppointmentController = new ProviderAppointmentController()

appointmentsRouter.use(ensureAuthenticated)


//appointmentsRouter.get('/', async (request, response )=> {
//    console.log(request.user)
//    const appointments = await appointmentsRepository.find() //função do type orm, retornando todos os dados
//    return response.json({appointments})
//})

appointmentsRouter.post('/', celebrate({
[Segments.BODY]: {
    provider_id: Joi.string().uuid().required(),
    date: Joi.date()
}
}), appointmentsController.create)

appointmentsRouter.get('/me', providerAppointmentController.index)


export default appointmentsRouter
