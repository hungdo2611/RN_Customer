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
export function pushToEnterPass(componentId, props) {
    Navigation.push(componentId, {
        component: {
            id: `${constant_name.ENTER_PASS_SCREEN}_id`,
            name: constant_name.ENTER_PASS_SCREEN,
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
export function pushToResetPass(componentId, props) {
    Navigation.push(componentId, {
        component: {
            id: `${constant_name.RESET_PASS}_id`,
            name: constant_name.RESET_PASS,
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
export function pushToEnterInfo(componentId, props) {
    Navigation.push(componentId, {
        component: {
            id: `${constant_name.ENTER_INFO}_id`,
            name: constant_name.ENTER_INFO,
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
export function pushToBookingScreen(componentId, props) {
    Navigation.push(componentId, {
        component: {
            id: `${constant_name.BOOKING_SCREEN}_id`,
            name: constant_name.BOOKING_SCREEN,
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
export function pushToBookingHybirdScreen(componentId, props) {
    Navigation.push(componentId, {
        component: {
            id: `${constant_name.BOOKING_HYBIRD_SCREEN}_id`,
            name: constant_name.BOOKING_HYBIRD_SCREEN,
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
export function pushToMenuScreen(componentId, props) {
    Navigation.push(componentId, {
        component: {
            id: `${constant_name.MENU_SCREEN}_id`,
            name: constant_name.MENU_SCREEN,
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
export function pushToDeliveryScreen(componentId, props) {
    Navigation.push(componentId, {
        component: {
            id: `${constant_name.DELIVERY_SCREEN}_id`,
            name: constant_name.DELIVERY_SCREEN,
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
export function pushToOrderInfoScreen(componentId, props) {
    Navigation.push(componentId, {
        component: {
            id: `${constant_name.ORDER_INFO_SCREEN}_id`,
            name: constant_name.ORDER_INFO_SCREEN,
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
export function pushToCouponScreen(componentId, props) {
    Navigation.push(componentId, {
        component: {
            id: `${constant_name.COUPON_SCREEN}_id`,
            name: constant_name.COUPON_SCREEN,
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
export function showModalDriverInfo(props) {
    Navigation.showModal({
        stack: {
            children: [
                {
                    component: {
                        id: `${constant_name.INFO_DRIVER_SCREEN}_id`,
                        name: constant_name.INFO_DRIVER_SCREEN,
                        passProps: props,
                        options: {
                            modal: {
                                swipeToDismiss: false
                            },
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
                },
            ],
        },
    });
}
export function pushToEditInfoScreen(componentId, props) {
    Navigation.push(componentId, {
        component: {
            id: `${constant_name.EDIT_INFO_SCREEN}_id`,
            name: constant_name.EDIT_INFO_SCREEN,
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
export function pushToHistoryScreen(componentId, props) {
    Navigation.push(componentId, {
        component: {
            id: `${constant_name.HISTORY_SCREEN}_id`,
            name: constant_name.HISTORY_SCREEN,
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
export function setRootToHome() {
    Navigation.setRoot({
        root: {
            stack: {
                children: [
                    {
                        component: {
                            name: constant_name.HOME_SCREEN,
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
}
export function setRootToLogin() {
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
}

