import React, { Component } from 'react'
import {
  ScrollView,
  Image,
  View,
  Text,
  KeyboardAvoidingView,
  TouchableOpacity,
  ImageBackground,
  Dimensions
} from 'react-native'
import { connect } from 'react-redux'

import styles from '../SignUpStyle/SignUp2ScreenStyle'
import Navigator from '../Navigator'
import action from '../redux/actions'
import { scale } from '../../ultis/scale'
import { TextField } from 'react-native-material-textfield'

const { width, height } = Dimensions.get('window')

class SignUp2Screen extends Component {
  constructor(props) {
    super(props)

    this.state = {
      value: '',
      valid: true,
      showMessage: false,
      phoneExisted: false,
    }
  }

  _onSubmitPhone = () => {

    Navigator.showOTP(this.state.value, this.props.componentId, { isForgetPwd: this.props.isForgetPwd })
  }

  render() {
    // phoneInput = useRef<PhoneInput>(null);
    console.log("man`2", this.props)
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
                    style={styles.imageLogo}
                    resizeMode="contain"
                  />
                  <Text style={styles.textHeader}>Wellcome!</Text>

                </View>
                <View style={styles.viewInput}>

                  <TextField
                    autoCorrect={false}
                    enablesReturnKeyAutomatically={true}
                    onChangeText={text => {
                      this.setState({
                        value: text,
                      })
                    }}
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
                  {this.state.phoneExisted ? <Text style={{ color: 'red', alignSelf: 'center', paddingTop: 5 }}>
                    This phone number already in use
                  </Text> : <View />}
                  {!this.state.valid ? <Text style={{ color: 'red', alignSelf: 'center', paddingTop: 5 }}>Invalid phone number</Text> : <View />}
                </View>
              </View>
              <TouchableOpacity style={styles.buttonSubmit} onPress={this._onSubmitPhone}>
                <Text style={styles.textButton}>Continue</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => Navigator.showLogin(this.props.componentId)}>
                <Text
                  style={{
                    marginTop: '5%',
                    alignSelf: 'center',
                    color: '#64AFFF',
                    fontSize: width * 0.045
                  }}>
                  Are you have account?
                  <Text style={{ fontSize: width * 0.045, color: 'white' }}> Register Now </Text>
                </Text>
              </TouchableOpacity>

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
    onCheckPhone: (phone, callbackFail, callbackSuccess) => {
      dispatch(action.checkPhoneAction(phone, callbackFail, callbackSuccess))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUp2Screen)
