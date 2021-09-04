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
import { cancelBookingAPI } from '../../../api/bookingApi'
import { color } from '../../../constant/color'
import moment from 'moment'
import _ from 'lodash';
import actions from '../redux/actions'
import Modal from "react-native-modal";

const { width, height } = Dimensions.get('window')

class UserCancelBooking extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            seat: 1,
            selectAll: false,
            lst_select: [],
            fromTime: moment(new Date()).add(0.25, 'hours').format('HH:mm'),
            reason: '',
            err: false,
            isCancel: false,
            message: '',
            isloading: false
        }
    }
    componentDidMount() {

    }


    renderPrice = () => {
        const { seat } = this.props?.currentBooking;
        const { max_price, min_price } = this.props?.currentBooking.range_price;
        return <View style={{ flexDirection: 'row', justifyContent: "space-between", marginHorizontal: scale(10), marginVertical: scale(10), alignItems: "center" }}>
            <Text style={{ fontSize: scale(14), fontWeight: '600', color: color.GRAY_COLOR_500 }}>Giá tiền: </Text>
            {max_price == min_price && <Text style={{ fontSize: scale(16), fontWeight: '600' }}>{new Intl.NumberFormat().format(max_price * seat)} VND</Text>}
            {max_price != min_price && <View>
                <Text>Từ {new Intl.NumberFormat().format(min_price * seat)} VND - {new Intl.NumberFormat().format(max_price * seat)} VND</Text>
            </View>}

        </View>
    }
    renderSeat = () => {
        const { seat } = this.props?.currentBooking;
        return <View style={{ flexDirection: 'row', justifyContent: "space-between", marginHorizontal: scale(10), marginVertical: scale(5), alignItems: "center" }}>
            <Text style={{ fontSize: scale(14), fontWeight: '600', color: color.GRAY_COLOR_500 }}>Số người: </Text>
            <View style={{ flexDirection: "row", alignItems: 'center' }}>
                <View style={{ width: scale(28), height: scale(28), borderRadius: scale(14), backgroundColor: color.GRAY_COLOR_200, alignItems: 'center', marginRight: scale(12), justifyContent: 'center' }}>
                    <Text style={{}}>{seat < 10 ? `0${seat}` : seat}</Text>
                </View>
                <Text>Người</Text>
            </View>

        </View>

    }
    renderTime = () => {
        const { time_start } = this.props?.currentBooking;
        const time = moment(time_start * 1000).format('HH:mm');
        return <View style={{ flexDirection: 'row', justifyContent: "space-between", marginHorizontal: scale(10), marginVertical: scale(5), alignItems: "center" }}>
            <Text style={{ fontSize: scale(14), fontWeight: '600', color: color.GRAY_COLOR_500 }}>Thời gian</Text>
            <View
                activeOpacity={0.5}
                style={{ flexDirection: 'row', alignItems: 'center', borderRadius: scale(10), borderWidth: 0.7, borderColor: color.GRAY_COLOR_400, width: scale(90) }}>
                <Text style={{ marginHorizontal: scale(10), fontSize: scale(14), fontWeight: '500', paddingVertical: scale(7) }}>{time}</Text>
                <MaterialCommunityIcons
                    name='clock-outline'
                    size={scale(22)}
                    color={color.GRAY_COLOR_400}
                    style={{ marginLeft: scale(7), opacity: 0.6 }}
                />
            </View>
        </View>
    }
    renderTimeDay = () => {
        const { time_start } = this.props?.currentBooking;
        const day_select = moment(time_start * 1000).format('DD/MM/YYYY');

        return <View style={{ flexDirection: 'row', justifyContent: "space-between", marginHorizontal: scale(10), marginVertical: scale(5), alignItems: "center" }}>
            <Text style={{ fontSize: scale(14), fontWeight: 'bold', color: color.GRAY_COLOR_500 }}>Ngày </Text>
            <View
                style={{ flexDirection: 'row', alignItems: 'center', borderRadius: scale(10), borderWidth: 0.7, borderColor: color.GRAY_COLOR_400, width: scale(120) }}>
                <Text style={{ marginHorizontal: scale(7), fontSize: scale(14), fontWeight: '500', paddingVertical: scale(7) }}>{day_select}</Text>
                <MaterialCommunityIcons
                    name='calendar'
                    size={scale(22)}
                    color={color.GRAY_COLOR_500}
                    style={{ marginLeft: scale(5), opacity: 0.6 }}
                />
            </View>
        </View>
    }

    renderInfo = () => {
        const { from, to } = this.props?.currentBooking;


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
                        <Text style={{ fontSize: scale(13), fontWeight: '600' }}>{from.address ? from.address : 'Vị trí của bạn'}</Text>
                    </View>
                    <View style={{ height: 0.5, opacity: 0.5, backgroundColor: color.GRAY_COLOR_400 }} />
                    <View style={{ flex: 1, justifyContent: "center" }}>
                        <Text style={{ fontSize: scale(13), fontWeight: '600' }}>{to?.address}</Text>
                    </View>

                </View>
            </View>


        </View>
    }

    onBack = () => {
        const { onNavigationBack, updateCurrentBooking } = this.props;
        onNavigationBack();
        setTimeout(() => {
            updateCurrentBooking(null);

        }, 100)

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
                            <Text style={{ fontSize: scale(20), fontWeight: 'bold' }}>Xe Khách - Đã Huỷ Chuyến</Text>

                        </View>

                    </View>
                    <View style={{ width: width, height: 1, backgroundColor: color.GRAY_COLOR_400, opacity: 0.5 }} />

                    <View style={{ marginHorizontal: scale(10), marginTop: scale(5) }}>
                        <Text style={{ fontSize: scale(13), fontWeight: 'bold', color: color.GRAY_COLOR_500 }}>Thông tin chuyến xe</Text>
                    </View>
                    {this.renderInfo()}
                    {this.renderSeat()}
                    {this.renderTime()}
                    {this.renderTimeDay()}
                    {this.renderPrice()}
                    <TouchableOpacity onPress={() => this.onBack()} style={{ width: scale(150), height: scale(40), alignItems: 'center', justifyContent: 'center', backgroundColor: color.GREEN_COLOR_400, borderRadius: scale(15), alignSelf: "center" }}>
                        <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Quay lại</Text>
                    </TouchableOpacity>
                </KeyboardAwareScrollView>

            </View >
        )
    }
}


const mapStateToProps = (state) => {
    return {
        currentBooking: state.SelectDesOriginReducer.currentBooking,

    }
}
function mapDispatchToProps(dispatch) {
    return {
        updateCurrentBooking: (dt) => {
            dispatch(actions.action.updateCurrentBooking(dt));
        },

        dispatch,
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(UserCancelBooking);

