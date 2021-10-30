import ApiService from './ApiService'

const api = ApiService()
export const getListCoupon = () => {
    return api.makeAuthRequest({
        url: `/coupon`,
        method: 'GET',
    })
}
export const getDetailCoupon = (code) => {
    return api.makeAuthRequest({
        url: `/coupon/customer/detail?code=${code}`,
        method: 'GET',
    })
}
