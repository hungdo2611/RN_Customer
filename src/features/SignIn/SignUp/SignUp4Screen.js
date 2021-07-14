import React, { Component } from 'react';
import {
  ScrollView,
  Image,
  View,
  Text,
  KeyboardAvoidingView,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  Alert
} from 'react-native';
import { connect } from 'react-redux';
import Auth from '../redux/actions'

import styles from '../SignUpStyle/SignUp4ScreenStyle';
import Navigator from '../Navigator'

class SignUp4Screen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pwd: '',
      rePwd: '',
      validPwd: true,
      validRePwd: true,
      showPassword: true,
      showPasswordAgain: true,
    };
  }

  _checkPwd = () => {
    if (this.state.pwd.length < 6) {
      this.setState({
        validPwd: false
      })
      return
    }
    if (this.state.pwd != this.state.rePwd) {
      this.setState({
        validRePwd: false,
      })
      return;
    }
    if (this.props.isForgetPwd) {
      console.log(this.props.data, "abcdefg")
      this.props.resetPass(
        this.props.data.auth_code,
        this.state.pwd,
        this.props.data.otp_code,
        this.props.phone,
        3,
        () => {
          Alert.alert(
            "Đổi mật khẩu thất bại",
            "Nhấn OK để quay lại đăng nhập",
            [
              { text: "OK", onPress: () => Navigator.setRoot() },
              { text: "Đóng", onPress: () => { } }
            ],
            { cancelable: true }
          );
        }, () => {
          Alert.alert(
            "Đổi mật khẩu thành công",
            "Nhấn OK để quay lại đăng nhập",
            [
              { text: "OK", onPress: () => Navigator.setRoot() }
            ],
            { cancelable: false }
          );
        })
    }
    else
      Navigator.setRoot()
  }

  render() {
    return (
      <ImageBackground
        source={require('../res/bgr.jpeg')}
        style={styles.backgroundImage}>
        <View style={styles.container}>
          <Image
            source={require('../res/logo_trans.png')}
            style={styles.imageLogo}
          />
          <View style={styles.registerCart}>
            <Text style={styles.textHeader}>Cài đặt mật khẩu</Text>
            <Text style={styles.textHeader2}>
              Vì lý do bảo mật, vui lòng cài đặt mật khẩu
                    </Text>
            <View style={[styles.inputWrapper, { marginTop: 20, marginLeft: 20 }]}>
              <TextInput
                secureTextEntry={this.state.showPassword}
                style={styles.input}
                placeholderTextColor="#FFFFFF"
                placeholder={'Mật Khẩu*'}
                onChangeText={(val) => {
                  this.setState({
                    validPwd: true,
                    pwd: val,
                  })
                }}
              />
              <Image
                source={require('../res/eye.png')}
                style={styles.inlineImg}
                resizeMode="contain"
              />
            </View>
            <View style={[styles.inputWrapper, { marginLeft: 20 }]}>
              <TextInput
                secureTextEntry={this.state.showPasswordAgain}
                style={styles.input}
                placeholderTextColor="#FFFFFF"
                placeholder={'Nhập lại mật khẩu*'}
                onChangeText={(val) => {
                  this.setState({
                    validRePwd: true,
                    rePwd: val,
                  })
                }}
              />
              <Image
                source={require('../res/eye.png')}
                style={styles.inlineImg}
                resizeMode="contain"

              />
            </View>
            {!this.state.validPwd ? <Text style={{ color: 'red', alignSelf: 'center', marginTop: 50 }}>Mật khẩu không hợp lệ</Text> : <Text></Text>}
            {!this.state.validRePwd ? <Text style={{ color: 'red', alignSelf: 'center', marginTop: 50 }}>Nhập lại mật khẩu không đúng</Text> : <Text></Text>}
          </View>
          <TouchableOpacity style={styles.buttonSubmit} onPress={this._checkPwd}>
            <Text style={styles.textButton}>Tiếp tục</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {
    resetPass: (auth_code, new_password, otp_code, uname, verify_type, callbackFail, callbackSuccess) => {
      dispatch(Auth.action.resetPassAction(auth_code, new_password, otp_code, uname, verify_type, callbackFail, callbackSuccess))
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUp4Screen);