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
import BookingScreen from './features/BookingScreen'
import BookingHybirdScreen from './features/BookingHybirdScreen'
import DeliveryScreen from './features/DeliveryScreen'
import HomeScreen from './features/HomeScreen'
import MenuScreen from './features/MenuScreen'
import HistoryScreen from './features/HistoryScreen'
import OrderInfoScreen from './features/HistoryScreen/infoOrderScreen'
import EditInfoScreen from './features/EditInfoScreen'
import CouponScreen from './features/CouponScreen'
import InfoDriverScreen from './features/InfoDriver'
import NotiScreen from './features/NotificationScreen'
export const constant_name = {
    LOGIN_SCREEN: `Navigation.LoginScreen`,
    ENTER_PHONE_NUMBER: `Navigation.EnterPhoneNumber`,
    OTP_SCREEN: `Navigation.OTPScreen`,
    ENTER_PASS_SCREEN: `Navigation.ENTER.PASS`,
    ENTER_INFO: `Navigation.ENTER.INFO`,
    RESET_PASS: `Navigation.RESET.PASS`,
    HOME_SCREEN: `Navigation.HOME.SCREEN`,
    BOOKING_SCREEN: `Navigation.BOOKING.SCREEN`,
    BOOKING_HYBIRD_SCREEN: `Navigation.BOOKING.HYBIRD`,
    DELIVERY_SCREEN: `Navigation.DELIVERY_SCREEN`,
    MENU_SCREEN: `Navigation.MENU_SCREEN`,
    HISTORY_SCREEN: `Navigation.HISTORY_SCREEN`,
    ORDER_INFO_SCREEN: `Navigation.ORDER_INFO_SCREEN`,
    EDIT_INFO_SCREEN: `Navigation.EDIT_INFO_SCREEN`,
    COUPON_SCREEN: `Navigation.COUPON_SCREEN`,
    INFO_DRIVER_SCREEN: `Navigation.INFO_DRIVER_SCREEN`,
    NOTIFICATION_SCREEN: `Navigation.NOTIFICATION_SCREEN`
}

export const registerScreens = () => {
    Navigation.registerComponent(constant_name.NOTIFICATION_SCREEN, () => (props) =>
        <Provider store={store}>
            <NotiScreen {...props} />
        </Provider>,
        () => NotiScreen);
    Navigation.registerComponent(constant_name.INFO_DRIVER_SCREEN, () => (props) =>
        <Provider store={store}>
            <InfoDriverScreen {...props} />
        </Provider>,
        () => InfoDriverScreen);
    Navigation.registerComponent(constant_name.COUPON_SCREEN, () => (props) =>
        <Provider store={store}>
            <CouponScreen {...props} />
        </Provider>,
        () => CouponScreen);
    Navigation.registerComponent(constant_name.EDIT_INFO_SCREEN, () => (props) =>
        <Provider store={store}>
            <EditInfoScreen {...props} />
        </Provider>,
        () => EditInfoScreen);
    Navigation.registerComponent(constant_name.ORDER_INFO_SCREEN, () => (props) =>
        <Provider store={store}>
            <OrderInfoScreen {...props} />
        </Provider>,
        () => OrderInfoScreen);
    Navigation.registerComponent(constant_name.HISTORY_SCREEN, () => (props) =>
        <Provider store={store}>
            <HistoryScreen {...props} />
        </Provider>,
        () => HistoryScreen);
    Navigation.registerComponent(constant_name.MENU_SCREEN, () => (props) =>
        <Provider store={store}>
            <MenuScreen {...props} />
        </Provider>,
        () => MenuScreen);
    Navigation.registerComponent(constant_name.DELIVERY_SCREEN, () => (props) =>
        <Provider store={store}>
            <DeliveryScreen {...props} />
        </Provider>,
        () => DeliveryScreen);
    Navigation.registerComponent(constant_name.BOOKING_HYBIRD_SCREEN, () => (props) =>
        <Provider store={store}>
            <BookingHybirdScreen {...props} />
        </Provider>,
        () => BookingHybirdScreen);
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
    Navigation.registerComponent(constant_name.BOOKING_SCREEN, () => (props) =>
        <Provider store={store}>
            <BookingScreen {...props} />
        </Provider>,
        () => BookingScreen);
}