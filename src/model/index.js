
import AsyncStorage from '@react-native-community/async-storage';
import notificationProcessor from '../notification'

const constant_key = {
    USER_INFO: 'USER_INFO'
}

export let instanceData = {
    token: '',
    user_info: null
}
export const setToken = (token) => {
    instanceData.token = token;
}
export const getToken = () => {
    return instanceData.token;
}
export const setLocalData = async (data) => {
    notificationProcessor.checkPermission();
    if (data) {
        instanceData.user_info = JSON.parse(data);
        instanceData.token = JSON.parse(data).token;
    }
    await AsyncStorage.setItem(constant_key.USER_INFO, data)
}
export const getLocalData = async () => {
    notificationProcessor.checkTokenRefresh();
    let data = await AsyncStorage.getItem(constant_key.USER_INFO);
    console.log("data123", data)
    if (data) {
        instanceData.user_info = JSON.parse(data);
        instanceData.token = JSON.parse(data).token;

    }
    return JSON.parse(data);
}