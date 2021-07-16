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
    Keyboard
} from 'react-native'

import { connect } from 'react-redux'


import { scale } from '../../ultis/scale'
import Icon from 'react-native-vector-icons/AntDesign';
import { Navigation } from 'react-native-navigation';
import { phoneValidate } from '../../ultis/validate'
import { color } from '../../constant/color'
import { pushToOTPScreen } from '../../NavigationController';
const { width, height } = Dimensions.get('window')

class EnterPhoneNumber extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            phone: '',
            enableButton: false,
            isvalidate: true,
        };
    }
    async componentDidMount() {
        this.InputPhone.focus();
    }
    onBack = () => {
        const { componentId } = this.props
        Navigation.pop(componentId)
    }
    onContinue = () => {
        const { phone } = this.state;
        const { componentId } = this.props;
        const isvalidate = phoneValidate(phone);
        if (!isvalidate) {
            this.setState({ isvalidate: isvalidate, enableButton: false })
            return
        }
        pushToOTPScreen(componentId, { phone: phone });
    }
    onClearText = () => {
        this.setState({ phone: '' })
    }
    render() {
        const { enableButton, isvalidate, phone } = this.state
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
                                    ref={ref => this.InputPhone = ref}
                                    keyboardType='number-pad'
                                    placeholder="Số điện thoại"
                                    style={{ fontSize: scale(14), color: 'black', padding: 5, height: scale(40), flex: 1 }}
                                    onChangeText={vl => {
                                        this.setState({ phone: vl, enableButton: vl ? true : false, isvalidate: true })
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
                        {!isvalidate && <Text style={{ fontSize: scale(11), color: color.RED_COLOR, marginTop: scale(7) }}>Số điện thoại không đúng. Hãy thử lại</Text>}

                    </View>

                    <TouchableOpacity
                        disabled={!enableButton}
                        activeOpacity={0.6}
                        onPress={this.onContinue}
                        style={{
                            margin: scale(20),
                            marginBottom: scale(25),
                            height: scale(40),
                            borderRadius: scale(6),
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: enableButton ? color.MAIN_COLOR : '#d1d1d1'

                        }}>
                        <Text style={{ color: '#FFFFFF', fontSize: scale(14), fontWeight: '600' }}>Tiếp tục</Text>
                    </TouchableOpacity>

                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
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

