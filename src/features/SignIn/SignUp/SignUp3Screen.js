import React, { Component } from 'react'
import {
  ScrollView,
  Image,
  View,
  Text,
  KeyboardAvoidingView,
  TouchableOpacity,
  ImageBackground,
  TextInput
} from 'react-native'
import { connect } from 'react-redux'
import Action from '../redux/actions'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'p3Screen)

// Styles
import styles from '../SignUpStyle/SignUp3ScreenStyle'
import Navigator from '../Navigator'

class SignUp3Screen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      trueOTP: true,
      confirmResult: null,
      OTPTimes: 3,
    }
  }

  _handleSendCode = () => {
    var s = this.props.phone
    if (s.startsWith('+840')) s = s.replace('+840', '+84')
    else if (s.startsWith('0')) s = s.replace('0', '+84')
    console.log(s, 'phone', this.props.phone)

  }

  _handleVerifyCode = (verify_code) => {

    if (this.props.isForgetPwd) {
      Navigator.showScreenPwd(
        this.props.componentId,
        this._checkMobileVN(this.props.phone),
        this.props.isForgetPwd,
        {
          auth_code: '',
          otp_code: Number(verify_code),
        })
    } else {
      Navigator.showRegisterMoreInfo(this.props.componentId, { phone: this.props.phone, authCode: '' })
    }

  }

  _checkMobileVN(phone) {
    if (phone != '') {
      var mobile = phone.replace('+84', '0')
      if (phone.substr(0, 2) === '84') {
        mobile = phone.replace('84', '0')
      }
      if (mobile.substr(0, 2) === '00') {
        mobile = mobile.replace('00', '0')
      }
      return mobile
    }
    return ''
  }

  componentDidMount() {
    this._handleSendCode()
  }

  render() {
    console.log('this.propsdata', this.props.isForgetPwd)
    // phoneInput = useRef<PhoneInput>(null);
    return (
      <ImageBackground
        source={require('../res/bgr.jpeg')}
        style={styles.backgroundImage}>
        <ScrollView scrollEnabled={false}>
          <KeyboardAvoidingView behavior="padding">
            <View style={styles.container}>
              <View style={styles.formStyle}>
                <View style={styles.header}>
                  <Image
                    source={require('../res/logo_trans.png')}
                    style={this.state.trueOTP ? styles.imageLogo : styles.imageLogoWrong}
                    resizeMode="contain"
                  />
                  {this.state.trueOTP ? <Text style={styles.textHeader}>Verify Phone Number</Text> : <View
                    style={{ marginTop: 20 }}></View>}
                  <Text style={styles.textHeader2}>Enter Your Code</Text>
                </View>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholderTextColor="#FFFFFF"
                    placeholder={'Nhập mã OTP'}
                    onChangeText={(val) => {
                      if (val.length == 6) this._handleVerifyCode(val)
                    }}
                  />
                </View>
                {this.state.trueOTP ? <View></View> : <Text
                  style={{
                    alignSelf: 'center',
                    marginLeft: '5%',
                    marginRight: '5%',
                    marginTop: 10,
                    color: '#FF0000',
                  }}>
                  Wrong code. You can try {this.state.OTPTimes} times
                </Text>}
                <TouchableOpacity onPress={() => {
                  this.setState({
                    OTPTimes: 3,
                  })
                  this._handleSendCode()
                }}>
                  <Text
                    style={{
                      marginLeft: '15%',
                      marginRight: '15%',
                      marginTop: 60,
                      color: '#FFFFFF',
                      textDecorationLine: 'underline'

                    }}>
                    Resend OTP
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
      </ImageBackground>
    )
  }
}

const mapStateToProps = (state) => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return {
    onVerifyCode: (phone, token) => {
      dispatch(Action.action.verifyOTPWithFirebaseAction(phone, 0, token, 3))
    },
    verifyOTPAction: (phone, otp_code, auth_code, verify_type, callbackFail, callbackSuccess) => {
      dispatch(Action.action.verifyOTPAction(phone, otp_code, auth_code, verify_type, callbackFail, callbackSuccess))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUp3Screen)
