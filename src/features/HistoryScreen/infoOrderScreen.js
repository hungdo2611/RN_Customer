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
    Platform,
    SafeAreaView,
    Linking,
    Alert,
    ScrollView
} from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { constant_type_status_booking } from '../BookingScreen/constant';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialIcons';
import { scale } from '../../ultis/scale'
import _ from 'lodash';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';
import { color } from '../../constant/color';
import { Navigation } from 'react-native-navigation';
import { CONSTANT_TYPE_BOOKING } from '../../constant'
import moment from 'moment';

const { width, height } = Dimensions.get('window')

class OrderInfoScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }
    getBookingTypeName = (type) => {
        switch (type) {
            case CONSTANT_TYPE_BOOKING.COACH_CAR:
                return 'Xe tuyến cố định'
            case CONSTANT_TYPE_BOOKING.HYBIRD_CAR:
                return 'Xe tiện chuyến'
            case CONSTANT_TYPE_BOOKING.COACH_DELIVERY_CAR:
                return 'Gửi hàng'
            case CONSTANT_TYPE_BOOKING.HYBIRD_DELIVERY_CAR:
                return 'Gửi hàng'
        }
    }
    getStatusName = (booking_type) => {
        switch (booking_type) {
            case constant_type_status_booking.WAITING_DRIVER:
                return 'Chờ tài xế'
            case constant_type_status_booking.USER_CANCEL:
                return 'Đã Huỷ'
            case constant_type_status_booking.PROCESSING:
                return 'Đang di chuyển'
            case constant_type_status_booking.FINDING_DRIVER:
                return 'Tìm xe'
            case constant_type_status_booking.END:
                return 'Đã kết thúc'
        }
    }
    getColorStatus = (status) => {
        switch (status) {
            case constant_type_status_booking.WAITING_DRIVER:
                return color.YEALLOW_COLOR_400
            case constant_type_status_booking.FINDING_DRIVER:
                return color.ORANGE_COLOR_400
            case constant_type_status_booking.PROCESSING:
                return color.GREEN_COLOR_400
            case constant_type_status_booking.USER_CANCEL:
                return color.RED_COLOR
            case constant_type_status_booking.END:
                return color.MAIN_COLOR
        }
    }
    renderHead = () => {
        const { data } = this.props;
        const txtStatus = this.getStatusName(data.status);
        const txtColor = this.getColorStatus(data.status);
        console.log("txtStatus", txtStatus)
        console.log("txtStatus123", data.status)
        console.log("txtColor", txtColor)

        return <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: "space-between" }}>
            <View style={{}}>
                <View style={{ alignItems: "center" }}>
                    <Image resizeMode="stretch" style={{ width: scale(60), height: scale(35) }} source={require('../HomeScreen/res/ic_logo_trans.png')} />
                    <View style={{ padding: scale(5), paddingHorizontal: scale(12), backgroundColor: txtColor, borderRadius: scale(6), alignItems: "center", justifyContent: "center" }}>
                        <Text style={{ fontSize: scale(14), fontWeight: "700", color: '#FFFFFF' }}>{txtStatus}</Text>
                    </View>
                </View>

            </View>
            <View style={{ alignItems: 'center' }}>
                <Text style={{}}>{moment(data?.time_start * 1000).format('dddd, DD ')} thg {moment(data?.time_start * 1000).format('MM, HH:MM')}</Text>
                <Text style={{ fontSize: scale(15), fontWeight: '600', marginTop: scale(7) }}>{this.getBookingTypeName(data.booking_type)}</Text>
            </View>
        </View>
    }
    renderInfo = (data) => {
        const { from, to } = data;
        return <View style={{}}>
            <Text style={{ fontSize: scale(16), fontWeight: "600", color: color.GRAY_COLOR_400 }}>Thông tin chuyến</Text>
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    // height: scale(100),
                    justifyContent: "center",
                    overflow: 'hidden',
                }}
            >
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <FontAwesomeIcon
                        name='arrow-circle-up'
                        size={scale(17)}
                        color={color.GREEN_COLOR_300}
                        containerStyle={{

                        }}
                    />
                    <View style={{ height: scale(25), width: 2, borderStyle: 'dashed', borderWidth: 1, borderColor: color.GRAY_COLOR_400, marginTop: scale(3), marginBottom: scale(2) }}>

                    </View>
                    {/* <MaterialCommunityIcons
                        name='dots-vertical'
                        size={scale(14)}
                        color={color.GRAY_COLOR_400}
                        style={{ opacity: 0.6 }}
                        containerStyle={{

                        }}
                    /> */}
                    <MaterialCommunityIcons
                        name='record-circle'
                        size={scale(20)}
                        color={color.ORANGE_COLOR_400}
                        containerStyle={{

                        }}
                    />
                </View>
                <View style={{ flex: 1, marginHorizontal: scale(10), paddingVertical: scale(5) }}>
                    <View style={{ flex: 1, justifyContent: "center" }}>
                        <Text style={{ fontSize: scale(12), color: color.GRAY_COLOR_500, marginVertical: scale(5) }}>Vị trí điểm đón</Text>
                        <Text numberOfLines={1} style={{ fontSize: scale(13), fontWeight: '600' }}>{from.address}</Text>
                    </View>
                    <View style={{ height: 0.5, opacity: 0.5, backgroundColor: color.GRAY_COLOR_400 }} />
                    <View style={{ flex: 1, justifyContent: "center" }}>
                        <Text style={{ fontSize: scale(12), color: color.GRAY_COLOR_500, marginVertical: scale(5) }}>Vị trí điểm đến</Text>
                        <Text numberOfLines={1} style={{ fontSize: scale(13), fontWeight: '600' }}>{to.address}</Text>
                    </View>

                </View>
            </View>


        </View>
    }
    renderPrice = () => {
        const { price } = this.props?.data;
        return <View style={{ flexDirection: 'row', justifyContent: "space-between", marginVertical: scale(10), alignItems: "center" }}>
            <Text style={{ fontSize: scale(14), fontWeight: '600', color: color.GRAY_COLOR_500 }}>Giá tiền: </Text>
            <Text style={{ fontSize: scale(16), fontWeight: '600' }}>{new Intl.NumberFormat().format(price)} đ</Text>
        </View>
    }
    renderPriceRange = () => {
        const { seat } = this.props?.data;
        const { max_price, min_price } = this.props?.data.range_price;
        return <View style={{ flexDirection: 'row', justifyContent: "space-between", marginVertical: scale(10), alignItems: "center" }}>
            <Text style={{ fontSize: scale(14), fontWeight: '600', color: color.GRAY_COLOR_500 }}>Giá tiền: </Text>
            {max_price == min_price && <Text style={{ fontSize: scale(16), fontWeight: '600' }}>{new Intl.NumberFormat().format(max_price * seat)} đ</Text>}
            {max_price != min_price && <View>
                <Text>Từ {new Intl.NumberFormat().format(min_price * seat)} đ - {new Intl.NumberFormat().format(max_price * seat)} đ</Text>
            </View>}

        </View>
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
        const { data } = this.props;
        const userInfo = data.driver_id;
        if (userInfo && (data.status == constant_type_status_booking.WAITING_DRIVER || data.status == constant_type_status_booking.PROCESSING)) {
            return <View>
                <View style={{ marginBottom: scale(5) }}>
                    <Text style={{ fontSize: scale(13), fontWeight: 'bold', color: color.GRAY_COLOR_500, marginVertical: scale(5) }}>Thông tin nhà xe</Text>

                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                            <Image style={{ width: scale(36), height: scale(36) }} source={require('./res/ic_avatar.png')} />
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
                <View style={{ height: scale(1.5), backgroundColor: color.GRAY_COLOR_200, marginVertical: scale(7) }} />
            </View>
        }
        return null

    }
    renderOrderInfo = () => {
        const { orderInfo } = this.props.data;
        const { isShowOrderInfo } = this.state;
        const widthButton = (width - scale(60)) / 5
        console.log("orderInfo", orderInfo)
        if (orderInfo && orderInfo.phone_take_order) {
            return <View style={{}}>
                <View style={{ marginTop: scale(5), flexDirection: 'row', justifyContent: "space-between", alignItems: 'center' }}>
                    <Text style={{ fontSize: scale(16), fontWeight: 'bold' }}>Thông tin đơn hàng</Text>
                    {/* <TouchableOpacity
                        activeOpacity={0.6}
                        style={{ padding: scale(7) }}
                        onPress={() => this.setState({ isShowOrderInfo: !this.state.isShowOrderInfo })}
                    >
                        <MaterialIcons
                            name={!isShowOrderInfo ? 'navigate-next' : 'arrow-drop-down'}
                            size={scale(30)}

                        />
                    </TouchableOpacity> */}

                </View>
                {<View >
                    <View style={{ marginVertical: scale(7) }}>
                        <Text style={{ fontSize: scale(14), fontWeight: '600', color: color.GRAY_COLOR_500 }}>Số điện thoại người nhận </Text>
                        <Text style={{ fontSize: scale(15), fontWeight: '600', marginTop: scale(4) }}>{orderInfo.phone_take_order}</Text>
                    </View>
                    <View style={{ marginVertical: scale(7) }}>
                        <Text style={{ fontSize: scale(14), fontWeight: '600', color: color.GRAY_COLOR_500 }}>Trọng lượng (kg) </Text>
                        <Text style={{ fontSize: scale(15), fontWeight: '600', marginTop: scale(4) }}>{orderInfo.weight} kg</Text>
                    </View>
                    <View style={{ marginVertical: scale(7) }}>
                        <Text style={{ fontSize: scale(14), fontWeight: '600', color: color.GRAY_COLOR_500 }}>Ghi chú cho tài xế </Text>
                        <Text style={{ fontSize: scale(15), fontWeight: '600', marginTop: scale(4) }}>{orderInfo.note}</Text>
                    </View>
                    <View style={{ marginVertical: scale(7) }}>
                        <Text style={{ fontSize: scale(14), fontWeight: '600', color: color.GRAY_COLOR_500 }}>Ảnh hàng hoá </Text>
                        <View style={{ flexDirection: 'row', alignItems: "center", borderRadius: scale(7), marginTop: scale(7) }}>
                            {orderInfo.lst_image && orderInfo.lst_image.map((img, index) => {
                                console.log("img", img)
                                return <TouchableOpacity style={{}}>
                                    <FastImage
                                        source={{ uri: img }}
                                        style={{ width: widthButton, height: widthButton, borderRadius: scale(10), alignItems: 'center', justifyContent: "center", marginLeft: index !== 0 ? scale(10) : 0 }}
                                    />
                                </TouchableOpacity>

                            })}
                            {(!orderInfo.lst_image || orderInfo?.lst_image && orderInfo?.lst_image.length == 0) && <Text style={{ fontSize: scale(15), fontWeight: '600', marginTop: scale(4) }}>Không có ảnh</Text>}
                        </View>
                    </View>
                </View>
                }
            </View >
        }
        return null

    }
    renderPayment = () => {
        return <View style={{}}>
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
    renderPrice_Coupon = () => {
        const { seat, coupon_code } = this.props?.data;
        const { lst_coupon } = this.props;
        const { price } = this.props?.data;
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
            return <View style={{ flexDirection: 'row', justifyContent: "space-between", marginVertical: scale(10), alignItems: "center" }}>
                <Text style={{ fontSize: scale(14), fontWeight: '600', color: color.GRAY_COLOR_500 }}>Tổng tiền: </Text>
                <Text style={{ fontSize: scale(16), fontWeight: '600' }}>{new Intl.NumberFormat().format(price_coupon)}đ</Text>


            </View>
        }

    }
    renderReduceValue = () => {
        const { seat, coupon_code } = this.props?.data;
        const { lst_coupon } = this.props;
        const { price } = this.props?.data;
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
            return <View style={{ flexDirection: 'row', justifyContent: "space-between", marginVertical: scale(10), alignItems: "center" }}>
                <Text style={{ fontSize: scale(14), fontWeight: '600', color: color.GRAY_COLOR_500 }}>Mã giảm giá: </Text>
                <Text style={{ fontSize: scale(14), fontWeight: '500', color: color.ORANGE_COLOR_400 }}>
                    {new Intl.NumberFormat().format(reduce_value)}đ
                </Text>


            </View>
        }

    }
    render() {
        const { componentId, data } = this.props;
        const { price } = this.props?.data;
        const userInfo = data.driver_id;
        const { orderInfo } = this.props.data;

        console.log("data 123", data)
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <TouchableOpacity activeOpacity={0.6} onPress={() => Navigation.pop(this.props.componentId)}>
                        <Icon
                            name='arrow-back'
                            size={scale(22)}
                            color="black"
                            style={{ margin: scale(10) }}
                        />
                    </TouchableOpacity>

                    <Text style={{ fontSize: scale(22), fontWeight: 'bold', color: color.GRAY_COLOR_900 }}>Chi tiết chuyến</Text>
                </View>
                <View style={{ height: scale(1.5), backgroundColor: color.GRAY_COLOR_200, marginVertical: scale(7) }} />
                <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, marginHorizontal: scale(13) }}>
                    {this.renderHead()}
                    <View style={{ height: scale(1.5), backgroundColor: color.GRAY_COLOR_200, marginVertical: scale(7) }} />
                    {this.renderInfo(data)}
                    <View style={{ height: scale(1.5), backgroundColor: color.GRAY_COLOR_200, marginVertical: scale(7) }} />
                    {price ? this.renderPrice() : this.renderPriceRange()}
                    {this.renderReduceValue()}
                    {this.renderPrice_Coupon()}
                    <View style={{ height: scale(1.5), backgroundColor: color.GRAY_COLOR_200, marginVertical: scale(7) }} />
                    {this.renderInfoDriver()}
                    {/* {userInfo && <View style={{ height: scale(1.5), backgroundColor: color.GRAY_COLOR_200, marginVertical: scale(7) }} />} */}
                    {this.renderOrderInfo()}
                    {orderInfo?.phone_take_order && <View style={{ height: scale(1.5), backgroundColor: color.GRAY_COLOR_200, marginVertical: scale(7) }} />}
                    {this.renderPayment()}
                </ScrollView>

            </SafeAreaView>
        )
    }
}



const mapStateToProps = (state) => {
    return {
        lst_coupon: state.HomeReducer.lst_coupon,

    }
}

const mapDispatchToProps = (dispatch) => {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderInfoScreen)

