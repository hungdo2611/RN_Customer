import React, { useState, useEffect, PureComponent } from 'react'
import {
  Image,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native'

import { connect } from 'react-redux'


import { scale } from '../../ultis/scale'

import { pushToEnterPhoneNumberScreen } from '../../NavigationController'

const { width, height } = Dimensions.get('window')



class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  async componentDidMount() {

  }
  onClickPhoneNumber = () => {
    const { componentId } = this.props;
    console.log("hungdv", componentId)

    pushToEnterPhoneNumberScreen(componentId);
  }
  render() {
    const window = Dimensions.get('window');
    return (
      <View style={{ flex: 1, justifyContent: "flex-end", backgroundColor: 'red', alignItems: 'center' }}>


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
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: width / 2 + scale(50), justifyContent: 'center', alignItems: 'center' }}>
          <Image style={{ width: width / 1.2, height: width / 1.2, resizeMode: "cover" }} source={require('./res/logo_trans.png')} />
          <Text style={{ fontSize: scale(14) }}>Enter your phone number to continue</Text>
          <TouchableOpacity
            onPress={this.onClickPhoneNumber}
            activeOpacity={1}
            style={{
              flexDirection: 'row',
              width: width - scale(40),
              borderRadius: scale(8),
              borderWidth: 1,
              borderColor: 'gray',
              height: scale(47),
              alignItems: 'center', marginTop: scale(10)
            }}>
            <Image style={{ width: scale(17), height: scale(14), marginLeft: scale(12) }} source={require('./res/ic_flag_vn.png')} />
            <Text style={{ fontSize: scale(14), marginLeft: scale(5) }}>+84</Text>
            <View style={{ width: 1, height: scale(16), backgroundColor: 'gray', marginHorizontal: scale(8) }} />
            <Text style={{ fontSize: scale(15), color: 'gray' }}>Phone number</Text>
          </TouchableOpacity>
          <View style={{ width: width - scale(40), flexDirection: 'row', alignItems: "center", marginTop: scale(35) }}>
            <View style={{ flex: 1, height: 1, backgroundColor: "#8A8A8F", opacity: 0.5 }} />
            <Text style={{ fontSize: scale(13), marginHorizontal: scale(20), color: '#8A8A8F' }}>Tiếp tục với</Text>
            <View style={{ flex: 1, height: 1, backgroundColor: "#8A8A8F", opacity: 0.5 }} />
          </View>
        </View>

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

