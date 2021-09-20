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
export const getListDriverDeliveryAPI = (body) => {

    return api.makeAuthRequest({
        url: `/booking/finding/driver_delivery`,
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

export const getCurrentBookingAPI = () => {
    return api.makeAuthRequest({
        url: `/booking/current`,
        method: 'GET',
    })
}
export const finishBookingAPI = (booking_id) => {
    return api.makeAuthRequest({
        url: `/booking/finish/${booking_id}`,
        method: 'POST',
    })
}
