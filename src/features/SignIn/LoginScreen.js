import React, { useState, useEffect, PureComponent } from 'react'
import {
  Image,
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  ScrollView,
  TouchableWithoutFeedback,
  Dimensions,
  Alert
} from 'react-native'

import { connect } from 'react-redux'
import Action from './redux/actions'
import Snackbar from 'react-native-snackbar'
import Navigator from './Navigator'

import { Navigation } from 'react-native-navigation';


import { scale } from '../ultis/scale'
import styles from './SignInStyle/Login1ScreenStyle'
import {
  TextField,
  FilledTextField,
  OutlinedTextField,
} from 'react-native-material-textfield'

const { width, height } = Dimensions.get('window')

const Login1Screen = (props) => {

  const [showPass, setShowPass] = useState(true)
  const [loggedIn, setloggedIn] = useState(false)

  const [userInfo, setuserInfo] = useState([])
  const [uname, setUname] = useState('')
  const [pwd, setPwd] = useState('')


  const _checkMobileVN = (phone) => {
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

  const _onLogin = (uname, pwd) => {
    props.onLogin(_checkMobileVN(uname), pwd, () => {
      _loginFail()
    }, (info) => {
      Navigator.setRoot()
    })
  }



  const _onRegister = () => {
    console.log("props", props)
    Navigator.showRegister(props.componentId)
  }

  useEffect(() => {

  }, [])

  const _loginFail = () => {
    Snackbar.show({
      text: 'Wrong user name or password',
      duration: Snackbar.LENGTH_INDEFINITE,
      action: {
        text: 'OK',
        textColor: 'red',
        onPress: () => {
          Snackbar.dismiss()
        },
      },
    })
  }



  useEffect(() => {
    return () => {
      Snackbar.dismiss()
    }
  }, [])


  return (
    <ImageBackground
      source={require('./res/bgr.jpeg')}
      style={styles.backgroundImage}>

      <ScrollView contentContainerStyle={{ flex: 1 }}>
        <View style={styles.container}>

          <View style={styles.formStyle}>

            <Image
              source={require('./res/logo_trans.png')}
              style={styles.imageLogo}
              resizeMode="contain"
            />
          </View>
          <View style={styles.viewInput}>


            <TextField
              autoCorrect={false}
              enablesReturnKeyAutomatically={true}
              onChangeText={text => setUname(text)}
              onSubmitEditing={() => { }}
              returnKeyType='next'
              label='Phone*'
              labelFontSize={scale(13)}
              textColor="#FFFFFF"
              baseColor="#FFFFFF"
              tintColor="#FFFFFF"
              containerStyle={{ width: width - scale(70) }}
              lineWidth={1}
            // error={errors.firstname}
            />
            <TextField
              autoCorrect={false}
              enablesReturnKeyAutomatically={true}
              onChangeText={text => setPwd(text)}
              secureTextEntry={showPass}
              returnKeyType='next'
              label='Password*'
              labelFontSize={scale(13)}
              textColor="#FFFFFF"
              baseColor="#FFFFFF"
              tintColor="#FFFFFF"
              containerStyle={{ width: width - scale(70) }}
              lineWidth={1}
              renderRightAccessory={() => (
                <TouchableWithoutFeedback
                  onPress={() => {
                    setShowPass(!showPass)
                  }}
                >
                  <Image
                    source={require('./res/eye.png')}
                    style={styles.inlineImg}
                  />
                </TouchableWithoutFeedback>
              )}
            // error={errors.firstname}
            />


          </View>
          <View style={styles.forgotPass}>
            <TouchableOpacity onPress={() => Navigator.showRegister(props.componentId, { isForgetPwd: true })}>
              <Text style={styles.textForgotPass}>Forget Password?</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.buttonSubmit} onPress={() => _onLogin(uname, pwd)}>
            <Text style={styles.textButton}>Login</Text>
          </TouchableOpacity>


          <View style={{ marginTop: scale(25) }}>
            <TouchableOpacity style={styles.buttonSignUp} onPress={_onRegister}>
              <Text style={styles.textSignUp1}>
                Are you have account?
            </Text>
              <Text style={styles.textSignUp2}>
                Register Now
            </Text>
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: scale(10) }}>

            </View>
          </View>


        </View>

        {/* <PureLoading visible={props.loading} /> */}
      </ScrollView>
    </ImageBackground>
  )

}

const mapStateToProps = (state) => {
  return {
    loading: state.common ? state.common.loading : true,
    user: state.auth ? state.auth.user : null,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onLogin: (uname, password, callbackFail, callbackSuccess) => {
      dispatch(Action.action.loginAction(uname, password, callbackFail, callbackSuccess))
    },
    onLoginWithSocial: (sId, socialToken, socialType, callbackFail, callbackSuccess) => {
      dispatch(Action.action.loginWithSocialAction(sId, socialToken, socialType, callbackFail, callbackSuccess))
    },

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login1Screen)

