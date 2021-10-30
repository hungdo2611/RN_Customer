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
export const getBookingWithIdAPI = (_id) => {
    return api.makeAuthRequest({
        url: `/booking/state?_id=${_id}`,
        method: 'GET',
    })
}

export const finishBookingAPI = (booking_id) => {
    return api.makeAuthRequest({
        url: `/booking/finish/${booking_id}`,
        method: 'POST',
    })
}
export const getNearJourneyAPI = (page_number, page_size, body) => {
    return api.makeAuthRequest({
        url: `/booking/near/user?page_number=${page_number}&page_size=${page_size}`,
        method: 'POST',
        data: body
    })
}
export const getHistoryBookingAPI = (page_number, page_size, type) => {
    return api.makeAuthRequest({
        url: `/booking/history?page_nunmber=${page_number}&page_size=${page_size}&type=${type}`,
        method: 'GET',
    })
}