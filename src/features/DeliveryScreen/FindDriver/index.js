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
import { getAdressFromLatLng } from '../../../api/MapApi';
import { UploadMultipleImageApi } from '../../../api/ImageAPI'

import { createBookingAPI } from '../../../api/bookingApi';
import { scale } from '../../../ultis/scale'
import {
    Placeholder,
    PlaceholderMedia,
    PlaceholderLine,
    Fade
} from "rn-placeholder";
import { color } from '../../../constant/color'
import moment from 'moment'
import _ from 'lodash';
import FastImage from 'react-native-fast-image'
import ChooseAppointmentTimeModal from '../../../component/PickTime/ChooseAppointmentTime'
import ChooseAppointmentDateModal from '../../../component/PickTime/ChooseAppointmentDate'
import actionsHome from '../../HomeScreen/redux/actions'
import { CONSTANT_TYPE_BOOKING } from '../../../constant';
import { getListCoupon } from '../../../api/couponAPI'

const { width, height } = Dimensions.get('window')

class FindDriver extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            seat: 1,
            selectAll: false,
            lst_select: [],
            fromTime: moment(new Date()).add(0.25, 'hours').format('HH:mm'),
            day_select: moment(new Date()).format('DD/MM/YYYY'),
            isloading: false,
            coupon: props.coupon ? props.coupon : null,
            index_coupon: props.index_coupon ? props.index_coupon : null
        }

    }
    scrollToIndex = (index) => {
        setTimeout(() => {
            this.scrollCoupon.scrollTo({
                x: (width - scale(70)) * (index),
                animated: true,
            })
        }, 300)
    }
    componentDidMount() {
        const { disablePull, coupon, index_coupon } = this.props;
        if (this.scrollCoupon && coupon && index_coupon) {
            this.scrollToIndex(index_coupon);
        }
        disablePull();
    }
    componentWillUnmount() {
        const { enablePull } = this.props;
        enablePull();
    }

    onBack = () => {
        const { navigation, onBack } = this.props;
        navigation.pop();
        onBack();
    }

    renderInfo = () => {
        const { data_diem_don, data_diem_den } = this.props?.route?.params;

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
    renderLine = () => {
        return <View style={{ height: 0.8, opacity: 1, backgroundColor: color.GRAY_COLOR_400, marginVertical: scale(5) }} />

    }
    renderLoading = () => {
        let arr = [1, 2, 3, 4, 5];
        return <ScrollView showsVerticalScrollIndicator={false}>
            {arr.map(vl => {
                return <Placeholder
                    Animation={Fade}
                    Left={props => <PlaceholderMedia isRound style={[{ marginLeft: scale(10), marginTop: scale(5) }, props.style]} />}
                    style={{ marginVertical: scale(12) }}
                >
                    <PlaceholderLine width={80} height={10} style={{ borderRadius: 10 }} />
                    <PlaceholderLine width={80} height={10} style={{ borderRadius: 10 }} />
                    <PlaceholderLine width={80} height={10} style={{ borderRadius: 10 }} />
                </Placeholder>
            })}


        </ScrollView>
    }
    getPrice = (lst_price) => {
        const { distance } = this.props;
        console.log("lst_price", lst_price)
        let data = lst_price.find(price => {
            return distance < (price.distance * 1000)
        })

        if (data) {
            return data.value;
        } else {
            return lst_price[lst_price.length - 1].value
        }
    }
    renderPrice = (driver, coupon) => {
        const { seat } = this.state;
        let crr_price = this.getPrice(driver.price_shipping) * seat
        if (coupon && crr_price >= coupon?.condition?.min_Price) {
            const { amount, max_apply, condition } = coupon;
            let reduce_value = 0;
            if (amount < 100) {
                reduce_value = crr_price * amount / 100;
                if (reduce_value > max_apply) {
                    reduce_value = max_apply
                }
            } else {
                reduce_value = amount;
            }
            return <View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: scale(5) }}>
                    <Text style={{ fontSize: scale(12), color: color.GRAY_COLOR_500, textDecorationLine: 'line-through' }}>{new Intl.NumberFormat().format(this.getPrice(driver.price_shipping) * seat)}đ</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: scale(5) }}>
                    <Text style={{ fontSize: scale(13), fontWeight: '500' }}>{new Intl.NumberFormat().format(crr_price - reduce_value)}đ</Text>
                </View>
            </View>
        }
        return <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: scale(5) }}>
                <Text style={{ fontSize: scale(12), color: color.GRAY_COLOR_500 }}>Tổng tiền</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: scale(5) }}>
                <Text style={{ fontSize: scale(13), fontWeight: '500' }}>{new Intl.NumberFormat().format(crr_price)}đ</Text>
            </View>
        </View>

    }

    renderLstDriver = (lstDriver) => {
        const { lst_select, coupon } = this.state;

        if (lstDriver.length == 0) {
            return <View style={{ flex: 1, alignItems: "center", justifyContent: "center", marginTop: scale(30) }}>
                <Image style={{ width: scale(80), height: scale(80) }} source={require('./res/ic_notfound.png')} />
                <Text style={{ fontSize: scale(14), fontWeight: '500', marginHorizontal: scale(20), textAlign: 'center', paddingTop: scale(10) }}>Hiện tại không có nhà xe nào phù hợp với yêu cầu của bạn. Vui lòng thử lại sau</Text>
            </View>
        }

        return <View style={{ flexDirection: "row", flexWrap: 'wrap' }}>
            {lstDriver.map(driver => {
                const isCheck = lst_select.findIndex(vl => vl.journey_id == driver.journey_id)

                return <View
                    style={{
                        width: width / 2 - scale(20),
                        height: scale(170),
                        borderRadius: scale(10),
                        borderWidth: 0.7,
                        borderColor: color.GRAY_COLOR_500,
                        margin: scale(10)
                    }}>
                    <View style={{ flex: 1 }}>
                        <MaterialIcons
                            name="tag-faces"
                            size={scale(30)}
                            style={{ alignSelf: "center", marginVertical: scale(3) }}
                        />
                        <Text style={{ alignSelf: 'center', fontSize: scale(13), fontWeight: "500", paddingBottom: scale(3) }}>{driver.driver_id.name}</Text>
                        <View style={{ height: 0.8, opacity: 1, backgroundColor: color.GRAY_COLOR_400 }} />
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                height: scale(50),

                            }}
                        >
                            <View style={{ alignItems: 'center', justifyContent: 'center', marginLeft: scale(2) }}>
                                <FontAwesomeIcon
                                    name='arrow-circle-up'
                                    size={scale(12)}
                                    color={color.GREEN_COLOR_300}
                                    containerStyle={{

                                    }}
                                />
                                <MaterialCommunityIcons
                                    name='dots-vertical'
                                    size={scale(8)}
                                    color={color.GRAY_COLOR_400}
                                    style={{ opacity: 0.6 }}
                                    containerStyle={{

                                    }}
                                />
                                <MaterialCommunityIcons
                                    name='record-circle'
                                    size={scale(14)}
                                    color={color.ORANGE_COLOR_400}
                                    containerStyle={{

                                    }}
                                />
                            </View>
                            <View style={{ flex: 1, marginLeft: scale(7), paddingVertical: scale(5) }}>
                                <View style={{ flex: 1, justifyContent: "center" }}>
                                    <Text numberOfLines={1} style={{ fontSize: scale(11), fontWeight: '600' }}>{driver.from.address}</Text>
                                </View>
                                <View style={{ flex: 1, justifyContent: "center" }}>
                                    <Text numberOfLines={1} style={{ fontSize: scale(11), fontWeight: '600' }}>{driver.to.address}</Text>
                                </View>

                            </View>

                        </View>
                        <View style={{ flexDirection: 'row', marginLeft: scale(2) }}>
                            <MaterialCommunityIcons
                                name="clock"
                                size={scale(14)}
                                color={color.YEALLOW_COLOR_300}
                            />
                            <Text style={{ alignSelf: 'center', fontSize: scale(11), fontWeight: "500", marginLeft: scale(7) }}>{moment(driver.time_start * 1000).format('HH:mm')}-{moment(driver.time_end * 1000).format('HH:mm')}</Text>
                        </View>
                    </View>
                    <View style={{ height: 0.8, opacity: 1, backgroundColor: color.GRAY_COLOR_400 }} />
                    <View style={{ height: scale(35), flexDirection: "row", alignItems: "center", justifyContent: 'space-between' }}>
                        {this.renderPrice(driver, coupon)}
                        <CheckBox
                            value={isCheck == -1 ? false : true}
                            onCheckColor={color.ORANGE_COLOR_400}
                            onTintColor={color.ORANGE_COLOR_400}
                            style={{ width: scale(20), height: scale(20), marginRight: scale(5) }}
                            onValueChange={(newValue) => {
                                if (newValue) {
                                    let newArr = [...lst_select, { journey_id: driver.journey_id, value: driver.driver_id.device_token, price_shipping: driver.price_shipping, driver_id: driver.driver_id._id }]
                                    this.setState({ lst_select: newArr })
                                } else {
                                    let newArr = lst_select.filter(vl => vl.journey_id !== driver.journey_id)
                                    this.setState({ lst_select: newArr })
                                }
                            }}

                        />
                    </View>
                </View>
            })}

        </View>
    }
    createBookingSuccess = async (data) => {
        const { updateCurrentBooking } = this.props;

        const { update_list_coupon, update_crr_coupon } = this.props;
        const { coupon } = this.state;
        update_crr_coupon(coupon);
        const reqCoupon = await getListCoupon();
        console.log("reqCoupon", reqCoupon)
        if (reqCoupon && !reqCoupon.err) {
            const length = reqCoupon?.data?.length ? reqCoupon?.data?.length : 0
            const data_lst = reqCoupon.data ? reqCoupon.data : []
            update_list_coupon(data_lst, length)
        }

        updateCurrentBooking(data);


    }
    onSendRequestToDriver = () => {
        const { lst_select, seat, fromTime, day_select } = this.state;
        const { data_diem_don, data_diem_den, infoOrder } = this.props?.route?.params;
        const { coord, distance, line_string } = this.props;
        const lst_token = lst_select.map(vl => vl.value)
        const list_driverId = lst_select.map(vl => vl.driver_id)

        let maxPrice = 0;
        let minPrice = 0;
        lst_select.map(lstprice => {
            let price = this.getPrice(lstprice.price_shipping);
            if (maxPrice == 0 && minPrice == 0) {
                maxPrice = price;
                minPrice = price;
            } else {
                if (maxPrice < price) {
                    maxPrice = price;
                }
                if (minPrice > price) {
                    minPrice = price
                }
            }
        })

        Alert.alert(
            'Thông báo',
            'Hãy chắc chắn các thông tin về đơn hàng là chính xác',
            [
                {
                    text: 'Huỷ',

                    onPress: () => console.log('cancel'),
                    style: 'cancel',
                },

                {
                    text: 'Gửi yêu cầu',
                    onPress: async () => {
                        if (!data_diem_don) {
                            this.setState({ isloading: true })
                            let list_image_upload = null;
                            if (infoOrder.lst_image.length > 0) {
                                const formData = new FormData();
                                infoOrder.lst_image.map((data, index) => {
                                    formData.append('files', {
                                        uri: data.uri,
                                        type: data.type,
                                        name: 'image' + index
                                    })
                                })
                                const dataupload = await UploadMultipleImageApi(formData);
                                console.log("dataupload", dataupload)
                                list_image_upload = dataupload.data;
                            }


                            let getDataDiemDon = await getAdressFromLatLng(coord.lat, coord.lng);
                            const bodyRequest = {
                                from: {
                                    lat: coord.lat,
                                    lng: coord.lng,
                                    address: getDataDiemDon.items[0].title
                                },
                                to: {
                                    lat: data_diem_den.displayPosition.latitude,
                                    lng: data_diem_den.displayPosition.longitude,
                                    address: data_diem_den?.address?.label
                                },
                                distance: distance,
                                time_start: moment(`${day_select} ${fromTime}`, 'DD/MM/YYYY HH:mm').unix(),
                                seat: seat,
                                lst_devicetoken: lst_token,
                                list_driverId: list_driverId,
                                range_price: {
                                    max_price: maxPrice,
                                    min_price: minPrice,
                                },
                                line_string: line_string,
                                booking_type: infoOrder.method_take,
                                orderInfo: {
                                    phone_take_order: infoOrder.phone_number,
                                    note: infoOrder.note,
                                    lst_image: list_image_upload,
                                    weight: infoOrder.weight
                                },
                                coupon_code: this.state.coupon ? this.state.coupon.code : ''



                            }
                            let reqCreateBooking = await createBookingAPI(bodyRequest)
                            console.log("bodyRequest", bodyRequest)
                            this.setState({ isloading: false })

                            if (reqCreateBooking.err == false) {
                                this.createBookingSuccess(reqCreateBooking.data)
                            }
                        } else {
                            this.setState({ isloading: true })

                            let list_image_upload = null;
                            if (infoOrder.lst_image.length > 0) {
                                const formData = new FormData();
                                infoOrder.lst_image.map((data, index) => {
                                    formData.append('files', {
                                        uri: data.uri,
                                        type: data.type,
                                        name: 'image' + index
                                    })
                                })
                                const dataupload = await UploadMultipleImageApi(formData);
                                console.log("dataupload", dataupload)
                                list_image_upload = dataupload.data;
                            }
                            const bodyRequest = {
                                from: {
                                    lat: data_diem_don.displayPosition.latitude,
                                    lng: data_diem_don.displayPosition.longitude,
                                    address: data_diem_don?.address?.label
                                },
                                to: {
                                    lat: data_diem_den.displayPosition.latitude,
                                    lng: data_diem_den.displayPosition.longitude,
                                    address: data_diem_den?.address?.label
                                },
                                distance: distance,
                                time_start: moment(`${day_select} ${fromTime}`, 'DD/MM/YYYY HH:mm').unix(),
                                seat: seat,
                                lst_devicetoken: lst_token,
                                list_driverId: list_driverId,
                                range_price: {
                                    max_price: maxPrice,
                                    min_price: minPrice,
                                },
                                line_string: line_string,
                                booking_type: infoOrder.method_take,
                                orderInfo: {
                                    phone_take_order: infoOrder.phone_number,
                                    note: infoOrder.note,
                                    lst_image: list_image_upload,
                                    weight: infoOrder.weight
                                },
                                coupon_code: this.state.coupon ? this.state.coupon.code : ''


                            }

                            let reqCreateBooking = await createBookingAPI(bodyRequest)
                            this.setState({ isloading: false })

                            if (reqCreateBooking.err == false) {
                                this.createBookingSuccess(reqCreateBooking.data)
                            }

                        }
                    },
                },
            ],
        );

    }
    renderTimeDay = () => {
        const { day_select } = this.state;
        return <View style={{ flexDirection: 'row', justifyContent: "space-between", marginHorizontal: scale(10), marginVertical: scale(5), alignItems: "center" }}>
            <Text style={{ fontSize: scale(14), fontWeight: 'bold', color: color.GRAY_COLOR_500 }}>Ngày </Text>
            <TouchableOpacity
                onPress={() => {
                    this.chooseAppointmentDateModal.showModal(
                        this.state.day_select,
                    );
                }}
                activeOpacity={0.5}
                style={{ flexDirection: 'row', alignItems: 'center', borderRadius: scale(10), borderWidth: 0.7, borderColor: color.GRAY_COLOR_400, width: scale(120) }}>
                <Text style={{ marginHorizontal: scale(7), fontSize: scale(14), fontWeight: '500', paddingVertical: scale(7) }}>{day_select}</Text>
                <MaterialCommunityIcons
                    name='calendar'
                    size={scale(22)}
                    color={color.GRAY_COLOR_500}
                    style={{ marginLeft: scale(5), opacity: 0.6 }}
                />
            </TouchableOpacity>
        </View>
    }
    renderTimeStart = () => {
        const { fromTime } = this.state;
        return <View style={{ flexDirection: 'row', justifyContent: "space-between", marginHorizontal: scale(10), marginVertical: scale(5), alignItems: "center" }}>
            <Text style={{ fontSize: scale(14), fontWeight: 'bold', color: color.GRAY_COLOR_500 }}>Thời gian</Text>
            <TouchableOpacity
                onPress={() => {
                    this.TimePicker.showModal(
                        'fromTime',
                        `${moment(new Date()).format('DD/MM/YYYY')} ${this.state.fromTime}`,
                    );
                }}
                activeOpacity={0.5}
                style={{ flexDirection: 'row', alignItems: 'center', borderRadius: scale(10), borderWidth: 0.7, borderColor: color.GRAY_COLOR_400, width: scale(90) }}>
                <Text style={{ marginHorizontal: scale(10), fontSize: scale(14), fontWeight: '500', paddingVertical: scale(7) }}>{fromTime}</Text>
                <MaterialCommunityIcons
                    name='clock-outline'
                    size={scale(22)}
                    color={color.GRAY_COLOR_400}
                    style={{ marginLeft: scale(7), opacity: 0.6 }}
                />
            </TouchableOpacity>
        </View>
    }
    onUseCoupon = (item, index) => {
        this.setState({ coupon: item, index_coupon: index })
    }
    renderCouponItem = ({ item, index }) => {
        const { coupon, index_coupon } = this.state
        console.log("index_coupon", index_coupon)
        return <View style={{}} >
            <View style={{
                width: width - scale(70),
                marginHorizontal: scale(10),
                flexDirection: "row",
                borderLeftWidth: scale(6),
                borderLeftColor: color.ORANGE_COLOR_400,
                paddingVertical: scale(6),
                borderWidth: scale(1.5),
                borderTopLeftRadius: scale(5),
                borderBottomLeftRadius: scale(5),
                borderTopRightRadius: scale(5),
                borderBottomRightRadius: scale(5),
                borderColor: index_coupon == index ? color.ORANGE_COLOR_200 : color.GRAY_COLOR_200,
                backgroundColor: index_coupon == index ? color.ORANGE_COLOR_100 : '#FFFFFF'
            }}>
                {/* <Image
                    style={{ width: scale(22), height: scale(22), marginLeft: scale(5) }}
                    source={require('../../HomeScreen/res/ic_coupon.png')} /> */}
                <View style={{ marginHorizontal: scale(10), flex: 1 }}>
                    <Text style={{ fontSize: scale(13), fontWeight: '600', color: color.GRAY_COLOR_500 }}>{item.code}</Text>
                    <Text numberOfLines={1} style={{ fontSize: scale(13), fontWeight: '500', paddingTop: scale(3) }}>{item.content}</Text>
                    <Text style={{ fontSize: scale(13), color: color.GRAY_COLOR_500, paddingTop: scale(3) }}>
                        Hết hạn: {moment(item.expired_time * 1000).format('DD')} thg {moment(item.expired_time * 1000).format('MM')}, {moment(item.expired_time * 1000).format('YYYY')}
                    </Text>
                </View>
                {index_coupon != index && <TouchableOpacity onPress={() => this.onUseCoupon(item, index)} activeOpacity={0.6} style={{ alignItems: "center", justifyContent: "center", paddingHorizontal: scale(5), borderLeftWidth: scale(1), borderColor: color.ORANGE_COLOR_400, width: scale(60) }}>
                    <Text style={{ fontWeight: "600", color: color.ORANGE_COLOR_400 }}>Sử dụng</Text>
                </TouchableOpacity>}
                {index_coupon == index && <TouchableOpacity onPress={() => this.setState({ coupon: null, index_coupon: -1 })} activeOpacity={0.6} style={{ alignItems: "center", justifyContent: "center", paddingHorizontal: scale(5), borderLeftWidth: scale(1), borderColor: color.ORANGE_COLOR_400, width: scale(60) }}>
                    <Text style={{ fontWeight: "600", color: color.ORANGE_COLOR_400 }}>Huỷ</Text>
                </TouchableOpacity>}
            </View>

        </View>
    }
    renderCoupon = () => {
        const { lst_coupon } = this.props;
        console.log("lst_coupon", lst_coupon)
        if (lst_coupon && lst_coupon.length == 0) {
            return null
        }
        if (lst_coupon && lst_coupon.length > 0) {
            return <View style={{ marginTop: scale(10) }}>
                <Text style={{ fontSize: scale(14), fontWeight: 'bold', color: color.GRAY_COLOR_500, marginLeft: scale(10) }}>Mã giảm giá</Text>
                <ScrollView
                    ref={e => this.scrollCoupon = e}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    style={{ marginVertical: scale(10) }}>
                    <View style={{ flexDirection: "row", alignItems: "center", flex: 1, paddingRight: scale(20) }}>
                        {[...lst_coupon].map((vl, index) => {
                            return this.renderCouponItem({ item: vl, index: index })
                        })}
                    </View>

                </ScrollView>

            </View>
        }
    }
    render() {
        const { seat, lst_select, fromTime } = this.state;
        const { isLoading_getListDriver, lstDriver } = this.props;
        const enablebtn = lst_select.length > 0 ? true : false
        return (
            <View style={{ flex: 1, backgroundColor: "#FFFFFF", borderRadius: scale(20) }}>
                <KeyboardAwareScrollView
                    extraScrollHeight={scale(50)}
                    extraHeight={100}
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
                            <Text style={{ fontSize: scale(20), fontWeight: 'bold' }}>Gửi hàng theo xe</Text>

                        </View>
                        <TouchableOpacity
                            onPress={this.onSendRequestToDriver}
                            disabled={!enablebtn}
                            style={{
                                height: scale(30),
                                borderRadius: scale(20),
                                alignItems: "center",
                                justifyContent: 'center',
                                backgroundColor: enablebtn ? color.ORANGE_COLOR_400 : color.GRAY_COLOR_400,
                                marginRight: scale(10),
                                width: scale(120),
                                flexDirection: 'row'
                            }}>
                            {this.state.isloading && <ActivityIndicator size="small" color={color.ORANGE_COLOR_400} style={{}} />}
                            <Text style={{ fontSize: scale(12), fontWeight: 'bold', color: '#FFFFFF' }}>Gửi yêu cầu</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ width: width, height: 1, backgroundColor: color.GRAY_COLOR_400, opacity: 0.5 }} />

                    <View style={{ marginHorizontal: scale(10), marginTop: scale(5) }}>
                        <Text style={{ fontSize: scale(13), fontWeight: 'bold', color: color.GRAY_COLOR_500 }}>Thông tin đơn hàng</Text>
                    </View>
                    {this.renderInfo()}
                    {this.renderTimeStart()}
                    {this.renderTimeDay()}
                    {this.renderCoupon()}
                    {this.renderLine()}
                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginHorizontal: scale(10), alignItems: 'center', marginTop: scale(5) }}>
                        <Text style={{ fontSize: scale(14), fontWeight: 'bold', color: color.GRAY_COLOR_500 }}>Danh sách nhà xe</Text>
                        <View style={{ flexDirection: 'row', alignItems: "center" }}>
                            <Text style={{ marginRight: scale(5), fontWeight: '600' }}>Tất cả</Text>
                            <CheckBox
                                disabled={false}
                                value={lst_select.length == lstDriver.length ? true : false}
                                onCheckColor={color.ORANGE_COLOR_400}
                                onTintColor={color.ORANGE_COLOR_400}
                                style={{ width: scale(20), height: scale(20), marginHorizontal: scale(5) }}
                                onValueChange={(newValue) => {
                                    if (newValue) {
                                        let arr = lstDriver.map(journey => {
                                            return { journey_id: journey.journey_id, value: journey.driver_id.device_token, price: journey.price, price_shipping: journey.price_shipping }
                                        })
                                        this.setState({ lst_select: arr })
                                    } else {
                                        this.setState({ lst_select: [] })
                                    }
                                }}
                            />
                        </View>
                    </View>
                    {isLoading_getListDriver && this.renderLoading()}
                    {!isLoading_getListDriver && this.renderLstDriver(lstDriver)}
                </KeyboardAwareScrollView>
                <ChooseAppointmentTimeModal
                    confirmAction={(type, date) => {
                        if (type === 'fromTime') {
                            this.setState({ fromTime: date });
                        }


                    }}
                    ref={e => this.TimePicker = e}
                    fromTime={fromTime}
                />
                <ChooseAppointmentDateModal
                    confirmAction={(date) => {
                        this.setState({ day_select: date });
                    }}
                    ref={e => this.chooseAppointmentDateModal = e}></ChooseAppointmentDateModal>
            </View>
        )
    }
}


const mapStateToProps = (state) => {
    return {
        isLoading_getListDriver: state.BookingReducer.isLoading,
        lstDriver: state.BookingReducer.lstDriver,
        distance: state.BookingReducer.distance,
        lst_coupon: state.HomeReducer.lst_coupon,

    }
}
function mapDispatchToProps(dispatch) {
    return {
        updateCurrentBooking: (dt) => {
            dispatch(actionsHome.action.updateCurrentBooking(dt));
        },
        update_list_coupon: (coupon, total) => {
            dispatch(actionsHome.action.updateListCoupon(coupon, total));
        },
        update_crr_coupon: (coupon) => {
            dispatch(actionsHome.action.updateCurrentCoupon(coupon));

        },
        dispatch,
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(FindDriver);

