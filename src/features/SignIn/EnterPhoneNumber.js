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
    SafeAreaView,
    ActivityIndicator
} from 'react-native'

import { connect } from 'react-redux'


import { scale } from '../../ultis/scale'
import Icon from 'react-native-vector-icons/AntDesign';
import { Navigation } from 'react-native-navigation';
import { color } from '../../constant/color'
import { pushToOTPScreen, pushToEnterPass } from '../../NavigationController';
import { isValidPhoneNumber } from 'libphonenumber-js'
import { checkPhoneExist } from '../../api/loginApi'
import _ from 'lodash';
import { typeOTP } from './constant'
const { width, height } = Dimensions.get('window')

class EnterPhoneNumber extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            phone: '',
            enableButton: false,
            isvalidate: true,
            isloading: false,
            error: false
        };
    }
    async componentDidMount() {
        // this.InputPhone.focus();
    }
    onBack = () => {
        const { componentId } = this.props
        Navigation.pop(componentId)
    }
    onContinue = async () => {
        let { phone } = this.state;
        const { componentId, type, data } = this.props;

        const isvalidate = isValidPhoneNumber(phone, 'VN');
        if (!isvalidate) {
            this.setState({ isvalidate: isvalidate, enableButton: false })
            return
        }

        this.setState({ isloading: true })
        let checkPhone = await checkPhoneExist(phone)
        setTimeout(() => {
            this.setState({ isloading: false })
        }, 1000)
        if (type == typeOTP.LOGIN_FACEBOOK_OTP) {
            if (checkPhone && checkPhone.data && checkPhone.err == false) {
                this.setState({ error: true });
            } else {
                pushToOTPScreen(componentId, { phone: phone, type: typeOTP.LOGIN_FACEBOOK_OTP, data: data });
            }
            return
        }
        if (type == typeOTP.LOGIN_APPLE_OTP) {
            if (checkPhone && checkPhone.data && checkPhone.err == false) {
                this.setState({ error: true });
            } else {
                pushToOTPScreen(componentId, { phone: phone, type: typeOTP.LOGIN_APPLE_OTP, data: data });
            }
            return
        }


        console.log("checkPhone", checkPhone)
        if (checkPhone && checkPhone.data && checkPhone.err == false) {
            pushToEnterPass(componentId, { phone: phone })
        } else {
            pushToOTPScreen(componentId, { phone: phone, type: typeOTP.REGISTER });
        }
    }
    onClearText = () => {
        this.setState({ phone: '' })
    }
    render() {
        const { enableButton, isvalidate, phone, isloading } = this.state
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <SafeAreaView style={{ flex: 1 }}>
                    <KeyboardAvoidingView
                        style={{
                            flex: 1,
                            justifyContent: "space-between",
                        }}
                        keyboardVerticalOffset={Platform.OS === 'android' ? 20 : 0}
                        behavior={'padding'}>
                        <View style={{ margin: scale(12) }}>
                            <Icon
                                onPress={this.onBack}
                                name="arrowleft"
                                size={scale(18)}
                            />
                            <Text style={{ fontSize: scale(20), marginTop: scale(10), marginBottom: scale(10), fontWeight: "bold" }}>Nhập số điện thoại để tiếp tục</Text>
                            <View style={{
                                alignItems: 'center'
                            }}
                            >
                                <View style={{
                                    marginTop: 5,
                                    height: scale(40),
                                    borderRadius: 6,
                                    borderWidth: 1.3,
                                    borderColor: isvalidate ? color.MAIN_COLOR : color.RED_COLOR,
                                    flexDirection: 'row',
                                    alignItems: 'center'
                                }}>
                                    <Image style={{ width: scale(17), height: scale(14), marginLeft: scale(12) }} source={require('./res/ic_flag_vn.png')} />
                                    <Text style={{ fontSize: scale(13), marginLeft: scale(5) }}>+84</Text>
                                    <View style={{ width: 1, height: scale(16), backgroundColor: 'gray', marginHorizontal: scale(8) }} />
                                    <TextInput
                                        autoFocus
                                        ref={ref => this.InputPhone = ref}
                                        keyboardType='number-pad'
                                        placeholder="Số điện thoại"
                                        style={{ fontSize: scale(14), color: 'black', padding: 5, height: scale(40), flex: 1 }}
                                        onChangeText={vl => {
                                            this.setState({ phone: vl, enableButton: vl ? true : false, isvalidate: true, error: false })
                                        }}
                                        value={phone}

                                    >

                                    </TextInput>
                                    {phone !== '' && <Icon
                                        onPress={this.onClearText}
                                        name="closecircle"
                                        size={scale(13)}
                                        color="#BABABA"
                                        style={{ marginHorizontal: scale(10) }}
                                    />}
                                </View>
                            </View>
                            {this.state.error && !isloading && <Text style={{ fontSize: scale(11), color: color.RED_COLOR, marginTop: scale(7) }}>Số điện thoại đã có người khác sử dụng. Vui lòng nhập số khác để có thể liên kết tài khoản Facebook</Text>}
                            {!isvalidate && <Text style={{ fontSize: scale(11), color: color.RED_COLOR, marginTop: scale(7) }}>Số điện thoại không đúng. Hãy thử lại</Text>}
                            {isloading && <ActivityIndicator size="large" color={color.MAIN_COLOR} style={{ padding: scale(5), marginTop: scale(10) }} />}

                        </View>

                        <TouchableOpacity
                            disabled={!enableButton || isloading}
                            activeOpacity={0.6}
                            onPress={_.debounce(() => this.onContinue(), 1000, { leading: true, trailing: false })}
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
                            <Text style={{ color: '#FFFFFF', fontSize: scale(14), fontWeight: '600' }}>Tiếp tục</Text>
                        </TouchableOpacity>

                    </KeyboardAvoidingView>
                </SafeAreaView>
            </TouchableWithoutFeedback >
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

export default connect(mapStateToProps, mapDispatchToProps)(EnterPhoneNumber)

