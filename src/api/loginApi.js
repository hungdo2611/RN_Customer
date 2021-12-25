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
// update ten  va pass luc vua dang ki
export const updateInfoAPI = (body) => {
    return api.makeAuthRequest({
        url: `/users/profile`,
        method: 'POST',
        data: body
    })
}

export const UpdateProfileAPI = (body) => {
    return api.makeAuthRequest({
        url: `/users/info`,
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
export const logOutAPI = () => {
    return api.makeAuthRequest({
        url: `/users/me/logout`,
        method: 'POST',
    })
}
export const loginByFaceBookAPI = (body) => {
    return api.makeAuthRequest({
        url: `/users/login/facebook`,
        method: 'POST',
        data: body
    })
}

export const registerWithFB = (body) => {
    return api.makeAuthRequest({
        url: `/users/register/facebook`,
        method: 'POST',
        data: body
    })
}

export const loginByAppleAPI = (body) => {
    return api.makeAuthRequest({
        url: `/users/login/apple`,
        method: 'POST',
        data: body
    })
}
export const registerWithAppleAPI = (body) => {
    return api.makeAuthRequest({
        url: `/users/register/apple`,
        method: 'POST',
        data: body
    })
}
