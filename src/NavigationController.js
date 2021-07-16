import { Navigation } from 'react-native-navigation';
import { constant_name } from './registerScreen'

export function pushToEnterPhoneNumberScreen(componentId) {
    Navigation.push(componentId, {
        component: {
            id: `${constant_name.ENTER_PHONE_NUMBER}_id`,
            name: constant_name.ENTER_PHONE_NUMBER,

            options: {
                topBar: {
                    animate: false,
                    visible: false,
                    height: 0,
                },
                bottomTabs: {
                    visible: false,
                },
            },
        },
    });
}
export function pushToOTPScreen(componentId, props) {
    Navigation.push(componentId, {
        component: {
            id: `${constant_name.OTP_SCREEN}_id`,
            name: constant_name.OTP_SCREEN,
            passProps: props,
            options: {
                topBar: {
                    animate: false,
                    visible: false,
                    height: 0,
                },
                bottomTabs: {
                    visible: false,
                },
            },
        },
    });
}