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
import CheckBox from '@react-native-community/checkbox';

import { connect } from 'react-redux'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';
import EvilIconsIcon from 'react-native-vector-icons/EvilIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { scale } from '../../../ultis/scale'

import { color } from '../../../constant/color'
import moment from 'moment'
import _ from 'lodash';


const { width, height } = Dimensions.get('window')

class WaitingDriverScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            seat: 1,
            selectAll: false,
            lst_select: [],
            fromTime: moment(new Date()).add(0.25, 'hours').format('HH:mm')
        }
    }
    componentDidMount() {
        const { data_diem_don, data_diem_den, maxPrice, minPrice } = this.props?.route?.params;
        console.log('maxPrice', maxPrice)
        console.log('minPrice', minPrice)
    }


    onBack = () => {
        const { navigation, onBack } = this.props;
        navigation.pop();
    }

    renderInfo = () => {
        const { data_diem_don, data_diem_den, maxPrice, minPrice } = this.props?.route?.params;
        console.log('maxPrice', maxPrice)
        console.log('minPrice', minPrice)

        return <View style={{ marginHorizontal: scale(10) }}>
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
                    <View style={{ flex: 1, justifyContent: "center" }}>
                        <Text style={{ fontSize: scale(13), fontWeight: '600' }}>{data_diem_don?.address?.label ? data_diem_don?.address?.label : 'Vị trí của bạn'}</Text>
                    </View>
                    <View style={{ height: 0.5, opacity: 0.5, backgroundColor: color.GRAY_COLOR_400 }} />
                    <View style={{ flex: 1, justifyContent: "center" }}>
                        <Text style={{ fontSize: scale(13), fontWeight: '600' }}>{data_diem_den?.address?.label}</Text>
                    </View>

                </View>
            </View>


        </View>
    }

    render() {

        return (
            <View style={{ flex: 1, backgroundColor: "#FFFFFF", borderRadius: scale(20) }}>
                <KeyboardAwareScrollView
                    innerRef={ref => {
                        this.scroll = ref
                    }}
                    showsVerticalScrollIndicator={false}>
                    <View style={{ marginBottom: scale(10), flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <View style={{ marginHorizontal: scale(10), flexDirection: 'row', alignItems: 'center' }}>
                            <TouchableOpacity onPress={this.onBack} style={{ paddingRight: 0 }}>
                                <MaterialIcons
                                    name='arrow-back-ios'
                                    size={scale(22)}
                                    color="black"
                                />
                            </TouchableOpacity>
                            <Text style={{ fontSize: scale(20), fontWeight: 'bold' }}>Xe Khách - Đang tìm xe</Text>

                        </View>

                    </View>
                    <View style={{ width: width, height: 1, backgroundColor: color.GRAY_COLOR_400, opacity: 0.5 }} />

                    <View style={{ marginHorizontal: scale(10), marginTop: scale(5) }}>
                        <Text style={{ fontSize: scale(13), fontWeight: 'bold', color: color.GRAY_COLOR_500 }}>Thông tin chuyến xe</Text>
                    </View>
                    {/* {this.renderInfo()} */}


                </KeyboardAwareScrollView>

            </View>
        )
    }
}


const mapStateToProps = (state) => {
    return {

    }
}

export default connect(
    mapStateToProps,
    null,
)(WaitingDriverScreen);

