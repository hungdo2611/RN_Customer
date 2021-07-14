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
  Alert,
} from 'react-native';
import { connect } from 'react-redux';
import Auth from '../redux/actions'
// Styles
import styles from '../SignUpStyle/SignUp5ScreenStyle';
import { scale } from '../../ultis/scale'

class SignUp5Screen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dplname: '',
      email: '',
      invite_code: '',
      validDplname: true,
      validEmail: true,
      validInviteCode: true,
      password: '',
      validPass: true,
    };
  }

  validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  _register = () => {

    if (this.state.password < 7) {
      this.setState({
        validPass: false,
      })
      return
    }
    if (this.state.email == "" || !this.validateEmail(this.state.email)) {
      this.setState({
        validEmail: false
      })
      return
    }
    this.props.register(this.props.phone, this.state.password, this.state.invite_code, this.state.email, this.props.authCode)
  }


  render() {
    return (
      <KeyboardAvoidingView style={{ height: '100%', width: '100%' }} behavior='height'>
        <ImageBackground
          source={require('../res/bgr.jpeg')}
          style={styles.backgroundImage}>
          <View style={styles.container}>
            <Image
              source={require('../res/logo_trans.png')}
              style={styles.imageLogo}
            />
            <View style={styles.registerCart}>
              <Text style={styles.textHeader}>Hoàn tất đăng ký</Text>
              <Text style={styles.textHeader2}>
                Bạn vui lòng nhập Tên, Email, Mã mời để hoàn tất bước đăng
                ký
                    </Text>

              <View style={[{ marginTop: 10 }]}>
                <TextInput
                  style={styles.input}
                  placeholderTextColor="#FFFFFF"
                  secureTextEntry={true}
                  placeholder={'Mật khẩu*'}
                  onChangeText={(val) => {
                    this.setState({
                      password: val
                    })
                  }}
                />
                {!this.state.validPass ? <Text style={{ color: 'red' }}>Mật khẩu không hợp lệ</Text> : <Text></Text>}
              </View>
              <View style={{}}>
                <TextInput
                  style={styles.input}
                  placeholderTextColor="#FFFFFF"
                  placeholder={'Email*'}
                  onChangeText={(val) => {
                    this.setState({
                      email: val
                    })
                  }}
                />
                {!this.state.validEmail ? <Text style={{ color: 'red' }}>Email không hợp lệ</Text> : <Text></Text>}
              </View>
              <View style={{}}>
                <TextInput
                  style={styles.input}
                  placeholderTextColor="#FFFFFF"
                  placeholder={'Mã mời'}
                  onChangeText={(val) => {
                    this.setState({
                      invite_code: val
                    })
                  }}
                />
                {!this.state.validInviteCode ? <Text style={{ color: 'red' }}>Mã mời không hợp lệ</Text> : <Text></Text>}
              </View>
            </View>
            <TouchableOpacity style={{ width: 200, height: 45, borderRadius: 15, backgroundColor: 'white', alignSelf: 'center', alignItems: 'center', justifyContent: 'center', marginTop: scale(10) }} onPress={this._register}>
              <Text style={styles.textButton}>Hoàn thành</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </KeyboardAvoidingView>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {
    register: (uname, password, invite_code, email, dplname, authCode) => {
      dispatch(Auth.action.registerAction(uname, password, invite_code, email, dplname, authCode))
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUp5Screen);
