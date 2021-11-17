import { Alert, Platform } from 'react-native'
import messaging from '@react-native-firebase/messaging';
import { instanceData } from '../model'
import { registerDeviceToken } from '../api/loginApi'
import PushNotification, { Importance } from 'react-native-push-notification';
import handleNoti from './handleNoti'
import { Navigation } from "react-native-navigation";
import store from '../redux/store'
import actionsBooking from '../features/BookingScreen/redux/actions'
import { constant_type_notify } from './handleNoti'
import AsyncStorage from '@react-native-community/async-storage';
import { KEY_ASYNC_NOTI } from '../constant'
import { homeInstance } from '../features/HomeScreen/MainView'
import notifee from '@notifee/react-native';

class NotificationProcessor {
    async checkTokenRefresh() {
        messaging().onTokenRefresh(token => {
            console.log("refreshToken", token)
            this.getToken();
        });
    }
    async checkPermission() {
        const authStatus = await messaging().hasPermission();
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;
        console.log('enabled', enabled)
        if (enabled) {
            this.getToken();
        } else {
            this.requestPermission();
        }
    }
    async requestPermission() {
        try {
            await messaging().requestPermission();
            // User has authorised
            await this.getToken();
        } catch (error) {
            // User has rejected permissions
            Alert.alert(
                'Ứng dụng cần quyền gửi thông báo',
                'Ứng dụng cần quyền gửi thông báo để cập nhật thông tin mới nhất cho bạn',
                [
                    {
                        text: 'Không',

                        onPress: () => console.log('Permission denied'),
                        style: 'cancel',
                    },

                    {
                        text: 'Cài đặt',
                        onPress: Permissions.openSettings,
                    },
                ],
            );
            console.log('permission rejected');
        }
    }
    async getToken() {
        const deviceToken = await messaging().getToken();
        console.log('deviceToken', deviceToken)

        // register topic
        // subscribe topic phải có /topic rồi / tên topic , kể cả api cũng vậy , để tránh lỗi InvalidRegistration
        messaging().subscribeToTopic("Customer");
        const req = await registerDeviceToken(deviceToken);
        console.log('register device token', req)
        //
        this.device_token = deviceToken;

    }
    createDefaultChannels() {
        PushNotification.createChannel(
            {
                channelId: "HD_Notification", // (required)
                channelName: "Tài xế Thông báo", // (required)
                channelDescription: "Kênh thông báo dành cho ứng dụng của tài xế, nhà xe", // (optional) default: undefined.
                playSound: true, // (optional) default: true
                soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
                importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
                vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
            },
            (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
        );

    }
    async createNotificationListeners() {
        PushNotification.configure({
            // handle foreground notification
            onNotification: function (notification) {
                console.log("NOTIFICATION:", notification.data);
                handleNoti(notification.data)
            },

            // IOS ONLY (optional): default: all - Permissions to register.
            permissions: {
                alert: true,
                badge: true,
                sound: true
            },

            // Should the initial notification be popped automatically
            // default: true
            popInitialNotification: true,

            /**
             * (optional) default: true
             * - Specified if permissions (ios) and token (android and ios) will requested or not,
             * - if not, you must call PushNotificationsHandler.requestPermissions() later
             */
            requestPermissions: true
        });
        messaging().onMessage(async remoteMessage => {
            console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
            if (remoteMessage.data.type == constant_type_notify.DRIVER_ACEEPT_BOOKING) {
                store.dispatch(actionsBooking.action.getCurrentBooking())
            }

            PushNotification.localNotification({
                message: remoteMessage.notification.body,
                title: remoteMessage.notification.title,
                channelId: "HD_Notification",
                userInfo: { ...remoteMessage.data, isLocalNoti: true },
                importance: 4, // (optional) default: 4. Int value of the Android notification importance
                vibrate: true,
            });

        });
        // android only
        messaging().setBackgroundMessageHandler(async remoteMessage => {
            if (remoteMessage?.data?.type === constant_type_notify.ALERT_NOTIFICATION || remoteMessage?.data?.type === constant_type_notify.PROMOTION_NOTIFICATION) {
                if (homeInstance) {
                    homeInstance.inCreaseBaddge();
                }
                let count = await AsyncStorage.getItem(KEY_ASYNC_NOTI)
                if (!count) {
                    AsyncStorage.setItem(KEY_ASYNC_NOTI, '1');
                    if (Platform.OS == 'ios') {
                        notifee.setBadgeCount(1)
                    }
                } else {
                    let new_count = (count >> 0) + 1;
                    AsyncStorage.setItem(KEY_ASYNC_NOTI, new_count + '');
                    if (Platform.OS == 'ios') {
                        notifee.setBadgeCount(new_count)
                    }
                }
            }

            console.log("setBackgroundMessageHandler", remoteMessage)

        });

        PushNotification.popInitialNotification((notification) => {
            console.log("popInitialNotification", notification);
            if (notification && notification.data.isLocalNoti) {
                handleNoti(notification.data)
            }

        })
        Navigation.events().registerComponentDidAppearListener(async event => {
            instanceData.current_component_id = event.componentId;
        })

    }
}

const gNotificationProssesor = new NotificationProcessor();
export default gNotificationProssesor;
