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
import actionsHome from '../../HomeScreen/redux/actions'
import { Rating, AirbnbRating } from 'react-native-ratings';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import { ratingBookingAPI } from '../../../api/bookingApi';

const { width, height } = Dimensions.get('window')

class BookingFinish extends React.Component {
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
            isloading: false,
            isRate: false,
            isLoadingCreateRating: false,
            rating_value: 0,
            comment: '',

        }
    }
    componentDidMount() {

    }


    renderPrice = () => {
        const { seat } = this.props?.currentBooking;
        const { price } = this.props?.currentBooking;
        return <View style={{ flexDirection: 'row', justifyContent: "space-between", marginHorizontal: scale(10), marginVertical: scale(10), alignItems: "center" }}>
            <Text style={{ fontSize: scale(14), fontWeight: '600', color: color.GRAY_COLOR_500 }}>Giá tiền: </Text>
            <Text style={{ fontSize: scale(16), fontWeight: '600' }}>{new Intl.NumberFormat().format(price)} đ</Text>
        </View>
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
        // updateCurrentBooking(null);


    }
    renderPrice_Coupon = () => {
        const { seat, coupon_code } = this.props?.currentBooking;
        const { crr_coupon } = this.props;
        const { price } = this.props?.currentBooking;
        if (!coupon_code) {
            return
        }



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
        const { crr_coupon } = this.props;
        const { price } = this.props?.currentBooking;
        if (!coupon_code) {
            return
        }

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
    renderInfoDriver = () => {
        const { currentBooking } = this.props;
        const userInfo = currentBooking.driver_id;
        return <View style={{ marginHorizontal: scale(10), marginBottom: scale(5) }}>
            <Text style={{ fontSize: scale(13), fontWeight: 'bold', color: color.GRAY_COLOR_500, marginVertical: scale(5) }}>Thông tin nhà xe</Text>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                    <Image style={{ width: scale(36), height: scale(36) }} source={require('../res/ic_avatar.png')} />
                    <View style={{ marginLeft: scale(10) }}>
                        <Text style={{ fontSize: scale(16), fontWeight: "600" }}>{userInfo.name}</Text>
                        <Text style={{ fontSize: scale(15), fontWeight: "400", paddingTop: scale(2) }}>{userInfo.license_plate}</Text>
                    </View>
                </View>
            </View>
        </View>
    }
    onRating = async () => {
        const { currentBooking } = this.props;
        const { rating_value, comment } = this.state;
        if (!rating_value) {
            Toast.show({
                type: 'error',
                text1: 'Lỗi',
                text2: 'Bạn chưa đánh giá sao cho tài xế',
                topOffset: scale(50)
            })
            return
        }
        const body = { rate_value: rating_value, comment: comment.trim(), driver_id: currentBooking.driver_id._id, booking_id: currentBooking._id };
        console.log("body req", body)


        this.setState({ isLoadingCreateRating: true })
        let reqRating = await ratingBookingAPI(body);
        this.setState({ isLoadingCreateRating: false })

        if (reqRating && !reqRating.err) {
            Toast.show({
                type: 'success',
                text1: 'Đánh giá tài xế thành công',
                text2: 'Cảm ơn bạn đã đóng góp để dịch vụ tốt hơn',
                topOffset: scale(70)
            })
            this.setState({ isRate: true })

        } else {
            Toast.show({
                type: 'error',
                text1: 'Lỗi',
                text2: 'Đã có lỗi xảy ra',
                topOffset: scale(70)
            })
        }
    }
    renderRating = () => {
        const { data } = this.props;
        const { isLoadingCreateRating, isRate } = this.state;
        return <View style={{ marginHorizontal: scale(15) }}>
            <Text style={{ fontSize: scale(18), fontWeight: '600', marginTop: scale(10), textAlign: "center" }}>Bạn thấy tài xế như thế nào?</Text>
            <AirbnbRating
                count={5}
                reviews={["Rất tệ", "Tệ", 'Trung bình', 'Tốt', "Rất tốt"]}
                defaultRating={0}
                isDisabled={isRate}
                size={scale(30)}
                onFinishRating={rating => {

                    this.setState({ rating_value: rating })
                }}
            />
            {!isRate && <View>
                <Text style={{ fontWeight: '500', fontSize: scale(14), marginVertical: scale(7) }}>Cảm nhận khi sử đụng dịch vụ</Text>
                <View style={{ borderWidth: 1, borderColor: color.GRAY_COLOR_200, borderRadius: scale(5), flexDirection: 'row' }}>
                    <FontAwesomeIcon
                        name='edit'
                        size={scale(17)}
                        color={color.GRAY_COLOR_400}
                        style={{ marginLeft: scale(10), marginTop: scale(4) }}
                    />
                    <TextInput
                        onChangeText={txt => this.setState({ comment: txt })}
                        blurOnSubmit={true}
                        multiline={true}
                        style={{ fontSize: scale(14), padding: scale(10), flex: 1 }}
                        placeholder="Gửi phản hồi" />
                </View>
                <TouchableOpacity
                    onPress={_.debounce(() => this.onRating(), 500, { leading: true, trailing: false })}
                    disabled={isLoadingCreateRating}
                    activeOpacity={0.6}
                    style={{
                        height: scale(40),
                        backgroundColor: isLoadingCreateRating ? color.GRAY_COLOR_200 : color.ORANGE_COLOR_400,
                        borderRadius: scale(5),
                        alignItems: 'center',
                        justifyContent: "center",
                        marginVertical: scale(20),
                        flexDirection: "row"
                    }}>
                    {isLoadingCreateRating && <ActivityIndicator size="small" color={color.ORANGE_COLOR_400} style={{ paddingHorizontal: scale(10) }} />}
                    <Text style={{ fontSize: scale(18), fontWeight: '600', color: '#FFFFFF' }}>Gửi</Text>
                </TouchableOpacity>
            </View>}
        </View>
    }
    renderStage = () => {
        return <View style={{ alignItems: 'center', justifyContent: "center", marginHorizontal: scale(20), marginVertical: scale(4) }}>
            <Text style={{ fontWeight: "500", fontSize: scale(18), marginVertical: scale(4) }} >Chuyển đã kết thúc</Text>
            <View style={{ flexDirection: 'row' }}>
                <View style={{ alignItems: "center" }}>
                    <View
                        style={{
                            height: scale(16),
                            width: scale(16),
                            borderRadius: scale(8),
                            backgroundColor: color.ORANGE_COLOR_400,
                            alignItems: "center",
                            justifyContent: "center"
                        }}>
                        <FontAwesomeIcon
                            name='check'
                            size={scale(10)}
                            color='white'

                        />
                    </View>
                    <Text style={{ fontSize: scale(11), fontWeight: '600', paddingTop: scale(5) }}>Đặt chuyến</Text>
                </View>
                <View style={{ height: 2, backgroundColor: color.GRAY_COLOR_200, flex: 1, marginHorizontal: scale(5), marginVertical: scale(8) }} />
                <View style={{ alignItems: "center" }}>
                    <View
                        style={{
                            height: scale(16),
                            width: scale(16),
                            borderRadius: scale(8),
                            backgroundColor: color.ORANGE_COLOR_400,
                            alignItems: "center",
                            justifyContent: "center"
                        }}>
                        <FontAwesomeIcon
                            name='check'
                            size={scale(10)}
                            color='white'

                        />
                    </View>
                    <Text style={{ fontSize: scale(11), fontWeight: '400', paddingTop: scale(5) }}>Đón khách</Text>
                </View>
                <View style={{ height: 2, backgroundColor: color.GRAY_COLOR_200, flex: 1, marginHorizontal: scale(5), marginVertical: scale(8) }} />
                <View style={{ alignItems: "center" }}>
                    <View
                        style={{
                            height: scale(16),
                            width: scale(16),
                            borderRadius: scale(8),
                            backgroundColor: color.ORANGE_COLOR_400,
                            alignItems: "center",
                            justifyContent: "center"
                        }}>
                        <FontAwesomeIcon
                            name='check'
                            size={scale(10)}
                            color='white'

                        />
                    </View>
                    <Text style={{ fontSize: scale(11), fontWeight: '400', paddingTop: scale(5) }}>Hoàn thành</Text>
                </View>
            </View>

        </View>
    }

    render() {
        const { onNavigationBack, isInCreaseHeight } = this.props;
        const { coupon_code } = this.props?.currentBooking;

        if (isInCreaseHeight) {

            return (
                <View style={{ flex: 1, backgroundColor: "#FFFFFF", borderRadius: scale(20) }}>
                    <KeyboardAwareScrollView
                        extraScrollHeight={scale(50)}
                        innerRef={ref => {
                            this.scroll = ref
                        }}
                        showsVerticalScrollIndicator={false}>
                        <View style={{ marginBottom: scale(10), flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            <View style={{ marginHorizontal: scale(10), flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ fontSize: scale(20), fontWeight: 'bold' }}>Xe tuyến cố định</Text>

                            </View>

                        </View>
                        <View style={{ width: width, height: 1, backgroundColor: color.GRAY_COLOR_400, opacity: 0.5 }} />
                        {this.renderStage()}
                        <View style={{ marginHorizontal: scale(10), marginTop: scale(5) }}>
                            <Text style={{ fontSize: scale(15), fontWeight: 'bold', color: color.GRAY_COLOR_500 }}>Thông tin chuyến</Text>
                        </View>
                        {this.renderInfo()}
                        {this.renderSeat()}
                        {this.renderTime()}
                        {this.renderTimeDay()}
                        {this.renderPrice()}
                        {this.renderReduceValue()}
                        {this.renderPrice_Coupon()}
                        {this.renderInfoDriver()}
                        {this.renderPayment()}
                        {this.renderRating()}
                        <TouchableOpacity onPress={() => this.onBack()} style={{ width: scale(150), height: scale(40), alignItems: 'center', justifyContent: 'center', backgroundColor: color.GREEN_COLOR_400, borderRadius: scale(15), alignSelf: "center", marginVertical: scale(15) }}>
                            <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Quay lại</Text>
                        </TouchableOpacity>
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
                            <Text style={{ fontSize: scale(20), fontWeight: 'bold' }}>Xe tuyến cố định</Text>

                        </View>

                    </View>
                    <View style={{ width: width, height: 1, backgroundColor: color.GRAY_COLOR_400, opacity: 0.5 }} />

                   
                    {this.renderStage()}
                    <View style={{ width: width - scale(20), height: 1, backgroundColor: color.GRAY_COLOR_400, opacity: 0.5, margin: scale(10) }} />
                    {this.renderInfoDriver()}

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
)(BookingFinish);

