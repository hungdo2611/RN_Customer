import ApiService from './ApiService'


const api = ApiService()
export const checkPhoneExist = (phone) => {
    return api.makeRequest({
        url: `/users/exist/${phone}`,
        method: 'GET',
    })
}
export const registerAPI = (body) => {
    return api.makeRequest({
        url: `/users/register`,
        method: 'POST',
        data: body
    })
}
export const loginAPI = (body) => {
    return api.makeRequest({
        url: `/users/login`,
        method: 'POST',
        data: body
    })
}
export const updateInfoAPI = (body) => {
    return api.makeAuthRequest({
        url: `/users/profile`,
        method: 'POST',
        data: body
    })
}
export const registerDeviceToken = (device_token) => {
    return api.makeAuthRequest({
        url: `/users/register/devicetoken`,
        method: 'POST',
        data: { device_token: device_token }
    })
}

export const resetPassAPI = (body) => {
    return api.makeRequest({
        url: `/users/reset/password`,
        method: 'POST',
        data: body
    })
}
