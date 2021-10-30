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
import FastImage from 'react-native-fast-image'

import { scale } from '../../../ultis/scale'
import { cancelBookingAPI } from '../../../api/bookingApi'
import { color } from '../../../constant/color'
import moment from 'moment'
import _ from 'lodash';
import actionsHome from '../../HomeScreen/redux/actions'
import Modal from "react-native-modal";

const { width, height } = Dimensions.get('window')

class WaitingDriverScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            seat: 1,
            selectAll: false,
            lst_select: [],
            fromTime: moment(new Date()).add(0.25, 'hours').format('HH:mm'),
            reason: '',
            isShowModal: false,
            err: false,
            isCancel: false,
            message: '',
            isloading: false,
            isShowOrderInfo: false,
            isErrApi: false
        }
        this.bookingNew = null;
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
        const { max_price, min_price } = this.props?.currentBooking.range_price;
        return <View style={{ flexDirection: 'row', justifyContent: "space-between", marginHorizontal: scale(10), marginVertical: scale(10), alignItems: "center" }}>
            <Text style={{ fontSize: scale(14), fontWeight: '600', color: color.GRAY_COLOR_500 }}>Giá tiền: </Text>
            {max_price == min_price && <Text style={{ fontSize: scale(14), fontWeight: '600' }}>{new Intl.NumberFormat().format(max_price * seat)} đ</Text>}
            {max_price != min_price && <View>
                <Text style={{ fontSize: scale(14), fontWeight: '600' }}>Từ {new Intl.NumberFormat().format(min_price * seat)} đ - {new Intl.NumberFormat().format(max_price * seat)} đ</Text>
            </View>}

        </View>
    }
    renderOrderInfo = () => {
        const { orderInfo } = this.props.currentBooking;
        const { isShowOrderInfo } = this.state;
        const widthButton = (width - scale(60)) / 5
        console.log("orderInfo,", orderInfo.lst_image)
        return <View style={{}}>
            <View style={{ marginHorizontal: scale(10), marginTop: scale(5), flexDirection: 'row', justifyContent: "space-between", alignItems: 'center' }}>
                <Text style={{ fontSize: scale(16), fontWeight: 'bold' }}>Thông tin đơn hàng</Text>
                <TouchableOpacity
                    activeOpacity={0.6}
                    style={{ padding: scale(7) }}
                    onPress={() => this.setState({ isShowOrderInfo: !this.state.isShowOrderInfo })}
                >
                    <MaterialIcons
                        name={!isShowOrderInfo ? 'navigate-next' : 'arrow-drop-down'}
                        size={scale(30)}

                    />
                </TouchableOpacity>

            </View>
            {isShowOrderInfo && <View >
                <View style={{ marginHorizontal: scale(10), marginVertical: scale(7) }}>
                    <Text style={{ fontSize: scale(14), fontWeight: '600', color: color.GRAY_COLOR_500 }}>Số điện thoại người nhận </Text>
                    <Text style={{ fontSize: scale(15), fontWeight: '600', marginTop: scale(4) }}>{orderInfo.phone_take_order}</Text>
                </View>
                <View style={{ marginHorizontal: scale(10), marginVertical: scale(7) }}>
                    <Text style={{ fontSize: scale(14), fontWeight: '600', color: color.GRAY_COLOR_500 }}>Trọng lượng (kg) </Text>
                    <Text style={{ fontSize: scale(15), fontWeight: '600', marginTop: scale(4) }}>{orderInfo.weight} kg</Text>
                </View>
                <View style={{ marginHorizontal: scale(10), marginVertical: scale(7) }}>
                    <Text style={{ fontSize: scale(14), fontWeight: '600', color: color.GRAY_COLOR_500 }}>Ghi chú cho tài xế </Text>
                    <Text style={{ fontSize: scale(15), fontWeight: '600', marginTop: scale(4) }}>{orderInfo.note}</Text>
                </View>
                <View style={{ marginHorizontal: scale(10), marginVertical: scale(7) }}>
                    <Text style={{ fontSize: scale(14), fontWeight: '600', color: color.GRAY_COLOR_500 }}>Ảnh hàng hoá</Text>
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
    onCancelBooking = async () => {
        this.setState({ isloading: true })

        const { currentBooking, updateCurrentBooking } = this.props;
        const { reason } = this.state;
        if (!reason) {
            this.setState({ err: true })
            this.setState({ isloading: false })
            return
        }
        const body = {
            id: currentBooking._id,
            reason: reason
        }
        let requestCancel = await cancelBookingAPI(body)
        this.setState({ isloading: false })

        if (!requestCancel.err) {
            this.setState({ isCancel: true, message: 'Huỷ đơn hàng thành công', isErrApi: false })
            updateCurrentBooking(requestCancel.data)
        } else {
            this.setState({ isCancel: true, message: requestCancel.message, isErrApi: true })
            if (requestCancel.data) {
                this.bookingNew = requestCancel.data;
            }
        }
        console.log("requestCancel", requestCancel)
    }
    renderPrice_Coupon = () => {
        const { seat, coupon_code } = this.props?.currentBooking;
        const { crr_coupon } = this.props;
        const { max_price, min_price } = this.props?.currentBooking.range_price;
        if (!coupon_code) {
            return
        }


        if (crr_coupon) {
            const { amount, max_apply, condition } = crr_coupon;
            let reduce_value_max = 0;
            let reduce_value_min = 0;

            if (amount < 100) {
                reduce_value_max = max_price * amount / 100;
                reduce_value_min = min_price * amount / 100;
                if (reduce_value_max > max_apply) {
                    reduce_value_max = max_apply
                }
                if (reduce_value_min > max_apply) {
                    reduce_value_min = max_apply
                }
            } else {
                reduce_value_max = amount;
                reduce_value_min = amount;
            }
            let max = max_price * seat >= condition?.min_Price ? max_price * seat - reduce_value_max : max_price * seat;
            let min = min_price * seat >= condition?.min_Price ? min_price * seat - reduce_value_min : min_price * seat;
            return <View style={{ flexDirection: 'row', justifyContent: "space-between", marginHorizontal: scale(10), marginVertical: scale(10), alignItems: "center" }}>
                <Text style={{ fontSize: scale(14), fontWeight: '600', color: color.GRAY_COLOR_500 }}>Tổng tiền: </Text>
                {max_price == min_price && <Text style={{ fontSize: scale(16), fontWeight: '600' }}>{new Intl.NumberFormat().format(max)}đ</Text>}
                {max_price != min_price && <View>
                    <Text style={{ fontSize: scale(16), fontWeight: '600' }}>Từ {new Intl.NumberFormat().format(min)}đ - {new Intl.NumberFormat().format(max)}đ</Text>
                </View>}

            </View>
        }

    }
    renderReduceValue = () => {
        const { seat, coupon_code } = this.props?.currentBooking;
        const { crr_coupon } = this.props;
        const { max_price, min_price } = this.props?.currentBooking.range_price;
        if (!coupon_code) {
            return
        }

        if (crr_coupon) {
            const { amount, max_apply, condition } = crr_coupon;
            let reduce_value_max = 0;
            let reduce_value_min = 0;

            if (amount < 100) {
                reduce_value_max = max_price * amount / 100;
                reduce_value_min = min_price * amount / 100;
                if (reduce_value_max > max_apply) {
                    reduce_value_max = max_apply
                }
                if (reduce_value_min > max_apply) {
                    reduce_value_min = max_apply
                }
            } else {
                reduce_value_max = amount;
                reduce_value_min = amount;
            }
            if (max_price < condition?.min_Price && min_price < condition?.min_Price) {
                reduce_value_max = 0;
                reduce_value_min = 0;
            }
            return <View style={{ flexDirection: 'row', justifyContent: "space-between", marginHorizontal: scale(10), marginVertical: scale(10), alignItems: "center" }}>
                <Text style={{ fontSize: scale(14), fontWeight: '600', color: color.GRAY_COLOR_500 }}>Mã giảm giá: </Text>
                {reduce_value_min == reduce_value_max && <Text style={{ fontSize: scale(14), fontWeight: '500', color: color.ORANGE_COLOR_400 }}>{new Intl.NumberFormat().format(reduce_value_max)}đ</Text>}
                {reduce_value_max != reduce_value_min && <View>
                    <Text style={{ fontSize: scale(14), fontWeight: '500', color: color.ORANGE_COLOR_400 }}>Từ {new Intl.NumberFormat().format(reduce_value_min)}đ - {new Intl.NumberFormat().format(reduce_value_max)}đ</Text>
                </View>}

            </View>
        }

    }

    render() {
        const { onNavigationBack, isInCreaseHeight } = this.props;

        if (isInCreaseHeight) {
            return (
                <View style={{ flex: 1, backgroundColor: "#FFFFFF", borderRadius: scale(20) }}>
                    <View style={{ marginBottom: scale(10), flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <View style={{ marginHorizontal: scale(10), flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ fontSize: scale(20), fontWeight: 'bold' }}>Gửi hàng theo xe - Đang tìm xe</Text>

                        </View>

                    </View>
                    <View style={{ width: width, height: 1, backgroundColor: color.GRAY_COLOR_400, opacity: 0.5 }} />
                    <KeyboardAwareScrollView
                        innerRef={ref => {
                            this.scroll = ref
                        }}
                        showsVerticalScrollIndicator={false}>


                        <View style={{ marginHorizontal: scale(10), marginTop: scale(5) }}>
                            <Text style={{ fontSize: scale(13), fontWeight: 'bold', color: color.GRAY_COLOR_500 }}>Thông tin đơn hàng</Text>
                        </View>
                        {this.renderInfo()}
                        {this.renderTime()}
                        {this.renderTimeDay()}
                        {this.renderPrice()}
                        {this.renderReduceValue()}
                        {this.renderPrice_Coupon()}
                        <View style={{ height: scale(7), backgroundColor: color.GRAY_COLOR_200, marginVertical: scale(7) }}></View>
                        {this.renderOrderInfo()}
                        <View style={{ height: scale(7), backgroundColor: color.GRAY_COLOR_200, marginVertical: scale(7) }}></View>
                        {this.renderPayment()}
                        <TouchableOpacity onPress={() => this.setState({ isShowModal: true })} style={{ width: scale(150), height: scale(40), alignItems: 'center', justifyContent: 'center', backgroundColor: color.RED_COLOR, borderRadius: scale(15), alignSelf: "center", marginVertical: scale(30) }}>
                            <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Huỷ đơn hàng</Text>
                        </TouchableOpacity>
                    </KeyboardAwareScrollView>
                    <Modal isVisible={this.state.isShowModal}>

                        {!this.state.isCancel && <View style={{ width: width - scale(40), height: scale(370), backgroundColor: '#FFFFFF', alignSelf: "center", borderRadius: scale(10), alignItems: "center" }}>
                            <KeyboardAwareScrollView
                                extraHeight={100}
                                extraScrollHeight={scale(130)}
                                showsVerticalScrollIndicator={false}>
                                <View style={{ alignItems: 'center', width: width - scale(40), height: scale(370) }}>
                                    <MaterialCommunityIcons
                                        name='cancel'
                                        size={scale(42)}
                                        color={color.RED_COLOR}
                                        style={{ marginTop: scale(10) }}
                                    />
                                    <Text style={{ fontSize: scale(17), fontWeight: '600', marginTop: scale(10) }}>Bạn muốn huỷ đơn hàng?</Text>
                                    <View style={{ flex: 1, width: '100%', marginTop: scale(30) }}>
                                        <Text style={{ fontSize: scale(12), marginLeft: scale(15) }}>Hãy cho chúng tôi biết lý do huỷ đơn hàng của bạn <Text style={{ color: color.RED_COLOR }}>*</Text></Text>
                                        <TextInput
                                            placeholder="Hãy nhập đề xuất của bạn"
                                            onChangeText={txt => this.setState({ reason: txt, err: false })}
                                            multiline={true}
                                            style={{ width: width - scale(70), borderWidth: 0.5, borderColor: '#959494', height: scale(90), fontSize: scale(14), fontWeight: '400', textAlignVertical: "top", marginTop: scale(7), alignSelf: 'center', borderRadius: scale(10), paddingHorizontal: scale(10) }} />
                                        {this.state.err && <Text style={{ color: color.RED_COLOR, marginLeft: scale(15) }}>Lý do huỷ đơn hàng không được bỏ trống</Text>}
                                        <TouchableOpacity
                                            disabled={this.state.isloading}
                                            onPress={_.debounce(() => this.onCancelBooking(), 1000)}
                                            style={{ width: scale(150), height: scale(40), alignItems: 'center', justifyContent: 'center', backgroundColor: this.state.isloading ? color.GRAY_COLOR_400 : color.RED_COLOR, borderRadius: scale(15), alignSelf: "center", marginTop: scale(20), flexDirection: "row" }}>
                                            {this.state.isloading && <ActivityIndicator size="small" color={color.ORANGE_COLOR_400} style={{}} />}
                                            <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Huỷ đơn hàng</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => this.setState({ isShowModal: false })} style={{ width: scale(150), height: scale(40), alignItems: 'center', justifyContent: 'center', backgroundColor: color.GREEN_COLOR_300, borderRadius: scale(15), alignSelf: "center", marginTop: scale(10) }}>
                                            <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Quay lại</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </KeyboardAwareScrollView>
                        </View>}
                        {this.state.isCancel && <View style={{ width: width - scale(40), height: scale(170), backgroundColor: '#FFFFFF', alignSelf: "center", borderRadius: scale(10), alignItems: "center" }}>
                            <MaterialCommunityIcons
                                name={this.state.isErrApi ? 'cancel' : 'check-circle'}
                                size={scale(42)}
                                color={this.state.isErrApi ? color.RED_COLOR : color.GREEN_COLOR_300}
                                style={{ marginTop: scale(10) }}
                            />
                            <Text style={{ fontSize: scale(17), fontWeight: '600', marginTop: scale(10) }}>{this.state.message}</Text>
                            <TouchableOpacity
                                onPress={() => {
                                    if (this.state.isErrApi) {
                                        this.props.updateCurrentBooking(this.bookingNew)
                                    }
                                    this.setState({ isShowModal: false })
                                }}
                                style={{ width: scale(150), height: scale(40), alignItems: 'center', justifyContent: 'center', backgroundColor: this.state.isErrApi ? color.RED_COLOR : color.GREEN_COLOR_300, borderRadius: scale(15), alignSelf: "center", marginTop: scale(20) }}>
                                <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Ok</Text>
                            </TouchableOpacity>
                        </View>}
                    </Modal>
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
                            <Text style={{ fontSize: scale(20), fontWeight: 'bold' }}>Gửi hàng theo xe - Đang tìm xe</Text>

                        </View>

                    </View>
                    <View style={{ width: width, height: 1, backgroundColor: color.GRAY_COLOR_400, opacity: 0.5 }} />

                    <View style={{ marginHorizontal: scale(10), marginTop: scale(5) }}>
                        <Text style={{ fontSize: scale(13), fontWeight: 'bold', color: color.GRAY_COLOR_500 }}>Thông tin đơn hàng</Text>
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
        crr_coupon: state.HomeReducer.crr_coupon


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
)(WaitingDriverScreen);

