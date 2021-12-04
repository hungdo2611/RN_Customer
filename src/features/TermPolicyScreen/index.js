import React, { useState, useEffect, PureComponent } from 'react'
import {
    View,
    Text,
    Dimensions,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard,
    SafeAreaView,
    TouchableOpacity,
    Platform,
    Image,
    Linking,
    Alert

} from 'react-native'

import { Navigation } from 'react-native-navigation';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux'

import _ from 'lodash';
import { scale } from '../../ultis/scale';
import { color } from '../../constant/color';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';

import { WebView } from 'react-native-webview';


const { width, height } = Dimensions.get('window')

const toastConfig = {
    /* 
      overwrite 'success' type, 
      modifying the existing `BaseToast` component
    */
    success: (props) => (
        <BaseToast
            {...props}
            style={{ borderLeftColor: color.GREEN_COLOR_300, paddingHorizontal: scale(10), height: scale(70), borderLeftWidth: scale(8) }}
            text1Style={{
                color: color.GREEN_COLOR_400,
                fontSize: 17
            }}
            text2Style={{
                fontSize: 15,
                color: 'black'
            }}
        />
    ),

    /*
      Reuse the default ErrorToast toast component
    */
    error: (props) => (
        <BaseToast
            {...props}
            style={{ borderLeftColor: color.RED_COLOR, height: scale(70), paddingHorizontal: scale(10), borderLeftWidth: scale(8) }}
            text1Style={{
                color: color.RED_COLOR,
                fontSize: 17
            }}
            text2Style={{
                fontSize: 15,
                color: 'black'
            }}
        />
    ),
    /* 
      or create a completely new type - `my_custom_type`,
      building the layout from scratch
    */
    my_custom_type: ({ text1, props, ...rest }) => (
        <View style={{ height: 60, width: '100%', backgroundColor: 'tomato' }}>
            <Text>{text1}</Text>
        </View>
    )
};
export class TermPolicy extends React.Component {
    constructor(props) {
        super(props);

    }

    async componentDidMount() {
    }

    renderHeader = () => {
        const { componentId } = this.props;
        return <View style={{ flexDirection: "row", alignItems: 'center', marginBottom: scale(10) }}>
            <TouchableOpacity activeOpacity={0.6} onPress={() => Navigation.pop(componentId)}>
                <Icon
                    name='arrow-back'
                    size={scale(22)}
                    color="black"
                    style={{ marginHorizontal: scale(10) }}
                />
            </TouchableOpacity>
        </View>
    }
    render() {

        return (
            <SafeAreaView style={{ flex: 1 }}>
                {this.renderHeader()}
                <WebView
                    style={{ flex: 1 }}
                    source={require('./index.html')} />

            </SafeAreaView>
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

export default connect(mapStateToProps, mapDispatchToProps)(TermPolicy)

