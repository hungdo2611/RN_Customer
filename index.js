import { registerScreens, constant_name } from './src/registerScreen'
import { Navigation } from 'react-native-navigation';
import React, { PureComponent } from 'react';

registerScreens();

Navigation.events().registerAppLaunchedListener(async () => {
    Navigation.setRoot({
        root: {
            component: {
                name: constant_name.LOGIN_SCREEN,
            },
        },
    });
});
