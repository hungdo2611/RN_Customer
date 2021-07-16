import { Navigation } from 'react-native-navigation';
import { Provider } from 'react-redux';

import React, { PureComponent } from 'react';
import store from './redux/store';


import LoginScreen from './features//SignIn/LoginScreen'
import EnterPhoneNumber from './features/SignIn/EnterPhoneNumber'
import OTPScreen from './features/SignIn/OTPScreen'

export const constant_name = {
    LOGIN_SCREEN: `Navigation.LoginScreen`,
    ENTER_PHONE_NUMBER: `Navigation.EnterPhoneNumber`,
    OTP_SCREEN: `Navigation.OTPScreen`
}

export const registerScreens = () => {

    Navigation.registerComponent(constant_name.LOGIN_SCREEN, () => (props) =>
        <Provider store={store}>
            <LoginScreen {...props} />
        </Provider>,
        () => LoginScreen);

    Navigation.registerComponent(constant_name.ENTER_PHONE_NUMBER, () => (props) =>
        <Provider store={store}>
            <EnterPhoneNumber {...props} />
        </Provider>,
        () => EnterPhoneNumber);
    Navigation.registerComponent(constant_name.OTP_SCREEN, () => (props) =>
        <Provider store={store}>
            <OTPScreen {...props} />
        </Provider>,
        () => OTPScreen);

}