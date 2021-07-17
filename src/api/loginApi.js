import ApiService from './ApiService'


const api = ApiService()
export const checkPhoneExist = (phone) => {
    return apiAuthen.makeRequest({
        url: `/users/exist/${phone}`,
        method: 'GET',
    })
}
export const registerAPI = (body) => {
    return apiAuthen.makeRequest({
        url: `/users/exist/${phone}`,
        method: 'POST',
        data: body
    })
}