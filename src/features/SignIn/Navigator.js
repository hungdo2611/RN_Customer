
import { switchToFullHome } from '../NavigationController'
import { Navigation } from 'react-native-navigation';

export default {
    setRoot: () => {
        switchToFullHome()
    },
    showOTP: (phone, componentId, props) => Navigation.push(componentId, {
        component: {
            name: 'SignUp3Screen',
            options: {
                topBar: {
                    visible: true,
                    background: {
                        color: 'transparent',
                    },
                    backButton: { color: "white" },
                    drawBehind: true,
                    elevation: 0,
                }
            },
            passProps: {
                phone: phone,
                ...props
            }
        },
    }),
    showRegister: (componentId, props) => Navigation.push(componentId, {
        component: {
            name: 'SignUp2Screen',
            passProps: props,
            options: {
                topBar: {
                    visible: false,
                    height: 1

                }
            },
        },
    }),
    showLogin: (componentId) => Navigation.push(componentId, {
        component: {
            name: "Login1Screen",
            options: {
                topBar: {
                    visible: false
                }
            }
        }
    }),
}
