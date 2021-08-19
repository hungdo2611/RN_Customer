import { registerScreens, constant_name } from './src/registerScreen'
import { Navigation } from 'react-native-navigation';
import React, { PureComponent } from 'react';
import { getLocalData } from './src/model'
import { setRootToLogin, setRootToHome } from './src/NavigationController'
import 'react-native-gesture-handler';

registerScreens();
Navigation.setDefaultOptions({
    statusBar: {
        drawBehind: true,
        style: 'dark',
        backgroundColor: 'rgba(0,0,0,0)'

    },
    animations: {
        push: {
            enabled: 'true',
            content: {
                x: {
                    from: 2000,
                    to: 0,
                    duration: 800,
                    interpolation: "accelerate",
                    startDelay: 0,

                },
            },
        },
        pop: {
            enabled: 'true',
            content: {
                x: {
                    from: 0,
                    to: 2000,
                    duration: 800,
                    interpolation: "accelerate",
                    startDelay: 0,

                },
            },
        },
    },
});
Navigation.events().registerAppLaunchedListener(async () => {
    let data = await getLocalData();
    if (data) {
        setRootToHome();
    } else {
        setRootToLogin();
    }
});
// notificationProcessor.checkPermission();
