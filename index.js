import { registerScreens, constant_name } from './src/registerScreen'
import { Navigation } from 'react-native-navigation';
import React, { PureComponent } from 'react';

registerScreens();
Navigation.setDefaultOptions({
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
    Navigation.setRoot({
        root: {
            stack: {
                children: [
                    {
                        component: {
                            name: constant_name.LOGIN_SCREEN,
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
                    }
                ]
            }
        }
    });
});
