import ApiService from './ApiService'


const api = ApiService()


export const getListBanner = () => {
    return api.makeAuthRequest({
        url: `/user/banner`,
        method: 'GET',
    })
}





