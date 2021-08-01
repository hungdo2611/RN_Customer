import React, { useState, useEffect, PureComponent } from 'react'
import {
    Image,
    View,
    Text,
    TouchableOpacity,
    RefreshControl,
    Dimensions,
    TextInput,
    KeyboardAvoidingView,
    FlatList,
    Keyboard,
    SafeAreaView,
    ActivityIndicator,
    Alert,
    ScrollView,
    Animated
} from 'react-native'

import { connect } from 'react-redux'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';
import EvilIconsIcon from 'react-native-vector-icons/EvilIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { AutoCompleteAPI, getFromLocationId } from '../../api/MapApi';
import { scale } from '../../ultis/scale'
import { RecyclerListView, LayoutProvider, DataProvider } from 'recyclerlistview';
import {
    Placeholder,
    PlaceholderMedia,
    PlaceholderLine,
    Fade
} from "rn-placeholder";
import { color } from '../../constant/color'

import _ from 'lodash';

const { width, height } = Dimensions.get('window')

export default class AdditionalInfo extends React.Component {
    constructor(props) {
        super(props);

    }

    onBack = () => {
        const { navigation } = this.props;
        navigation.pop();

    }

    render() {
        const { isInCreaseHeight, inCreaseHeight, navigation } = this.props;
        return (
            <View style={{ flex: 1, backgroundColor: "#FFFFFF", borderRadius: scale(20) }}>
                <KeyboardAvoidingView
                    style={{
                        flex: 1,

                    }}
                    behavior={Platform.OS == 'ios' ? 'padding' : ''}>
                    <View style={{ marginBottom: scale(10) }}>
                        <View style={{ marginHorizontal: scale(10), flexDirection: 'row', alignItems: 'center' }}>
                            <TouchableOpacity onPress={this.onBack} style={{ paddingRight: 0 }}>
                                <MaterialIcons
                                    name='arrow-back-ios'
                                    size={scale(22)}
                                    color="black"
                                />
                            </TouchableOpacity>
                            <Text style={{ fontSize: scale(20), fontWeight: 'bold' }}>Xe Khách</Text>

                        </View>
                        <View style={{ width: width, height: 0.8, backgroundColor: color.GRAY_COLOR_400, opacity: 0.5, marginTop: scale(8) }} />
                    </View>

                </KeyboardAvoidingView>
            </View>
        )
    }
}





