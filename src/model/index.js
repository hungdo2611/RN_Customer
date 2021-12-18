
import AsyncStorage from '@react-native-community/async-storage';
import notificationProcessor from '../notification'
import store from '../redux/store'
import actionsHome from '../features/HomeScreen/redux/actions'

const constant_key = {
    USER_INFO: 'USER_INFO',
    SHOW_HELP: 'SHOW_HELP',
}
const getPreData = async () => {

    store.dispatch(actionsHome.action.getCurrentBooking())
    AsyncStorage.getItem(constant_key.SHOW_HELP).then(value => {
        if (value) {
            console.log('value data async', value)
            instanceData.show_help = JSON.parse(value);
        }
    })

}
export const disable_help_coach = async (dt) => {
    AsyncStorage.setItem(constant_key.SHOW_HELP, JSON.stringify(dt));
    instanceData.show_help = dt
}

export let instanceData = {
    token: '',
    user_info: null,
    current_component_id: '',
    show_help: {
        coach: true,
        hybird: true,
        delivery: true
    },
    lst_banner: []
}
export const setToken = (token) => {
    instanceData.token = token;
}
export const getToken = () => {
    return instanceData.token;
}
export const updateLocalData = async (data) => {
    if (data) {
        store.dispatch(actionsHome.action.updateUserInfo(data))
    }
    await AsyncStorage.setItem(constant_key.USER_INFO, JSON.stringify(data))

}
export const setLocalData = async (data) => {
    if (data) {
        instanceData.user_info = JSON.parse(data);
        instanceData.token = JSON.parse(data).token;
        store.dispatch(actionsHome.action.updateUserInfo(JSON.parse(data)))

    }
    await AsyncStorage.setItem(constant_key.USER_INFO, data)
    getPreData();
    notificationProcessor.checkPermission();

}
export const deleteLocalData = async () => {
    await AsyncStorage.removeItem(constant_key.USER_INFO)

}
export const getLocalData = async () => {
    let data = await AsyncStorage.getItem(constant_key.USER_INFO);
    console.log("data123", data)
    if (data) {
        instanceData.user_info = JSON.parse(data);
        instanceData.token = JSON.parse(data).token;
        store.dispatch(actionsHome.action.updateUserInfo(JSON.parse(data)))

        getPreData();

    }
    notificationProcessor.checkTokenRefresh();

    return JSON.parse(data);
}