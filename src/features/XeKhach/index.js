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

export default class XeKhachView extends React.Component {
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
            <View style={{ flex: 1, backgroundColor: "#FFFFFF", borderRadius: scale(20), marginHorizontal: scale(10) }}>
                <Text>hungdv</Text>
            </View>
        )
    }
}





