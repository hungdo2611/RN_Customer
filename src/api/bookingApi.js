import ApiService from './ApiService'


const api = ApiService()
export const getListDriverAPI = (body) => {
    const body_booking = {
        cus_id: 2,
        from: {
            "loc": {
                "type": "Point",
                "coordinates": [105.78012826505697, 21.153397515851392]
            },
            address: "Pham van dong",
        },
        to: {
            "loc": {
                "type": "Point",
                "coordinates": [105.61272817310709, 21.306707419857357]
            },
            address: "Quảng trường HCM",
        },
        distance: 36300,
        status: 'FINDING',

    };

    return api.makeAuthRequest({
        url: `/booking/create`,
        method: 'POST',
        data: body_booking
    })
}

