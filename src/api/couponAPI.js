import ApiService from './ApiService'

const api = ApiService()
export const getListCoupon = (page_nunmber, page_size) => {
    return api.makeAuthRequest({
        url: `/coupon?page_nunmber=${page_nunmber}&page_size=${page_size}`,
        method: 'GET',
    })
}