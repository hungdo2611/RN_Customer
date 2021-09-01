
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
    if (data) {
        instanceData.user_info = JSON.parse(data);
        instanceData.token = JSON.parse(data).token;
    }
    await AsyncStorage.setItem(constant_key.USER_INFO, data)
    notificationProcessor.checkPermission();

}
export const getLocalData = async () => {
    let data = await AsyncStorage.getItem(constant_key.USER_INFO);
    console.log("data123", data)
    if (data) {
        instanceData.user_info = JSON.parse(data);
        instanceData.token = JSON.parse(data).token;

    }
    notificationProcessor.checkTokenRefresh();

    return JSON.parse(data);
}