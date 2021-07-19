import { Navigation } from 'react-native-navigation';
import { Provider } from 'react-redux';

import React, { PureComponent } from 'react';
import store from './redux/store';


import LoginScreen from './features//SignIn/LoginScreen'
import EnterPhoneNumber from './features/SignIn/EnterPhoneNumber'
import OTPScreen from './features/SignIn/OTPScreen'
import EnterPass from './features/SignIn/EnterPass'
import EnterInfo from './features/SignIn/EnterInfo'
import ResetPass from './features/SignIn/ResetPass'
import HomeScreen from './features/HomeScreen/'
export const constant_name = {
    LOGIN_SCREEN: `Navigation.LoginScreen`,
    ENTER_PHONE_NUMBER: `Navigation.EnterPhoneNumber`,
    OTP_SCREEN: `Navigation.OTPScreen`,
    ENTER_PASS_SCREEN: `Navigation.ENTER.PASS`,
    ENTER_INFO: `Navigation.ENTER.INFO`,
    RESET_PASS: `Navigation.RESET.PASS`,
    HOME_SCREEN: `Navigation.HOME.SCREEN`
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
    Navigation.registerComponent(constant_name.ENTER_PASS_SCREEN, () => (props) =>
        <Provider store={store}>
            <EnterPass {...props} />
        </Provider>,
        () => EnterPass);
    Navigation.registerComponent(constant_name.ENTER_INFO, () => (props) =>
        <Provider store={store}>
            <EnterInfo {...props} />
        </Provider>,
        () => EnterInfo);
    Navigation.registerComponent(constant_name.RESET_PASS, () => (props) =>
        <Provider store={store}>
            <ResetPass {...props} />
        </Provider>,
        () => ResetPass);
    Navigation.registerComponent(constant_name.HOME_SCREEN, () => (props) =>
        <Provider store={store}>
            <HomeScreen {...props} />
        </Provider>,
        () => HomeScreen);
}