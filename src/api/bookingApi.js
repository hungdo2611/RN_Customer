import ApiService from './ApiService'


const api = ApiService()
export const getListDriverAPI = (body) => {
    // const body_booking = {
    //     from: {
    //         "loc": {
    //             "type": "Point",
    //             "coordinates": [105.78012826505697, 21.153397515851392]
    //         },
    //     },
    //     to: {
    //         "loc": {
    //             "type": "Point",
    //             "coordinates": [105.61272817310709, 21.306707419857357]
    //         },
    //     },


    // };

    return api.makeAuthRequest({
        url: `/booking/finding/driver`,
        method: 'POST',
        data: body
    })
}

