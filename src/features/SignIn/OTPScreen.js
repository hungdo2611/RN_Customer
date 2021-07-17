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
    SafeAreaView
} from 'react-native'

import { connect } from 'react-redux'
import auth from '@react-native-firebase/auth';
import firebase from '@react-native-firebase/app'

import { scale } from '../../ultis/scale'
import Icon from 'react-native-vector-icons/AntDesign';
import { Navigation } from 'react-native-navigation';
import { phoneValidate } from '../../ultis/validate'
import { color } from '../../constant/color'
import OTPInputView from '@twotalltotems/react-native-otp-input'
import parsePhoneNumber from 'libphonenumber-js'

const { width, height } = Dimensions.get('window')

class OTPScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            enableButton: false,
            countTime: 0,
            confirm: null,
            code: ''
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
        this.setState({ countTime: 5 })
        this.clockCall = setInterval(() => {
            this.decrementClock();
        }, 1000);
    }
    decrementClock = () => {
        if (this.state.countTime === 1) clearInterval(this.clockCall)
        this.setState((prevstate) => ({ countTime: prevstate.countTime - 1 }));
    };
    reSendOTP = () => {
        console.log("reSendOTP")
    }
    confirmCode = async (code) => {
        const { confirm } = this.state;
        try {
            let data = await confirm.confirm(code);
            const idTokenResult = await firebase.auth().currentUser.getIdTokenResult();
            console.log('User JWT: ', idTokenResult.token);

            console.log("confirmCode", data)
        } catch (error) {
            Alert.alert('Mã OTP không đúng hoặc hết hạn')
        }
    }
    render() {
        const { enableButton, countTime } = this.state;
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
                                pinCount={6}
                                // code={this.state.code} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
                                // onCodeChanged = {code => { this.setState({code})}}
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
                        </View>

                        <TouchableOpacity
                            disabled={!enableButton}
                            activeOpacity={0.6}
                            onPress={this.confirmCode}
                            style={{
                                margin: scale(20),
                                marginBottom: scale(25),
                                height: scale(40),
                                borderRadius: scale(6),
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: enableButton ? color.MAIN_COLOR : '#d1d1d1'

                            }}>
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

