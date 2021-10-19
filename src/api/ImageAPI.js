import Axios from 'axios'

const url = `http://192.168.1.3:4999`
export const UploadImageApi = async (formdata) => {
    let request = await Axios.post(`${url}/upload/single`, formdata, { headers: { 'Content-Type': 'multipart/form-data' } });
    return request.data
}

export const UploadMultipleImageApi = async (formdata) => {
    try {
        let request = await Axios.post(`${url}/upload/multiple`, formdata, { headers: { 'Content-Type': 'multipart/form-data' } });
        return request.data
    } catch (err) {
        console.log('err api', err)
    }

}