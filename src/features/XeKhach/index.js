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
    ScrollView,
    Animated
} from 'react-native'

import { connect } from 'react-redux'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';
import EvilIconsIcon from 'react-native-vector-icons/EvilIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { AutoCompleteAPI } from '../../api/MapApi';
import { scale } from '../../ultis/scale'

import { color } from '../../constant/color'

import _ from 'lodash';

const { width, height } = Dimensions.get('window')

export default class XeKhachView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            diem_don: '',
            isFocus: false,
            isloading: false
        };
    }
    componentDidMount() {

    }
    renderLow = () => {
        const { isInCreaseHeight, inCreaseHeight } = this.props;

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
                        height: scale(40),
                        borderRadius: scale(15),
                        borderColor: color.GRAY_COLOR_400,
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
                        style={{ flex: 1, marginHorizontal: scale(7), fontSize: scale(13), color: color.GRAY_COLOR_400 }}
                    >
                        Bạn muốn đi đâu
                        </Text>
                    <EvilIconsIcon
                        name='search'
                        size={scale(18)}
                        color={color.GRAY_COLOR_400}
                        style={{ marginRight: scale(10) }}
                        containerStyle={{

                        }} />
                </TouchableOpacity>
            </View>
        )
    }
    onChangeDiemDen = async (txt) => {
        if (txt.trim().length > 2 && txt.trim() != '') {
            console.log("text", txt)
            let autocomplete = await AutoCompleteAPI(txt);
            console.log("autocomplete", autocomplete)
        }
    }
    renderHight = () => {
        const { isFocus, diem_don } = this.state;
        const { coord } = this.props;
        return (
            <View>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        height: scale(80),
                        borderRadius: scale(15),
                        borderColor: color.GRAY_COLOR_400,
                        backgroundColor: color.GRAY_COLOR_100,
                        marginVertical: scale(7),
                        borderStartWidth: 0.3,
                        borderEndWidth: 0.3,
                        borderTopWidth: 0.3,
                        borderBottomWidth: 0.3,
                        overflow: 'hidden',
                    }}
                >
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <FontAwesomeIcon
                            name='arrow-circle-up'
                            size={scale(17)}
                            color={color.GREEN_COLOR_300}
                            style={{ marginLeft: scale(10) }}
                            containerStyle={{

                            }}
                        />
                        <MaterialCommunityIcons
                            name='dots-vertical'
                            size={scale(14)}
                            color={color.GRAY_COLOR_400}
                            style={{ marginLeft: scale(10), opacity: 0.6 }}
                            containerStyle={{

                            }}
                        />
                        <MaterialCommunityIcons
                            name='record-circle'
                            size={scale(20)}
                            color={color.ORANGE_COLOR_400}
                            style={{ marginLeft: scale(10) }}
                            containerStyle={{

                            }}
                        />
                    </View>
                    <View style={{ flex: 1, marginHorizontal: scale(10), paddingVertical: scale(5) }}>
                        <TextInput
                            onFocus={() => {
                                this.setState({ isFocus: true });
                            }}
                            onBlur={() => {
                                this.setState({ isFocus: false });
                            }}
                            defaultValue={diem_don == '' && !isFocus ? 'Vị trí hiện tại' : diem_don}
                            style={{ flex: 1 }}
                            placeholder="Tìm điểm đón" />
                        <View style={{ height: 0.5, opacity: 0.5, backgroundColor: color.GRAY_COLOR_400 }} />
                        <TextInput onChangeText={this.onChangeDiemDen} style={{ flex: 1 }} placeholder="Chọn điểm đến" />

                    </View>
                </View>
                <TouchableOpacity activeOpacity={0.7} style={{ flexDirection: "row", alignItems: 'center', marginVertical: scale(10) }}>
                    <FontAwesomeIcon
                        name='map'
                        size={scale(15)}
                        color={color.GREEN_COLOR_300}
                        style={{ marginLeft: scale(10) }}
                        containerStyle={{

                        }}
                    />
                    <Text style={{ fontSize: scale(14), marginLeft: scale(10) }}>Chọn bằng bản đồ</Text>
                </TouchableOpacity>
                <View style={{ height: 0.5, opacity: 0.7, width: '100%', alignSelf: "center", backgroundColor: color.GRAY_COLOR_400 }} />
            </View>
        )
    }

    render() {
        const { isInCreaseHeight, inCreaseHeight } = this.props;
        return (
            <View style={{ flex: 1, backgroundColor: "#FFFFFF", borderRadius: scale(20), marginHorizontal: scale(10) }}>
                <Text style={{ fontSize: scale(20), fontWeight: 'bold', marginBottom: scale(10) }}>Tìm Xe Khách</Text>
                {!isInCreaseHeight && this.renderLow()}
                {isInCreaseHeight && this.renderHight()}
            </View>
        )
    }
}





