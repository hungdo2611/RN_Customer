import Axios from 'axios'
const API_KEY = 'NhNOeG_8-1IEym3KD92F8YWohmMCbQ99NvEjgmeZzuc'
export const AutoCompleteAPI = async (text, lat, lng) => {
    let request = await Axios.get(`https://autocomplete.geocoder.ls.hereapi.com/6.2/suggest.json?apiKey=${API_KEY}&query=${text}&maxresults=10&&country=VNM&prox=${lat},${lng}`)
    return request.data
}