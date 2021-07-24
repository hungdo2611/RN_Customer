import React, { useState, useEffect, PureComponent } from 'react'
import {
    Image,
    View,
    Text,
    TouchableOpacity,
    TouchableHighlight,
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
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';
import EvilIconsIcon from 'react-native-vector-icons/EvilIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


import { scale } from '../../ultis/scale'

import { color } from '../../constant/color'

import _ from 'lodash';

const { width, height } = Dimensions.get('window')

export default class XeKhachView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }
    renderLow = () => {
        return (
            <View>
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                        inCreaseHeight();
                    }}
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        height: scale(34),
                        borderRadius: scale(15),
                        borderColor: color.GRAY_COLOR_500,
                        backgroundColor: color.GRAY_COLOR_100,
                        borderStartWidth: 0.3,
                        borderEndWidth: 0.3,
                        borderTopWidth: 0.3,
                        borderBottomWidth: 0.3,
                        marginVertical: scale(7),
                    }}>
                    <MaterialCommunityIcons
                        name='record-circle'
                        size={scale(18)}
                        color={color.ORANGE_COLOR_400}
                        style={{ marginLeft: scale(10) }}
                        containerStyle={{

                        }}
                    />
                    <Text
                        style={{ flex: 1, marginHorizontal: scale(7), fontSize: scale(12), color: color.GRAY_COLOR_500 }}
                    >
                        Bạn muốn đi đâu
                        </Text>
                    <EvilIconsIcon
                        name='search'
                        size={scale(18)}
                        color={color.GRAY_COLOR_500}
                        style={{ marginRight: scale(10) }}
                        containerStyle={{

                        }} />
                </TouchableOpacity>
            </View>
        )
    }
    renderHight = () => {
        return (
            <View>
                <View
                    underlayColor='#FFF'
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        height: scale(70),
                        borderRadius: scale(15),
                        borderColor: color.GRAY_COLOR_500,
                        backgroundColor: color.GRAY_COLOR_100,
                        marginVertical: scale(7),
                        borderStartWidth: 0.3,
                        borderEndWidth: 0.3,
                        borderTopWidth: 0.3,
                        borderBottomWidth: 0.3,
                        overflow: 'hidden',
                    }}
                >
                    <Text>abc</Text>
                </View>
            </View>
        )
    }

    render() {
        const { isInCreaseHeight, inCreaseHeight } = this.props;
        return (
            <View style={{ flex: 1, backgroundColor: "#FFFFFF", borderRadius: scale(20), marginHorizontal: scale(10) }}>
                <Text style={{ fontSize: scale(20), fontWeight: 'bold' }}>Tìm Xe Khách</Text>
                {!isInCreaseHeight && this.renderLow()}
                {isInCreaseHeight && this.renderHight()}
            </View>
        )
    }
}





