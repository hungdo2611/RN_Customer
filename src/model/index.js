
import AsyncStorage from '@react-native-community/async-storage';

const constant_key = {
    USER_INFO: 'USER_INFO'
}

export let instanceData = {
    token: ''
}
export const setToken = (token) => {
    instanceData.token = token;
}
export const getToken = () => {
    return instanceData.token;
}
export const setLocalData = (data) => {
    AsyncStorage.setItem(constant_key, data)
}