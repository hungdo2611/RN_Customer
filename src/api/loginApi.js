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