import Axios from 'axios'
import { Platform } from 'react-native'
import { getToken } from '../model'
const _makeRequest = createRequest => async args => {
    const _headers = args.headers ? args.headers : {}
    const body = args.body ? args.body : {}
    const defaultHeaders = {}
    args = {
        ...args,
        headers: {
            ...defaultHeaders,
            ..._headers,
        },
        body,
    }

    try {
        const { data } = await createRequest(args)
        return data
    } catch (e) {
        throw e
    }
}

const _makeAuthRequest = createRequest => async args => {
    const requestHeaders = args.headers ? args.headers : {}

    const token = getToken();
    let headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
    }

    args = {
        ...args,
        headers: {
            ...headers,
            ...requestHeaders,
        },
    }

    try {
        return await _makeRequest(createRequest)(args)
    } catch (e) {
        const { response } = e
        if (!response || !response.data) {
            throw e
        }

        if (response.status >= 400 && response.status <= 403) {
        }
    }
}

export default (options = {}) => {
    let BaseURL = Platform.OS == 'android' ? 'http://192.168.2.9:3000' : 'http://192.168.1.11:3000'
    // let BaseURL = 'http://localhost:3000'

    if (options.BaseURL)
        BaseURL = options.BaseURL

    //const baseUrlValidated = options.baseUrl || getEnv('baseAPIUrl')
    const instance = Axios.create({
        baseURL: BaseURL,
        //timeout: 30000,
    })

    return {
        makeRequest: _makeRequest(instance),
        makeAuthRequest: _makeAuthRequest(instance),
    }
}
