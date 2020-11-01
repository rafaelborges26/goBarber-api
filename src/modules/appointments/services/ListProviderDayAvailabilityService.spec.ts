import AppError from '@shared/errors/AppError'

import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository'
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'
import ListProviderDayAvailabilityService from './ListProviderDayAvailabilityService'

    let listProviderDayAvailability: ListProviderDayAvailabilityService
    let fakeAppointmentsRepository: FakeAppointmentsRepository


describe('ListProviderMonthAvailability', () => {

    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository()
        listProviderDayAvailability = new ListProviderDayAvailabilityService(fakeAppointmentsRepository)

    })

    it('should be able to list the day availability from provider', async () => {

        await fakeAppointmentsRepository.create({
            provider_id: 'userId',
            user_id: 'user',
            date: new Date(2020, 4, 20, 14, 0, 0)
        })

        await fakeAppointmentsRepository.create({
            provider_id: 'userId',
            user_id: 'user',
            date: new Date(2020, 4, 20, 15, 0, 0)
        })

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 20, 11).getTime() //setando, o now (fingindo que estmaos no dia 20/4/2020)
        })

        const availability = await listProviderDayAvailability.execute({
            provider_id: 'userId',
            year: 2020,
            month: 5,
            day: 20
        })

         expect(availability).toEqual(expect.arrayContaining([
            {hour: 8, available: false},
            {hour: 9, available: false},
            {hour: 10, available: false},
            {hour: 11, available: false},
            {hour: 13, available: true},
            {hour: 14, available: false},
            {hour: 15, available: false},
            {hour: 16, available: true},
        ])) //estamos falando q para o teste passar tem q ser igual esse objeto

    })

})
