import React, { useState, useEffect, PureComponent } from 'react'
import {
    Image,
    View,
    Text,
    TouchableOpacity,
    RefreshControl,
    Dimensions,
    Linking,
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
import { finishBookingAPI } from '../../../api/bookingApi'
import { color } from '../../../constant/color'
import moment from 'moment'
import _ from 'lodash';
import actionsHome from '../../HomeScreen/redux/actions'
import Modal from "react-native-modal";

const { width, height } = Dimensions.get('window')

class BookingProcessing extends React.Component {
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
    renderPayment = () => {
        return <View style={{ marginHorizontal: scale(10) }}>
            <Text style={{ fontSize: scale(15), fontWeight: '600', color: color.GRAY_COLOR_500, marginTop: scale(10) }}>Cách thanh toán</Text>
            <View style={{ flexDirection: 'row', alignItems: "center", marginTop: scale(10) }}>
                <View style={{ height: scale(20), width: scale(20), borderRadius: scale(5), borderWidth: 2, alignItems: 'center', justifyContent: "center" }}>
                    <Text style={{ fontWeight: '600' }}>đ</Text>
                </View>
                <Text style={{ marginLeft: scale(10), fontSize: scale(14) }}>Thanh toán bằng tiền mặt</Text>
            </View>
            <View style={{ height: scale(6), backgroundColor: color.GRAY_COLOR_200, marginTop: scale(10), opacity: 0.7 }} />

        </View>
    }


    renderPrice = () => {
        const { seat } = this.props?.currentBooking;
        const { price } = this.props?.currentBooking;
        return <View style={{ flexDirection: 'row', justifyContent: "space-between", marginHorizontal: scale(10), marginVertical: scale(10), alignItems: "center" }}>
            <Text style={{ fontSize: scale(14), fontWeight: '600', color: color.GRAY_COLOR_500 }}>Giá tiền: </Text>
            <Text style={{ fontSize: scale(16), fontWeight: '600' }}>{new Intl.NumberFormat().format(price)} đ</Text>
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
    renderLine = () => {
        return <View style={{ height: 0.8, opacity: 0.5, backgroundColor: color.GRAY_COLOR_400, marginVertical: scale(5) }} />

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
        const { onNavigationBack } = this.props;
        onNavigationBack();

    }
    callNumber = phone => {
        let phoneNumber = phone;
        if (Platform.OS !== 'android') {
            phoneNumber = `telprompt:${phone}`;
        }
        else {
            phoneNumber = `tel:${phone}`;
        }
        Linking.canOpenURL(phoneNumber)
            .then(supported => {
                if (!supported) {
                    Alert.alert('Phone number is not available');
                } else {
                    return Linking.openURL(phoneNumber);
                }
            })
            .catch(err => console.log(err));
    };
    renderInfoDriver = () => {
        const { currentBooking } = this.props;
        const userInfo = currentBooking.driver_id;
        return <View style={{ marginHorizontal: scale(10) }}>
            <Text style={{ fontSize: scale(13), fontWeight: 'bold', color: color.GRAY_COLOR_500, marginVertical: scale(5) }}>Thông tin nhà xe</Text>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                    <Image style={{ width: scale(36), height: scale(36) }} source={require('../res/ic_avatar.png')} />
                    <View style={{ marginLeft: scale(10) }}>
                        <Text style={{ fontSize: scale(16), fontWeight: "600" }}>{userInfo.name}</Text>
                        <Text style={{ fontSize: scale(15), fontWeight: "400", paddingTop: scale(2) }}>{userInfo.phone}</Text>
                    </View>
                </View>
                <TouchableOpacity onPress={() => this.callNumber(userInfo.phone)} style={{ width: scale(36), height: scale(36), borderRadius: scale(18), backgroundColor: color.MAIN_COLOR, alignItems: "center", justifyContent: "center" }}>
                    <MaterialCommunityIcons
                        name='phone-outgoing-outline'
                        size={scale(23)}
                        color="#FFFFFF"
                        containerStyle={{

                        }}
                    />
                </TouchableOpacity>
            </View>
        </View>
    }
    onShowMap = () => {
        const { inDecreaseHeiht } = this.props;
        inDecreaseHeiht();
    }
    renderPrice_Coupon = () => {
        const { seat, coupon_code } = this.props?.currentBooking;
        const { lst_coupon } = this.props;
        const { price } = this.props?.currentBooking;
        if (!coupon_code) {
            return
        }
        let crr_coupon = lst_coupon.find(vl => {
            return vl.code == coupon_code
        })


        if (crr_coupon) {
            const { amount, max_apply, condition } = crr_coupon;
            let reduce_value = 0;
            if (amount < 100) {
                reduce_value = price * amount / 100;
                if (reduce_value > max_apply) {
                    reduce_value = max_apply
                }
            } else {
                reduce_value = amount;
            }
            let price_coupon = price >= condition?.min_Price ? price - reduce_value : price;
            return <View style={{ flexDirection: 'row', justifyContent: "space-between", marginHorizontal: scale(10), marginVertical: scale(10), alignItems: "center" }}>
                <Text style={{ fontSize: scale(14), fontWeight: '600', color: color.GRAY_COLOR_500 }}>Tổng tiền: </Text>
                <Text style={{ fontSize: scale(16), fontWeight: '600' }}>{new Intl.NumberFormat().format(price_coupon)}đ</Text>


            </View>
        }

    }
    renderReduceValue = () => {
        const { seat, coupon_code } = this.props?.currentBooking;
        const { lst_coupon } = this.props;
        const { price } = this.props?.currentBooking;
        if (!coupon_code) {
            return
        }
        let crr_coupon = lst_coupon.find(vl => {
            return vl.code == coupon_code
        })
        if (crr_coupon) {
            const { amount, max_apply, condition } = crr_coupon;

            let reduce_value = 0;
            if (amount < 100) {
                reduce_value = price * amount / 100;
                if (reduce_value > max_apply) {
                    reduce_value = max_apply
                }
            } else {
                reduce_value = amount;
            }
            if (price < condition?.min_Price) {
                reduce_value = 0;
            }
            return <View style={{ flexDirection: 'row', justifyContent: "space-between", marginHorizontal: scale(10), marginVertical: scale(10), alignItems: "center" }}>
                <Text style={{ fontSize: scale(14), fontWeight: '600', color: color.GRAY_COLOR_500 }}>Mã giảm giá: </Text>
                <Text style={{ fontSize: scale(14), fontWeight: '500', color: color.ORANGE_COLOR_400 }}>
                    {new Intl.NumberFormat().format(reduce_value)}đ
                </Text>
            </View>
        }

    }
    // renderSuggestion = () => {
    //     const { suggestion_pick } = this.props.currentBooking
    //     console.log("this.props.currentBooking", this.props.currentBooking)
    //     return <View style={{ marginHorizontal: scale(10), marginVertical: scale(10) }}>
    //         <View style={{ flexDirection: 'row' }}>
    //             <Image style={{ width: scale(20), height: scale(20), tintColor: color.ORANGE_COLOR_400 }} source={require('../res/ic_help.png')} />
    //             <View style={{ marginHorizontal: scale(10), flex: 1 }}>
    //                 <Text style={{ fontSize: scale(12), paddingTop: scale(3) }}>Gợi ý điểm đón</Text>
    //                 <Text numberOfLines={1} style={{ fontSize: scale(14), fontWeight: "600", paddingTop: scale(3) }}>{suggestion_pick.address}</Text>
    //             </View>
    //             <TouchableOpacity onPress={this.onShowMap} activeOpacity={0.6} style={{ width: scale(50), alignItems: 'center', justifyContent: 'center' }}>
    //                 <FontAwesomeIcon
    //                     name='map'
    //                     size={scale(20)}
    //                     color={color.GREEN_COLOR_300}

    //                 />
    //                 <Text style={{ fontSize: scale(11), textAlign: 'center' }}>Bản đồ</Text>
    //             </TouchableOpacity>
    //         </View>

    //     </View>
    // }
    onFinishBooking = async () => {
        const { currentBooking, updateCurrentBooking } = this.props;
        Alert.alert(
            'Kết thúc chuyến đi',
            'Bạn đã hoàn thành chuyến đi rồi chứ?',
            [
                {
                    text: 'Huỷ',

                    onPress: () => console.log('cancel'),
                    style: 'cancel',
                },

                {
                    text: 'Hoàn thành',
                    onPress: async () => {
                        const reqFinish = await finishBookingAPI(currentBooking._id)
                        if (!reqFinish.err) {
                            updateCurrentBooking(reqFinish.data)
                        } else {
                            Alert.alert('Đã có lỗi xảy ra. Vui lòng thử lại sau')
                        }

                    },
                },
            ],
        );

    }

    render() {
        const { onNavigationBack, isInCreaseHeight } = this.props;
        const { coupon_code } = this.props?.currentBooking;

        if (isInCreaseHeight) {
            return (
                <View style={{ flex: 1, backgroundColor: "#FFFFFF", borderRadius: scale(20) }}>
                    <KeyboardAwareScrollView
                        innerRef={ref => {
                            this.scroll = ref
                        }}
                        style={{ flex: 1 }}
                        showsVerticalScrollIndicator={false}>
                        <View style={{ flex: 1 }}>
                            <View style={{ marginBottom: scale(10), flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                <View style={{ marginHorizontal: scale(10), flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ fontSize: scale(20), fontWeight: 'bold' }}>Xe tiện chuyến - Tài xế đã nhận chuyến</Text>

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
                            {coupon_code && this.renderReduceValue()}
                            {coupon_code && this.renderPrice_Coupon()}
                            {this.renderLine()}
                            {this.renderInfoDriver()}
                            {/* {this.renderLine()}
                            {this.renderSuggestion()} */}
                            {this.renderLine()}
                            {this.renderPayment()}
                        </View>
                        <View style={{ flexDirection: 'row', height: scale(40), width: width, marginVertical: scale(20) }}>
                            <TouchableOpacity onPress={() => this.onBack()} style={{ flex: 1, height: scale(40), alignItems: 'center', justifyContent: 'center', backgroundColor: color.GREEN_COLOR_400, borderRadius: scale(15), alignSelf: "center", marginHorizontal: scale(10) }}>
                                <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Quay lại</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.onFinishBooking()} style={{ flex: 1, height: scale(40), alignItems: 'center', justifyContent: 'center', backgroundColor: color.ORANGE_COLOR_400, borderRadius: scale(15), alignSelf: "center", marginHorizontal: scale(10) }}>
                                <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Kết thúc chuyến</Text>
                            </TouchableOpacity>
                        </View>
                    </KeyboardAwareScrollView>


                </View >
            )

        }
        return (
            <View style={{ flex: 1, backgroundColor: "#FFFFFF", borderRadius: scale(20) }}>
                <KeyboardAwareScrollView
                    innerRef={ref => {
                        this.scroll = ref
                    }}
                    showsVerticalScrollIndicator={false}>
                    <View style={{ marginBottom: scale(10), flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <View style={{ marginHorizontal: scale(10), flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ fontSize: scale(20), fontWeight: 'bold' }}>Xe tiện chuyến - Tài xế đã nhận chuyến</Text>

                        </View>

                    </View>
                    <View style={{ width: width, height: 1, backgroundColor: color.GRAY_COLOR_400, opacity: 0.5 }} />

                    <View style={{ marginHorizontal: scale(10), marginTop: scale(5) }}>
                        <Text style={{ fontSize: scale(13), fontWeight: 'bold', color: color.GRAY_COLOR_500 }}>Thông tin chuyến xe</Text>
                    </View>
                    {this.renderInfo()}

                </KeyboardAwareScrollView>

            </View >
        )

    }

}


const mapStateToProps = (state) => {
    return {
        currentBooking: state.HomeReducer.currentBooking,
        lst_coupon: state.HomeReducer.lst_coupon,

    }
}
function mapDispatchToProps(dispatch) {
    return {
        updateCurrentBooking: (dt) => {
            dispatch(actionsHome.action.updateCurrentBooking(dt));
        },

        dispatch,
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(BookingProcessing);

