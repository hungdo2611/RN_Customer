import ApiService from './ApiService'

const api = ApiService()
export const getListCoupon = () => {
    return api.makeAuthRequest({
        url: `/coupon`,
        method: 'GET',
    })
}