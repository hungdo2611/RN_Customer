import Axios from 'axios'
const API_KEY = 'NhNOeG_8-1IEym3KD92F8YWohmMCbQ99NvEjgmeZzuc'


export const AutoCompleteAPI = async (text, lat, lng) => {
    let request = await Axios.get(`https://autocomplete.geocoder.ls.hereapi.com/6.2/suggest.json?apiKey=${API_KEY}&query=${text}&maxresults=10&&country=VNM&prox=${lat},${lng},500000&language=VI`);
    return request.data
}

export const getFromLocationId = async (location_id) => {
    let request = await Axios.get(`https://geocoder.ls.hereapi.com/6.2/geocode.json?locationid=${location_id}&jsonattributes=1&gen=9&apiKey=${API_KEY}`);
    return request.data
}
export const getAdressFromLatLng = async (lat, lng) => {
    let request = await Axios.get(`https://revgeocode.search.hereapi.com/v1/revgeocode?at=${lat},${lng}&lang=en-US&apiKey=${API_KEY}`);
    return request.data
}
export const getRouteBetween2Point = async (lstPoint) => {
    let param = ''
    lstPoint.map((vl, index) => {
        if (lstPoint.length == 3 && index == 1) {
            param = param + `&waypoint${index}=passThrough!${vl.lat},${vl.lng}`
        } else {
            param = param + `&waypoint${index}=geo!${vl.lat},${vl.lng}`
        }

    })
    console.log("param", param)
    let request = await Axios.get(`https://route.ls.hereapi.com/routing/7.2/calculateroute.json?${param}&mode=fastest;car;traffic:disabled&apiKey=${API_KEY}`);
    return request.data
}