import { Navigation } from 'react-native-navigation';
import { Provider } from 'react-redux';
import Login1Screen from './features//SignIn/LoginScreen'
import React, { PureComponent } from 'react';
import store from './redux/store';

export const constant_name = {
    LOGIN_SCREEN: `Navigation.LoginScreen`
}

export const registerScreens = () => {

    Navigation.registerComponent(constant_name.LOGIN_SCREEN, () => (props) =>
        <Provider store={store}>
            <Login1Screen {...props} />
        </Provider>,
        () => Login1Screen)


}