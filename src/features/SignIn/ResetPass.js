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
    ActivityIndicator,
    Alert
} from 'react-native'

import { connect } from 'react-redux'


import { scale } from '../../ultis/scale'
import Icon from 'react-native-vector-icons/AntDesign';
import { Navigation } from 'react-native-navigation';
import { color } from '../../constant/color'
import { resetPassAPI } from '../../api/loginApi'
import _ from 'lodash';
import { setToken, setLocalData } from '../../model'
import { typeOTP } from './constant'
import { setRootToHome } from '../../NavigationController'
const { width, height } = Dimensions.get('window')

class ResetPass extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isvalidate: true,
            password: '',
            security: true,
            isloading: false,
            err_wrongpass: false,
        };
    }
    async componentDidMount() {
        this.InputPhone.focus();
    }
    onBack = () => {
        const { componentId } = this.props
        Navigation.pop(componentId)
    }
    onContinue = async () => {
        let { password } = this.state;
        const { componentId, phone, tokenfirebase } = this.props;
        this.setState({ isloading: true })

        if (password.length < 6) {
            this.setState({ isvalidate: false, enableButton: false, isloading: false })
            return
        }

        const body = {
            phone: phone,
            password: password,
            token: tokenfirebase
        }
        let requestReset = await resetPassAPI(body)
        console.log("requestReset", requestReset)
        if (requestReset && requestReset.data && !requestReset.err) {
            //Login OK
            setToken(requestReset.token)
            setLocalData(JSON.stringify(requestReset.data))
            setTimeout(() => { this.setState({ isloading: false }) }, 1000)
            setRootToHome()
        } else {
            Alert.alert("Đã có lỗi xảy ra. Vui lòng thử lại sau")
        }

    }
    onShowOrHidePass = () => {
        this.setState({ security: !this.state.security })
    }
    resetPass = () => {
        pushToOTPScreen(componentId, { phone: phone, type: typeOTP.FORGOT_PASSWORD });

    }
    render() {
        const { enableButton, isvalidate, isloading, password, security, err_wrongpass } = this.state;
        const { phone } = this.props;
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
                            <Text style={{ fontSize: scale(20), marginTop: scale(10), marginBottom: scale(10), fontWeight: "bold" }}>Đặt lại mật khẩu</Text>
                            <Text style={{ fontSize: scale(15), marginTop: scale(10), marginBottom: scale(10), fontWeight: "500", color: color.GRAY_COLOR }}>Số điện thoại đăng ký của bạn là {phone}</Text>
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

                                    <TextInput
                                        ref={ref => this.InputPhone = ref}
                                        secureTextEntry={security}
                                        placeholder="Mật khẩu"
                                        style={{ fontSize: scale(14), color: 'black', padding: 5, height: scale(40), flex: 1, paddingLeft: scale(12) }}
                                        onChangeText={vl => {
                                            this.setState({ password: vl, enableButton: vl.length > 5 ? true : false, isvalidate: true, err_wrongpass: false })
                                        }}
                                        value={password}

                                    >

                                    </TextInput>
                                    {password !== '' && <Icon
                                        onPress={this.onShowOrHidePass}
                                        name="eye"
                                        size={scale(16)}
                                        color="#BABABA"
                                        style={{ marginHorizontal: scale(10) }}
                                    />}
                                </View>
                            </View>
                            {!isvalidate && <Text style={{ fontSize: scale(11), color: color.RED_COLOR, marginTop: scale(7) }}>{err_wrongpass ? 'Mật khẩu không đúng vui lòng thử lại' : 'Mật khẩu phải chứa ít nhất 6 ký tự'}</Text>}

                        </View>

                        <TouchableOpacity
                            disabled={!enableButton || isloading}
                            activeOpacity={0.6}
                            onPress={_.debounce(() => this.onContinue(),
                                100, {
                                'leading': true,
                                'trailing': false
                            })}
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

export default connect(mapStateToProps, mapDispatchToProps)(ResetPass)

