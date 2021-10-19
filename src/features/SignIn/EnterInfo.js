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
    Alert,
    BackHandler
} from 'react-native'

import { connect } from 'react-redux'


import { scale } from '../../ultis/scale'
import Icon from 'react-native-vector-icons/AntDesign';
import { Navigation } from 'react-native-navigation';
import { color } from '../../constant/color'
import { updateInfoAPI } from '../../api/loginApi'
import { setRootToHome } from '../../NavigationController'
import _ from 'lodash';
import { setLocalData } from '../../model';

const { width, height } = Dimensions.get('window')

class EnterInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isvalidate: true,
            pass_match: true,
            password: '',
            name: '',
            security: true,
            focus: -1,
            spaceErr: false
        };
    }
    async componentDidMount() {
        this.InputName.focus();
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);

    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    handleBackButtonClick = () => {
        return true
    }
    onContinue = async () => {
        let { password, name } = this.state;
        const { componentId } = this.props;
        if (password.length < 6) {
            this.setState({ isvalidate: false })
        }
        this.setState({ isloading: true })
        let requestUpdate = await updateInfoAPI({
            name: name,
            password: password
        })
        console.log("requestUpdate", requestUpdate)
        setTimeout(() => {
            this.setState({ isloading: false })
        }, 1000)
        if (requestUpdate && requestUpdate.data && !requestUpdate.err) {
            //success
            setLocalData(JSON.stringify(requestUpdate.data))
            setRootToHome()
        } else {
            Alert.alert("Đã có lỗi xảy ra vui lòng thử lại sau")
        }
    }
    onShowOrHidePass = () => {
        this.setState({ security: !this.state.security })
    }
    render() {
        const { enableButton, isvalidate, isloading, password, focus, name, security } = this.state;
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

                            <Text style={{ fontSize: scale(20), marginTop: scale(10), marginBottom: scale(10), fontWeight: "bold" }}>Cập nhật thông tin</Text>
                            <Text style={{ fontSize: scale(15), marginTop: scale(10), marginBottom: scale(10), fontWeight: "500" }}>Tên của bạn là gì?</Text>
                            <View style={{
                                alignItems: 'center'
                            }}
                            >
                                <View style={{
                                    marginTop: 5,
                                    height: scale(40),
                                    borderRadius: 6,
                                    borderWidth: 1.3,
                                    borderColor: focus == 0 ? color.MAIN_COLOR : color.GRAY_COLOR,
                                    flexDirection: 'row',
                                    alignItems: 'center'
                                }}>

                                    <TextInput
                                        ref={ref => this.InputName = ref}
                                        placeholder="Họ và tên"
                                        onFocus={() => {
                                            this.setState({ focus: 0 })
                                        }}
                                        onBlur={() => {
                                            this.setState({ focus: -1 })
                                        }}
                                        onEndEditing={() => {
                                            this.pass.focus()
                                        }}
                                        style={{ fontSize: scale(14), color: 'black', padding: 5, height: scale(40), flex: 1, paddingLeft: scale(12) }}
                                        onChangeText={vl => {
                                            this.setState({ name: vl, isvalidate: true })
                                            if (password.trim() && vl.trim()) {
                                                this.setState({ enableButton: true })
                                            } else {
                                                this.setState({ enableButton: false })
                                            }
                                        }}
                                        value={name}

                                    >

                                    </TextInput>

                                </View>
                            </View>
                            <Text style={{ fontSize: scale(15), marginTop: scale(10), marginBottom: scale(10), fontWeight: "500" }}>Hãy nhập mật khẩu của bạn?</Text>
                            <View style={{
                                alignItems: 'center'
                            }}
                            >
                                <View style={{
                                    marginTop: 5,
                                    height: scale(40),
                                    borderRadius: 6,
                                    borderWidth: 1.3,
                                    borderColor: isvalidate ? (focus == 1 ? color.MAIN_COLOR : color.GRAY_COLOR) : color.RED_COLOR,
                                    flexDirection: 'row',
                                    alignItems: 'center'
                                }}>

                                    <TextInput
                                        secureTextEntry={security}
                                        ref={ref => this.pass = ref}
                                        placeholder="Mật khẩu"

                                        onFocus={() => {
                                            this.setState({ focus: 1 })
                                        }}
                                        onBlur={() => {
                                            this.setState({ focus: -1 })

                                        }}
                                        style={{ fontSize: scale(14), color: 'black', padding: 5, height: scale(40), flex: 1, paddingLeft: scale(12) }}
                                        onChangeText={vl => {
                                            this.setState({ password: vl.replace(/\s/g, ''), isvalidate: true })
                                            if (name.trim() && vl.trim()) {
                                                this.setState({ enableButton: true })
                                            } else {
                                                this.setState({ enableButton: false })

                                            }
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
                            {!isvalidate && <Text style={{ fontSize: scale(11), color: color.RED_COLOR, marginTop: scale(7) }}>Mật khẩu phải chứa ít nhất 6 ký tự</Text>}
                            {isloading && <ActivityIndicator size="large" color={color.MAIN_COLOR} style={{ padding: scale(5), marginTop: scale(10) }} />}

                        </View>

                        <TouchableOpacity
                            disabled={!enableButton || isloading}
                            activeOpacity={0.6}
                            onPress={_.debounce(() => this.onContinue(), 1000)}
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

export default connect(mapStateToProps, mapDispatchToProps)(EnterInfo)

