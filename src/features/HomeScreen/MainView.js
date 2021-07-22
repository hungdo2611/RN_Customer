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
    Keyboard,
    SafeAreaView,
    ActivityIndicator,
    Alert,
    ScrollView
} from 'react-native'

import { connect } from 'react-redux'


import { scale } from '../../ultis/scale'

import { color } from '../../constant/color'

import _ from 'lodash';

const { width, height } = Dimensions.get('window')

export default class MainView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {
        const { isInCreaseHeight } = this.props;
        const widthBox = (width - 50) / 3
        console.log("this.props", this.props)
        return (
            <View style={{ flex: 1, backgroundColor: "#FFFFFF", borderRadius: scale(20) }}>
                <View style={{ backgroundColor: color.GRAY_COLOR_50, borderRadius: scale(10), height: scale(50), alignItems: 'center', flexDirection: "row" }}>
                    <Image style={{
                        height: scale(50),
                        width: scale(70),
                        transform: [{ rotate: '8deg' }],
                    }} source={require('./res/ic_car_head.png')} />
                    <View style={{ marginLeft: scale(10) }}>
                        <Text style={{ fontSize: scale(12), color: color.GRAY_COLOR_500, fontWeight: '500' }}>Địa chỉ của bạn</Text>
                        <Text style={{ fontSize: scale(11), fontWeight: 'bold' }}>Hà Nội</Text>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'flex-end', flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ width: scale(1), height: scale(20), backgroundColor: color.GRAY_COLOR_500 }} />
                        <Text style={{ fontSize: scale(11), fontWeight: '600', marginHorizontal: scale(12) }}>Bản đồ</Text>
                    </View>
                </View>
                <ScrollView scrollEnabled={isInCreaseHeight} showsVerticalScrollIndicator={false}>

                    <View style={{ flexDirection: 'row', marginTop: scale(20) }}>

                        <View style={{ width: widthBox, height: widthBox, margin: 5, backgroundColor: color.GRAY_COLOR_50, borderRadius: scale(10) }}>
                            <Text style={{ fontSize: scale(13), fontWeight: 'bold', padding: scale(10) }}>Xe Khách</Text>
                            <Image resizeMode="stretch" style={{ width: widthBox / 2 + scale(20), height: widthBox / 2, position: "absolute", bottom: 10, right: 10 }} source={require('./res/ic_bus.png')} />

                        </View>
                        <View style={{ width: widthBox, height: widthBox, margin: 5, backgroundColor: color.GRAY_COLOR_50, borderRadius: scale(10) }}>
                            <Text style={{ fontSize: scale(13), fontWeight: 'bold', padding: scale(10) }}>Xe tiện chuyến</Text>
                            <Image resizeMode="stretch" style={{ width: widthBox / 2 + scale(20), height: widthBox / 2, position: "absolute", bottom: 5, right: 5 }} source={require('./res/ic_tienchuyen.png')} />

                        </View>
                        <View style={{ width: widthBox, height: widthBox, margin: 5, backgroundColor: color.GRAY_COLOR_50, borderRadius: scale(10) }}>
                            <Text style={{ fontSize: scale(13), fontWeight: 'bold', padding: scale(10) }}>Gửi hàng</Text>
                            <Image resizeMode="stretch" style={{ width: widthBox / 2 + scale(20), height: widthBox / 2, position: "absolute", bottom: 5, right: 5 }} source={require('./res/ic_shipping.png')} />

                        </View>
                    </View>

                </ScrollView>
            </View>
        )
    }
}





