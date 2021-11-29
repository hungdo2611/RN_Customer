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
import { color } from '../../constant/color'

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
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: widthSize + scale(50), justifyContent: 'center', alignItems: 'center' }}>
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
              borderColor: 'gray',
              height: scale(47),
              alignItems: 'center', marginTop: scale(15)
            }}>
            <Image style={{ width: scale(17), height: scale(14), marginLeft: scale(12) }} source={require('./res/ic_flag_vn.png')} />
            <Text style={{ fontSize: scale(14), marginLeft: scale(5) }}>+84</Text>
            <View style={{ width: 1, height: scale(16), backgroundColor: 'gray', marginHorizontal: scale(8) }} />
            <Text style={{ fontSize: scale(15), color: 'gray' }}>Số điện thoại</Text>
          </TouchableOpacity>

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

