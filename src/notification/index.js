import { Alert } from 'react-native'
import messaging from '@react-native-firebase/messaging';
import instanceData from '../model'
import { registerDeviceToken } from '../api/loginApi'
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
        messaging().subscribeToTopic("ALL");
        const req = await registerDeviceToken(deviceToken);
        console.log('register device token', req)
        //
        this.device_token = deviceToken;

    }
}

const gNotificationProssesor = new NotificationProcessor();
export default gNotificationProssesor;
