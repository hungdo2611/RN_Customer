import React, { useState, useEffect, PureComponent } from 'react'
import {
  Image,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Platform,
  Alert
} from 'react-native'

import { connect } from 'react-redux'


import { scale } from '../../ultis/scale'

import { pushToEnterPhoneNumberScreen } from '../../NavigationController'
import { color } from '../../constant/color'
import {
  AccessToken,
  AuthenticationToken,
  LoginManager,
} from 'react-native-fbsdk-next';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';


import { loginByFaceBookAPI, loginByAppleAPI } from '../../api/loginApi'
import { setToken, setLocalData } from '../../model'
import { pushToOTPScreen, setRootToHome } from '../../NavigationController'
import { typeOTP } from './constant'
import Spinner from 'react-native-loading-spinner-overlay';
import SplashScreen from 'react-native-splash-screen'
import { appleAuth } from '@invertase/react-native-apple-authentication';
import { checkPhoneExist } from '../../api/loginApi'
import axios from 'axios'
const { width, height } = Dimensions.get('window')



class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isloading: false,
    };
  }
  async componentDidMount() {
    SplashScreen.hide();
  }
  onClickPhoneNumber = () => {
    const { componentId } = this.props;
    console.log("hungdv", componentId)

    pushToEnterPhoneNumberScreen(componentId);
  }
  onLoginByFacebook = () => {
    const { componentId } = this.props;
    let instance = this;
    instance.setState({ isloading: true })

    LoginManager.logInWithPermissions(["public_profile"]).then(
      async function (result) {

        if (result.isCancelled) {
          console.log("Login cancelled123");
          instance.setState({ isloading: false })
        } else {
          const result = await AccessToken.getCurrentAccessToken();
          console.log("accesstoken", result)
          let req_login = await loginByFaceBookAPI({ access_token: result?.accessToken });
          if (!req_login) {
            instance.setState({ isloading: false })
            return
          }
          if (req_login && !req_login.err && req_login.data) {
            setToken(req_login.token)
            await setLocalData(JSON.stringify(req_login.data))
            instance.setState({ isloading: false })
            setRootToHome()
            return
          }
          if (req_login && req_login?.err && req_login.data == 'Customer not found') {
            pushToEnterPhoneNumberScreen(componentId, { type: typeOTP.LOGIN_FACEBOOK_OTP, data: req_login.fb })
            instance.setState({ isloading: false })
            return
          }
          Alert.alert('Đã có lỗi xảy ra vui lòng thử lại sau')


        }
      },
      function (error) {
        instance.setState({ isloading: false })
        console.log("Login fail with error: " + error);
      }
    );
  }
  onLoginByApple = async () => {
    const { componentId } = this.props;

    this.setState({ isloading: true })
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [
        appleAuth.Scope.EMAIL,
        appleAuth.Scope.FULL_NAME,
      ],
    });
    console.log("appleAuthRequestResponse", appleAuthRequestResponse)
    // get current authentication state for user
    // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
    const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);

    // use credentialState response to ensure the user is authenticated
    if (credentialState === appleAuth.State.AUTHORIZED) {
      console.log("credentialState", credentialState)
      let req_login = await loginByAppleAPI(
        {
          apple_id: appleAuthRequestResponse?.user,
          authorization_code: appleAuthRequestResponse?.authorizationCode
        })
      if (!req_login) {
        this.setState({ isloading: false })
        return
      }
      if (req_login && !req_login.err && req_login.data) {
        setToken(req_login.token)
        await setLocalData(JSON.stringify(req_login.data))
        this.setState({ isloading: false })
        setRootToHome()
        return
      }
      if (req_login && req_login?.err && req_login.data == 'Customer not found') {
        pushToEnterPhoneNumberScreen(componentId, { type: typeOTP.LOGIN_APPLE_OTP, data: appleAuthRequestResponse })
        this.setState({ isloading: false })
        return
      }
      Alert.alert('Đã có lỗi xảy ra vui lòng thử lại sau')
    }
  }
  render() {
    const window = Dimensions.get('window');
    const widthSize = scale(230)
    return (
      <View style={{ flex: 1, justifyContent: "flex-end", backgroundColor: color.ORANGE_COLOR_100, alignItems: 'center' }}>


        <View style={{
          alignSelf: 'center',
          width: window.width,
          overflow: 'hidden',
          height: window.height * 2 / 3,
          position: 'absolute',
        }}>

          <View style={{
            borderRadius: window.width - scale(20),
            width: window.width * 2,
            height: window.width * 2,
            marginLeft: -(window.width / 2),
            // position: 'absolute',
            bottom: 0,
            overflow: 'hidden',
            backgroundColor: 'white',
          }}>

          </View>
        </View>
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: widthSize * 3 / 5, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ height: widthSize, width: widthSize, backgroundColor: color.ORANGE_COLOR_400, borderRadius: widthSize / 2, alignItems: "center", justifyContent: "center" }}>
            <Image style={{ width: widthSize * 4 / 5, height: widthSize * 4 / 5, resizeMode: "cover", tintColor: 'white' }} source={require('./res/ic_logo_trans.png')} />
          </View>
          <Text style={{ fontSize: scale(16), fontWeight: "600", marginTop: scale(20) }}>Nhập số điện thoại để tiếp tục</Text>
          <TouchableOpacity
            onPress={this.onClickPhoneNumber}
            activeOpacity={1}
            style={{
              flexDirection: 'row',
              width: width - scale(40),
              borderRadius: scale(8),
              borderWidth: 1,
              borderColor: color.ORANGE_COLOR_400,
              height: scale(47),
              alignItems: 'center', marginTop: scale(15)
            }}>
            <Image style={{ width: scale(17), height: scale(14), marginLeft: scale(12) }} source={require('./res/ic_flag_vn.png')} />
            <Text style={{ fontSize: scale(14), marginLeft: scale(5) }}>+84</Text>
            <View style={{ width: 1, height: scale(16), backgroundColor: 'gray', marginHorizontal: scale(8) }} />
            <Text style={{ fontSize: scale(15), color: 'gray' }}>Số điện thoại</Text>
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: scale(20) }}>
            <View style={{ flex: 1, height: 1, backgroundColor: color.GRAY_COLOR_200, marginHorizontal: scale(20) }} />
            <Text style={{ fontWeight: '500', color: color.GRAY_COLOR_400 }} >Tiếp tục với</Text>
            <View style={{ flex: 1, height: 1, backgroundColor: color.GRAY_COLOR_200, marginHorizontal: scale(20) }} />
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity
              onPress={this.onLoginByFacebook}
              activeOpacity={0.7}
              style={{
                marginTop: scale(10),
                backgroundColor: '#276EF1',
                width: scale(45),
                height: scale(45),
                borderRadius: scale(25),
                alignItems: "center",
                justifyContent: "center",
                marginHorizontal: scale(10)
              }}
            >
              <FontAwesome
                name='facebook'
                size={scale(25)}
                color='#FFFFFF'
              />
            </TouchableOpacity>
            {Platform.OS == 'ios' && <TouchableOpacity
              onPress={this.onLoginByApple}
              activeOpacity={0.7}
              style={{
                marginTop: scale(10),
                backgroundColor: 'black',
                width: scale(45),
                height: scale(45),
                borderRadius: scale(25),
                alignItems: "center",
                justifyContent: "center",
                marginHorizontal: scale(10)
              }}            >
              <MaterialCommunityIcons
                name='apple'
                size={scale(25)}
                color='#FFFFFF'
              />
            </TouchableOpacity>}
          </View>

        </View>
        <Spinner
          visible={this.state.isloading}
          color={color.ORANGE_COLOR_400}
        />
      </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen)

