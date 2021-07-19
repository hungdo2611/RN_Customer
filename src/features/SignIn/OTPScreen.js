import React, { useState, useEffect, PureComponent } from 'react'
import {
    Image,
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    TextInput,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard,
    StyleSheet,
    Alert,
    SafeAreaView,
    ActivityIndicator
} from 'react-native'

import { connect } from 'react-redux'
import auth from '@react-native-firebase/auth';
import firebase from '@react-native-firebase/app'

import { scale } from '../../ultis/scale'
import Icon from 'react-native-vector-icons/AntDesign';
import { Navigation } from 'react-native-navigation';
import { color } from '../../constant/color'
import OTPInputView from '@twotalltotems/react-native-otp-input'
import { registerAPI } from '../../api/loginApi'
import parsePhoneNumber from 'libphonenumber-js'
import { typeOTP } from './constant'
import { pushToEnterInfo, pushToResetPass } from '../../NavigationController';
import { setToken } from '../../model'
const { width, height } = Dimensions.get('window')

class OTPScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            enableButton: false,
            countTime: 0,
            confirm: null,
            code: '',
            isloading: false,
        };
    }
    async componentDidMount() {
        this.startTimer();
        let { phone } = this.props;
        const phoneNumber = parsePhoneNumber(phone, 'VN')
        const confirmation = await auth().signInWithPhoneNumber(phoneNumber.number);
        this.setState({ confirm: confirmation })


    }
    onBack = () => {
        const { componentId } = this.props
        Navigation.pop(componentId)
    }
    startTimer = () => {
        this.setState({ countTime: 60 })
        this.clockCall = setInterval(() => {
            this.decrementClock();
        }, 1000);
    }
    decrementClock = () => {
        if (this.state.countTime === 1) clearInterval(this.clockCall)
        this.setState((prevstate) => ({ countTime: prevstate.countTime - 1 }));
    };
    reSendOTP = async () => {
        let { phone } = this.props;
        const phoneNumber = parsePhoneNumber(phone, 'VN')
        const confirmation = await auth().signInWithPhoneNumber(phoneNumber.number);
        this.setState({ confirm: confirmation })
        console.log("reSendOTP")
    }
    confirmCode = async (code) => {
        const { confirm } = this.state;
        const { phone, type, componentId } = this.props;
        this.setState({ isloading: true })
        try {
            let data = await confirm.confirm(code);
            const idTokenResult = await firebase.auth().currentUser.getIdTokenResult();
            const body = {
                phone: phone,
                token: idTokenResult.token
            }
            if (type == typeOTP.REGISTER) {
                const register = await registerAPI(body)
                setTimeout(() => {
                    this.setState({ isloading: false })
                }, 1000)

                if (register && register.data && !register.err) {
                    setToken(register.token);
                    pushToEnterInfo(componentId)
                }
            }
            if (type == typeOTP.FORGOT_PASSWORD) {
                pushToResetPass(componentId, { phone: phone, tokenfirebase: idTokenResult.token })
            }

        } catch (error) {
            console.log('error', error);
            this.OTPView.focusField(0)
            this.setState({ isloading: false, code: '' });
            Alert.alert('Mã OTP không đúng hoặc hết hạn');
        }
    }
    render() {
        const { enableButton, countTime, isloading } = this.state;
        const { phone } = this.props;
        const phoneNumber = parsePhoneNumber(phone, 'VN')
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <SafeAreaView style={{ flex: 1 }}>
                    <KeyboardAvoidingView
                        style={{
                            flex: 1,
                            justifyContent: "space-between",
                        }}
                        behavior={Platform.OS == 'ios' ? 'padding' : ''}>
                        <View style={{ margin: scale(12) }}>
                            <Icon
                                onPress={this.onBack}
                                name="arrowleft"
                                size={scale(18)}
                            />
                            <Text style={{ fontSize: scale(20), marginTop: scale(10), marginBottom: scale(10), fontWeight: "bold" }}>Xác nhận mã OTP</Text>
                            <Text style={{ fontSize: scale(14), marginTop: scale(10), color: color.GRAY_COLOR }}>Nhập mã 6 số được gửi cho bạn tại </Text>
                            <Text style={{ fontSize: scale(15), marginBottom: scale(10) }}>{phoneNumber.formatNational()}</Text>
                            <OTPInputView
                                style={{ width: '100%', height: scale(130) }}
                                ref={ref => this.OTPView = ref}
                                code={this.state.code}
                                pinCount={6}
                                // code={this.state.code} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
                                onCodeChanged={code => {
                                    this.setState({ code })
                                }}
                                autoFocusOnLoad
                                codeInputFieldStyle={styles.underlineStyleBase}
                                codeInputHighlightStyle={styles.underlineStyleHighLighted}
                                onCodeFilled={(code) => {
                                    this.confirmCode(code)
                                }}
                            />
                            <View style={{ flexDirection: 'row' }}>
                                <Text>Bạn không nhận được mã?</Text>
                                <TouchableOpacity onPress={this.reSendOTP} style={{ alignItems: "center" }} disabled={countTime > 0} activeOpacity={1}>
                                    <Text style={{ fontWeight: '700' }}> Gửi lại {countTime > 0 ? `(${countTime})` : ''}</Text>
                                </TouchableOpacity>
                            </View>
                            {isloading && <ActivityIndicator size="large" color={color.MAIN_COLOR} style={{ padding: scale(5), marginTop: scale(10) }} />}

                        </View>

                        <TouchableOpacity
                            disabled={!enableButton || isloading}
                            activeOpacity={0.6}
                            onPress={() => this.confirmCode(this.state.code)}
                            style={{
                                margin: scale(20),
                                marginBottom: scale(25),
                                height: scale(40),
                                borderRadius: scale(6),
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: enableButton && !isloading ? color.MAIN_COLOR : '#d1d1d1',
                                flexDirection: 'row'
                            }}>
                            {isloading && <ActivityIndicator size="small" color="#FFFFFF" style={{ padding: scale(5) }} />}
                            <Text style={{ color: '#FFFFFF', fontSize: scale(14), fontWeight: '600' }}>Xác thực</Text>
                        </TouchableOpacity>

                    </KeyboardAvoidingView>
                </SafeAreaView>
            </TouchableWithoutFeedback>
        )
    }
}
const styles = StyleSheet.create({
    borderStyleBase: {
        width: 30,
        height: 45
    },

    borderStyleHighLighted: {
        borderColor: "#03DAC6",
    },

    underlineStyleBase: {
        width: 35,
        height: 35,
        borderWidth: 1,
        color: "black"
    },

    underlineStyleHighLighted: {
        borderColor: "#03DAC6",
        color: "black"

    },
});



const mapStateToProps = (state) => {
    return {

    }
}

const mapDispatchToProps = (dispatch) => {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(OTPScreen)

