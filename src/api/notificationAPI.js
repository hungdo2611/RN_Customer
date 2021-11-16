import ApiService from './ApiService'

const api = ApiService()
export const getListNotification = () => {
    return api.makeAuthRequest({
        url: `/customer/notification`,
        method: 'GET',
    })
}