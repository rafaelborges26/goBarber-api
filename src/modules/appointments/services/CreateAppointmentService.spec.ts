import AppError from '@shared/errors/AppError'

import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository'
import CreateAppointmentService from './CreateAppointmentService'
import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository'
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider'

let fakeAppointmentsRepository: FakeAppointmentsRepository
let fakeNotificationsRepository: FakeNotificationsRepository
let fakeCacheProvider: FakeCacheProvider
let createAppointmentService: CreateAppointmentService

describe('CreateAppointment', () => {
    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository()
        fakeNotificationsRepository = new FakeNotificationsRepository()
        fakeCacheProvider = new FakeCacheProvider()
        createAppointmentService = new CreateAppointmentService(fakeAppointmentsRepository, fakeNotificationsRepository, fakeCacheProvider)
    })

    it('should be able to create a new appointment', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 12).getTime() //retornando uma nova data
        })


        const appointment = await createAppointmentService.execute({
            date: new Date(2020, 4, 10, 13),
            user_id: 'user-id',
            provider_id: 'provider-id'
        })

        expect(appointment).toHaveProperty('id')
        expect(appointment.provider_id).toBe('provider-id')
    })

    it('should not be able to create two appointments on the same date', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 12).getTime() //retornando uma nova data
        })

        const appointmentDate = new Date(2020, 4, 10, 13)

        await createAppointmentService.execute({
            date: appointmentDate,
            user_id: 'user-id',
            provider_id: 'provider-id'
        })

        await expect(createAppointmentService.execute({
            date: appointmentDate,
            user_id: 'user-id',
            provider_id: 'provider-id'
        })).rejects.toBeInstanceOf(AppError) //rejeição, ou seja de erro e q seja uma instancia da classe erro.

    })

    it('should not be able to create an appointment on a past date', async () => {
       jest.spyOn(Date, 'now').mockImplementationOnce(() => {
           return new Date(2020, 4, 10, 12).getTime() //retornando uma nova data
       })

       await expect(createAppointmentService.execute({
        date: new Date(2020, 4, 10, 11), //uma hora atras
        user_id: '123123456',
        provider_id: '123123456'
    })).rejects.toBeInstanceOf(AppError) //rejeição, ou seja de erro e q seja uma instancia da classe erro.


    } )

    it('should not be able to create an appointment with same user as provider', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 12).getTime() //retornando uma nova data
        })

        await expect(createAppointmentService.execute({
         date: new Date(2020, 4, 10, 13), //uma hora atras
         user_id: 'user_id',
         provider_id: 'user_id'
     })).rejects.toBeInstanceOf(AppError) //rejeição, ou seja de erro e q seja uma instancia da classe erro.


     } )

     it('should not be able to create an appointment before 8am and after 5pm', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 12).getTime() //retornando uma nova data
        })

    await expect(createAppointmentService.execute({
         date: new Date(2020, 4, 11, 7), //uma hora atras
         user_id: 'user_id',
         provider_id: 'provider_id'
     })).rejects.toBeInstanceOf(AppError) //rejeição, ou seja de erro e q seja uma instancia da classe erro.


     await expect(createAppointmentService.execute({
        date: new Date(2020, 4, 11, 18), //uma hora atras
        user_id: 'user_id',
        provider_id: 'provider_id'
    })).rejects.toBeInstanceOf(AppError)


     } )

})
