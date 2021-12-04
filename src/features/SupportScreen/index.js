import React, { useState, useEffect, PureComponent } from 'react'
import {
    View,
    Text,
    Dimensions,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard,
    SafeAreaView,
    TouchableOpacity,
    Platform,
    Image,
    Linking,
    Alert

} from 'react-native'

import { Navigation } from 'react-native-navigation';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux'

import _ from 'lodash';
import { scale } from '../../ultis/scale';
import { color } from '../../constant/color';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';



const { width, height } = Dimensions.get('window')

const toastConfig = {
    /* 
      overwrite 'success' type, 
      modifying the existing `BaseToast` component
    */
    success: (props) => (
        <BaseToast
            {...props}
            style={{ borderLeftColor: color.GREEN_COLOR_300, paddingHorizontal: scale(10), height: scale(70), borderLeftWidth: scale(8) }}
            text1Style={{
                color: color.GREEN_COLOR_400,
                fontSize: 17
            }}
            text2Style={{
                fontSize: 15,
                color: 'black'
            }}
        />
    ),

    /*
      Reuse the default ErrorToast toast component
    */
    error: (props) => (
        <BaseToast
            {...props}
            style={{ borderLeftColor: color.RED_COLOR, height: scale(70), paddingHorizontal: scale(10), borderLeftWidth: scale(8) }}
            text1Style={{
                color: color.RED_COLOR,
                fontSize: 17
            }}
            text2Style={{
                fontSize: 15,
                color: 'black'
            }}
        />
    ),
    /* 
      or create a completely new type - `my_custom_type`,
      building the layout from scratch
    */
    my_custom_type: ({ text1, props, ...rest }) => (
        <View style={{ height: 60, width: '100%', backgroundColor: 'tomato' }}>
            <Text>{text1}</Text>
        </View>
    )
};
export class SupportScreen extends React.Component {
    constructor(props) {
        super(props);

    }

    async componentDidMount() {
    }

    renderHeader = () => {
        const { componentId } = this.props;
        return <View style={{ flexDirection: "row", alignItems: 'center', marginBottom: scale(10) }}>
            <TouchableOpacity activeOpacity={0.6} onPress={() => Navigation.pop(componentId)}>
                <Icon
                    name='arrow-back'
                    size={scale(22)}
                    color="black"
                    style={{ marginHorizontal: scale(10) }}
                />
            </TouchableOpacity>
            <Text
                style={{
                    fontSize: scale(22),
                    fontWeight: 'bold',
                    marginTop: scale(5),
                    marginBottom: scale(5)
                }}>Hỗ trợ góp ý</Text>

        </View>
    }
    renderIcon = () => {
        return <View
            style={{
                width: scale(60),
                height: scale(60),
                borderRadius: scale(30),
                backgroundColor: color.ORANGE_COLOR_400,
                alignItems: "center",
                justifyContent: "center",
                alignSelf: "center"
            }}>
            <FontAwesomeIcon
                name="question"
                color="#FFFFFF"
                size={scale(25)}
            />
        </View>
    }


    renderButton = (icon, txt, onPress) => {
        return <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.6}
            style={{
                flexDirection: 'row',
                alignItems: "center",
                borderWidth: 1,
                borderColor: color.ORANGE_COLOR_400,
                paddingHorizontal: scale(10),
                paddingVertical: scale(10),
                marginHorizontal: scale(20),
                borderRadius: scale(10),
                marginVertical: scale(12)
            }}>
            {icon}
            <Text style={{ fontSize: scale(15), color: color.ORANGE_COLOR_400, marginLeft: scale(15), fontWeight: "500" }}>{txt}</Text>
        </TouchableOpacity>
    }
    callNumber = phone => {
        let phoneNumber = phone;
        if (Platform.OS !== 'android') {
            phoneNumber = `telprompt:${phone}`;
        }
        else {
            phoneNumber = `tel:${phone}`;
        }
        Linking.canOpenURL(phoneNumber)
            .then(supported => {
                if (!supported) {
                    Alert.alert('Số điện thoại không đúng');
                } else {
                    return Linking.openURL(phoneNumber);
                }
            })
            .catch(err => console.log(err));
    };
    onClickPageFB = () => {
    }
    onClickCall = () => {
        this.callNumber('0357519390')
    }
    onClickGroupFB = () => {

    }
    onClickGroupZalo = () => {

    }
    render() {

        return (
            <SafeAreaView style={{ flex: 1 }}>
                <KeyboardAwareScrollView
                    ref={ref => { this.scrollView = ref }}
                    enableOnAndroid
                    extraHeight={-64}
                    keyboardOpeningTime={0}
                    enableResetScrollToCoords={true}
                    showsVerticalScrollIndicator={false}>
                    {this.renderHeader()}
                    {this.renderIcon()}
                    <Text style={{ fontSize: scale(13), padding: scale(15), textAlign: 'center' }}>
                        Nếu bạn gặp khó khăn khi sử dụng 9Trip. Hay có những thắc mắc, câu hỏi, phản hổi. Hãy vui lòng liên hệ với chúng tôi
                    </Text>
                    {this.renderButton(<FontAwesomeIcon
                        name="facebook"
                        size={scale(20)} />,
                        'Liên hệ FaceBook',
                        this.onClickPageFB)}
                    {this.renderButton(<AntDesignIcon
                        name="customerservice"
                        size={scale(20)} />,
                        'Gọi tổng đài',
                        this.onClickCall)}
                    {this.renderButton(<MaterialCommunityIcons
                        name="account-group"
                        size={scale(20)} />,
                        'Tham gia cộng đồng trên FaceBook',
                        this.onClickGroupFB
                    )}
                    {this.renderButton(<Image style={{ width: scale(20), height: scale(20) }} source={require('./zalo.png')} />,
                        'Tham gia cộng đồng trên Zalo',
                        this.onClickGroupZalo)}
                </KeyboardAwareScrollView>
                <Toast config={toastConfig} ref={(ref) => Toast.setRef(ref)} />
            </SafeAreaView>
        )
    }
}



const mapStateToProps = (state) => {
    return {
    }
}

const mapDispatchToProps = (dispatch) => {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SupportScreen)

