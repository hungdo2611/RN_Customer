import ApiService from './ApiService'


const api = ApiService()
export const createBookingAPI = (body) => {

    return api.makeAuthRequest({
        url: `/booking/create`,
        method: 'POST',
        data: body
    })
}
export const getListDriverAPI = (body) => {

    return api.makeAuthRequest({
        url: `/booking/finding/driver`,
        method: 'POST',
        data: body
    })
}
export const cancelBookingAPI = (body) => {
    return api.makeAuthRequest({
        url: `/booking/cancel`,
        method: 'POST',
        data: body
    })
}

