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
import LinearGradient from 'react-native-linear-gradient';

import { connect } from 'react-redux'
import Action from './redux/actions'


import { scale } from '../../ultis/scale'
import styles from './SignInStyle/Login1ScreenStyle'
import {
  TextField,
  FilledTextField,
  OutlinedTextField,
} from 'react-native-material-textfield'

const { width, height } = Dimensions.get('window')



class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  async componentDidMount() {

  }
  render() {
    const window = Dimensions.get('window');
    return (
      <View style={{flex: 1, justifyContent:"flex-end", backgroundColor:'red'}}>


        <View style={{
          alignSelf: 'center',
          width: window.width,
          overflow: 'hidden',
          height: window.height / 1.3,
          position: 'absolute',
        }}>

          <View style={{
            borderRadius: window.width -20,
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
        <Text>hungdv</Text>
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

