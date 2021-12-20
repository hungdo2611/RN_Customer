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
    Keyboard,
    Linking,
    Platform,
    Alert,
    ScrollView
} from 'react-native'

import { connect } from 'react-redux'

import { CONSTANT_TYPE_BOOKING, KEY_ASYNC_NOTI } from '../../constant'

import { scale } from '../../ultis/scale'

import { color } from '../../constant/color'
import { PERMISSIONS, request } from "react-native-permissions";
import moment from 'moment'
import _ from 'lodash';
import {
    pushToBookingScreen,
    pushToBookingHybirdScreen,
    pushToDeliveryScreen,
    pushToMenuScreen,
    pushToOrderInfoScreen,
    pushToCouponScreen,
    pushToNotificationScreen
} from '../../NavigationController'
import Geolocation from 'react-native-geolocation-service';
import { getNearJourneyAPI } from '../../api/bookingApi'
import { getAdressFromLatLng } from '../../api/MapApi'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';
import { CONSTANT_TYPE_JOURNEYS } from '../../constant';
import ActionSheet from 'react-native-actionsheet'
import {
    Placeholder,
    PlaceholderMedia,
    PlaceholderLine,
    Fade
} from "rn-placeholder";
import { constant_type_status_booking } from '../BookingScreen/constant';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import notifee from '@notifee/react-native';
import AsyncStorage from '@react-native-community/async-storage'
import { instanceData } from '../../model'
import FastImage from 'react-native-fast-image'

const { width, height } = Dimensions.get('window')
export let homeInstance = null;
export default class MainView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            location: null,
            isloadingNear: true,
            near_journey: [],
            txt_crrAddress: '',
            activeSlide: 0,
            badge: 0
        };
        this.crrNear = null;
        homeInstance = this;
    }
    // android only
    inCreaseBaddge = () => {
        const { badge } = this.state;
        this.setState({ badge: badge + 1 })
    }
    async componentDidMount() {
        try {
            request(
                Platform.select({
                    android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
                    ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
                })
            ).then(res => {
                console.log("res", res)
                if (res == "granted") {
                    console.log("permsision ok")
                    Geolocation.getCurrentPosition(
                        position => {
                            let location = {
                                lat: position.coords.latitude,
                                lng: position.coords.longitude,
                            }
                            this.setState({
                                location: location
                            });
                            this.getNearJourney(location)
                            this.getCrrLocation(location)
                        },
                        error => console.log('error', error),
                        { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 }
                    );
                } else {
                    if (Platform.OS === "ios" || res == 'blocked') {
                        Alert.alert(
                            'Ứng dụng cần quyền truy cập vị trí',
                            'Ứng dụng cần quyền vị trí của bạn để có thể tạo chuyến và kết nối với tài xế',
                            [
                                {
                                    text: 'Không',

                                    onPress: () => console.log('Permission denied'),
                                    style: 'cancel',
                                },

                                {
                                    text: 'Cài đặt',
                                    onPress: () => {
                                        Linking.openSettings();
                                    }
                                },
                            ],
                        );
                    }

                    // console.log("Location is not enabled");
                }
            });
        } catch (error) {
            console.log("location set error:", error);
        }

        let badge = await AsyncStorage.getItem(KEY_ASYNC_NOTI);
        if (badge) {
            this.setState({ badge: badge >> 0 })
        }


    }
    getCrrLocation = async (location) => {
        // const req = await getAdressFromLatLng(location.lat, location.lng)
        const req = await getAdressFromLatLng(21.019480339716022, 105.77197689840669)

        console.log('getCrrLocation', req)
        if (req.items && req.items[0]) {
            this.setState({ txt_crrAddress: req.items[0].address.county })
        }
    }
    getNearJourney = async (location) => {

        const req = await getNearJourneyAPI(1, 5, { location: location });
        console.log('req near', req)
        if (!req.err) {
            this.setState({ near_journey: [...req.data] })
        }
        console.log("req", req)
    }



    onClickXeKhach = () => {
        const { componentId } = this.props;
        pushToBookingScreen(componentId)
    }
    onHybirdCar = () => {
        const { componentId } = this.props;
        pushToBookingHybirdScreen(componentId)
    }
    onDelivery = () => {
        const { componentId } = this.props;

        pushToDeliveryScreen(componentId)
    }
    renderService = () => {
        const widthBox = (width - 50) / 3

        return <View style={{ flexDirection: 'row', marginTop: scale(20) }}>

            <TouchableOpacity onPress={this.onClickXeKhach} activeOpacity={0.6} style={{ width: widthBox, height: widthBox, margin: 5, backgroundColor: color.GRAY_COLOR_50, borderRadius: scale(10) }}>
                <Text style={{ fontSize: scale(13), fontWeight: 'bold', padding: scale(10) }}>Xe tuyến cố định</Text>
                <Image resizeMode="stretch" style={{ width: widthBox / 2 + scale(20), height: widthBox / 2, position: "absolute", bottom: 10, right: 10 }} source={require('./res/ic_bus.png')} />

            </TouchableOpacity>
            <TouchableOpacity onPress={this.onHybirdCar} activeOpacity={0.6} style={{ width: widthBox, height: widthBox, margin: 5, backgroundColor: color.GRAY_COLOR_50, borderRadius: scale(10) }}>
                <Text style={{ fontSize: scale(13), fontWeight: 'bold', padding: scale(10) }}>Xe tiện chuyến</Text>
                <Image resizeMode="stretch" style={{ width: widthBox / 2 + scale(20), height: widthBox / 2, position: "absolute", bottom: 5, right: 5 }} source={require('./res/ic_tienchuyen.png')} />

            </TouchableOpacity>
            <TouchableOpacity onPress={this.onDelivery} activeOpacity={0.6} style={{ width: widthBox, height: widthBox, margin: 5, backgroundColor: color.GRAY_COLOR_50, borderRadius: scale(10) }}>
                <Text style={{ fontSize: scale(13), fontWeight: 'bold', padding: scale(10) }}>Gửi hàng</Text>
                <Image resizeMode="stretch" style={{ width: widthBox / 2 + scale(20), height: widthBox / 2, position: "absolute", bottom: 5, right: 5 }} source={require('./res/ic_shipping.png')} />

            </TouchableOpacity>
        </View>
    }
    renderInfoCrrBooking = (data) => {
        const { from, to } = data;
        return <View style={{}}>
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    height: scale(80),
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
                    <MaterialCommunityIcons
                        name='dots-vertical'
                        size={scale(14)}
                        color={color.GRAY_COLOR_400}
                        style={{ opacity: 0.6 }}
                        containerStyle={{

                        }}
                    />
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
                        <Text style={{ fontSize: scale(13), fontWeight: '600' }}>{from.address}</Text>
                    </View>
                    <View style={{ height: 0.5, opacity: 0.5, backgroundColor: color.GRAY_COLOR_400 }} />
                    <View style={{ flex: 1, justifyContent: "center" }}>
                        <Text style={{ fontSize: scale(13), fontWeight: '600' }}>{to.address}</Text>
                    </View>

                </View>
            </View>


        </View>
    }
    renderInfo = (from, to) => {
        return <View style={{}}>
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    height: scale(80),
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
                    <MaterialCommunityIcons
                        name='dots-vertical'
                        size={scale(14)}
                        color={color.GRAY_COLOR_400}
                        style={{ opacity: 0.6 }}
                        containerStyle={{

                        }}
                    />
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
                        <Text style={{ fontSize: scale(13), fontWeight: '600' }}>{from.address}</Text>
                    </View>
                    <View style={{ height: 0.5, opacity: 0.5, backgroundColor: color.GRAY_COLOR_400 }} />
                    <View style={{ flex: 1, justifyContent: "center" }}>
                        <Text style={{ fontSize: scale(13), fontWeight: '600' }}>{to.address}</Text>
                    </View>

                </View>
            </View>


        </View>
    }
    onSelectNearJourney = (data) => {
        this.crrNear = data;
        this.ActionSheet.show()
    }
    onPressBanner = (dt) => {
        console.log("onPressBanner", dt)
        const constant_banner = {
            ALL: 'ALL',
            PROMOTION: 'PROMOTION',
            HYBIRD_CAR: 'HYBIRD_CAR',
            SHIPPING: 'SHIPPING',
            COACH_CAR: 'COACH_CAR'
        }
        switch (dt?.type) {
            case constant_banner.ALL:
                this.ActionSheetExplore.show();
                return
            case constant_banner.PROMOTION:
                pushToCouponScreen(this.props.componentId);
                return
            case constant_banner.HYBIRD_CAR:
                pushToBookingHybirdScreen(this.props.componentId);
                return
            case constant_banner.SHIPPING:
                pushToDeliveryScreen(this.props.componentId);
                return
            case constant_banner.COACH_CAR:
                pushToBookingScreen(this.props.componentId);
                return

        }
    }
    renderExplore = () => {
        console.log("instanceData.lst_banner", instanceData.lst_banner)
        return <View style={{ marginVertical: scale(10), marginHorizontal: scale(5), flex: 1 }}>
            <Text style={{ fontSize: scale(18), fontWeight: 'bold' }}>Khám phá</Text>
            <View>
                {instanceData.lst_banner.map(banner => {
                    return <TouchableOpacity style={{ marginTop: scale(20) }} onPress={() => this.onPressBanner(banner)} activeOpacity={0.6}>
                        <FastImage
                            resizeMode="cover"
                            source={{ uri: banner.linkImage }}
                            style={{ height: (width - scale(30)) / 2, borderRadius: scale(15), width: width - scale(30) }}
                        />
                    </TouchableOpacity>
                })}
                {/* <Image style={{ height: scale(170), borderRadius: scale(15), width: '100%', marginTop: scale(10) }} source={require('../DeliveryScreen/res/ic_letgo.jpg')} />
                <Image style={{ height: scale(170), borderRadius: scale(15), width: '100%', marginTop: scale(20) }} source={require('../DeliveryScreen/res/ic_letgo.jpg')} /> */}

            </View>
        </View>
    }
    renderNearItem = ({ item, index }) => {
        return <TouchableOpacity
            onPress={() => this.onSelectNearJourney(item)}
            style={{
                backgroundColor: '#FFFFFF',
                borderRadius: scale(10),
                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 5,
                },
                shadowOpacity: 0.36,
                shadowRadius: 6.68,

                elevation: 11,
                marginHorizontal: scale(5), marginVertical: scale(10),
                paddingHorizontal: scale(15)
            }} key={index}>
            <Text style={{ fontSize: scale(18), fontWeight: "600", paddingTop: scale(10), paddingBottom: scale(5) }}>{item?.driver_id?.name}</Text>
            <View style={{ height: 1, backgroundColor: color.GRAY_COLOR_200 }} />
            {this.renderInfo(item.from, item.to)}
            <View style={{ height: 1, backgroundColor: color.GRAY_COLOR_200 }} />
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: scale(10) }}>
                <Text style={{ fontSize: scale(14), fontWeight: '600' }}>Loại chuyến:</Text>
                <Text style={{ fontWeight: '500' }}>{item.journey_type == CONSTANT_TYPE_JOURNEYS.COACH_CAR ? 'Xe tuyến cố định' : 'Xe tiện chuyến'}</Text>
            </View>
            <View style={{ height: 1, backgroundColor: color.GRAY_COLOR_200 }} />
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: scale(10) }}>
                <Text style={{ fontSize: scale(14), fontWeight: '600' }}>Xem ngay</Text>
                <View
                    style={{
                        width: scale(28),
                        height: scale(28),
                        borderRadius: scale(14),
                        backgroundColor: color.ORANGE_COLOR_400,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <MaterialCommunityIcons
                        name='arrow-right'
                        size={scale(18)}
                        color="#FFFFFF"
                    />
                </View>
            </View>
        </TouchableOpacity>
    }
    renderNearJourney = () => {
        const { near_journey, activeSlide } = this.state;
        return <View style={{ marginVertical: scale(10), marginHorizontal: scale(5) }}>
            <Text style={{ fontSize: scale(18), fontWeight: 'bold' }}>Hành trình gần bạn</Text>
            <Carousel
                layout={'default'}
                ref={(c) => { this._carousel = c; }}
                data={near_journey}
                renderItem={this.renderNearItem}
                sliderWidth={width - scale(30)}
                itemWidth={width - scale(30)}
                onSnapToItem={(index) => this.setState({ activeSlide: index })}
                autoplay={true}
                autoplayInterval={2000}
            />

            {/* {near_journey.map((vl, index) => {

            })} */}

        </View>
    }
    onShowMenu = () => {
        pushToMenuScreen(this.props.componentId)
    }
    renderLoading = () => {
        let arr = [1, 2, 3, 4];
        return <View style={{}}>
            {arr.map((vl, index) => {
                return <Placeholder
                    key={index}
                    Animation={Fade}
                    Left={props => <PlaceholderMedia style={[{ height: scale(40), width: scale(40), marginLeft: scale(10), marginTop: scale(5) }, props.style]} />}
                    style={{ marginVertical: scale(12) }}
                >
                    <PlaceholderLine width={80} height={10} style={{ borderRadius: 10 }} />
                    <PlaceholderLine width={80} height={10} style={{ borderRadius: 10 }} />
                    <PlaceholderLine width={80} height={10} style={{ borderRadius: 10 }} />
                    <PlaceholderLine width={80} height={10} style={{ borderRadius: 10 }} />
                    <PlaceholderLine width={80} height={10} style={{ borderRadius: 10 }} />
                </Placeholder>
            })}


        </View>
    }
    renderCoupon = () => {
        const { lst_coupon, total, componentId } = this.props;
        if (lst_coupon.length > 0) {
            return <TouchableOpacity
                onPress={() => pushToCouponScreen(componentId, { data: lst_coupon })}
                activeOpacity={0.6}
                style={{ flexDirection: "row", alignItems: 'center', backgroundColor: color.GRAY_COLOR_100, marginTop: scale(10), paddingVertical: scale(10), borderRadius: scale(10) }}>
                <Image
                    style={{ width: scale(22), height: scale(22), marginLeft: scale(10) }}
                    source={require('./res/ic_coupon.png')} />
                <Text style={{
                    fontWeight: "500",
                    fontSize: scale(16),
                    marginLeft: scale(10),
                    color: color.ORANGE_COLOR_400, flex: 1
                }}>
                    Bạn có {total} mã giảm giá
                </Text>
                <MaterialIcons color={color.ORANGE_COLOR_400} name="keyboard-arrow-right" size={scale(22)} />
            </TouchableOpacity>
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
    onPressJourney = (crrJourneys) => {
        const { componentId } = this.props;
        if (crrJourneys.booking_type === CONSTANT_TYPE_BOOKING.HYBIRD_CAR) {
            pushToBookingHybirdScreen(componentId)
        } else if (crrJourneys.booking_type === CONSTANT_TYPE_BOOKING.COACH_CAR) {
            pushToBookingScreen(componentId)

        } else {
            pushToDeliveryScreen(componentId)

        }
        // if (crrJourneys.status == constant_type_status_booking.WAITING_DRIVER
        //     || crrJourneys.status == constant_type_status_booking.PROCESSING
        //     || crrJourneys.status == constant_type_status_booking.FINDING_DRIVER) {



        // } else {
        //     pushToOrderInfoScreen(componentId, { data: crrJourneys })
        // }

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

    renderCurrentBooking = (crrJourneys) => {
        const txtStatus = this.getStatusName(crrJourneys.status);
        const txtColor = this.getColorStatus(crrJourneys.status);

        return <TouchableOpacity
            onPress={() => this.onPressJourney(crrJourneys)}
            activeOpacity={0.5}
            style={{
                backgroundColor: '#FFFFFF',
                borderRadius: scale(10),
                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 5,
                },
                shadowOpacity: 0.36,
                shadowRadius: 6.68,

                elevation: 11,
                marginHorizontal: scale(5), marginVertical: scale(10),
                paddingHorizontal: scale(15)
            }}>
            <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: scale(10) }}>
                    <View style={{}}>
                        <Text style={{ fontWeight: '700', fontSize: scale(18) }}>{this.getBookingTypeName(crrJourneys.booking_type)}</Text>
                        <Text style={{ fontWeight: "500", marginTop: scale(5) }}>{moment(crrJourneys?.time_start * 1000).format('HH:mm - DD/MM')}</Text>
                    </View>
                    <View style={{ padding: scale(5), backgroundColor: txtColor, borderRadius: scale(6), width: scale(125), alignItems: "center", justifyContent: "center", height: scale(30) }}>
                        <Text style={{ fontSize: scale(14), fontWeight: "700", color: '#FFFFFF' }}>{txtStatus}</Text>
                    </View>
                </View>

                <View style={{ height: 1, backgroundColor: color.GRAY_COLOR_200 }} />
                {this.renderInfoCrrBooking(crrJourneys)}

                <View style={{ height: 1, backgroundColor: color.GRAY_COLOR_200 }} />
                {/* <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: scale(10) }}>
                    <Text style={{ fontSize: scale(14), fontWeight: '600' }}>Loại chuyến:</Text>
                    <Text style={{ fontWeight: '500' }}>{this.getBookingTypeName(crrJourneys.booking_type)}</Text>
                </View> */}
                <View style={{ height: 1, backgroundColor: color.GRAY_COLOR_200 }} />
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: scale(10) }}>
                    <Text style={{ fontSize: scale(14), fontWeight: '600' }}>Xem ngay</Text>
                    <View
                        style={{
                            width: scale(28),
                            height: scale(28),
                            borderRadius: scale(14),
                            backgroundColor: color.ORANGE_COLOR_400,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <MaterialCommunityIcons
                            name='arrow-right'
                            size={scale(18)}
                            color="#FFFFFF"
                        />
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    }
    onShowNotification = () => {
        this.setState({ badge: 0 })
        if (Platform.OS == 'ios') {
            AsyncStorage.setItem(KEY_ASYNC_NOTI, '0');
            notifee.setBadgeCount(0)
        } else {
            AsyncStorage.setItem(KEY_ASYNC_NOTI, '0');

        }
        pushToNotificationScreen(this.props.componentId)
    }
    render() {
        const { isInCreaseHeight, isLoadingPre, currentBooking } = this.props;
        const { txt_crrAddress, badge } = this.state;
        console.log('badge', badge)
        return (
            <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
                <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: "space-between" }}>
                    <Image style={{ width: scale(120), height: scale(70), }} resizeMode="stretch" source={require('./res/ic_logo.png')} />
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <TouchableOpacity
                            style={{ marginRight: scale(10) }}
                            onPress={this.onShowNotification}
                            activeOpacity={0.6}>
                            <MaterialCommunityIcons
                                name='bell'
                                size={scale(28)}
                            />
                            {badge !== 0 && <View style={{ position: "absolute", right: 0, top: 0, width: scale(14), height: scale(14), borderRadius: scale(7), backgroundColor: color.RED_COLOR, alignItems: "center", justifyContent: "center" }}>
                                <Text style={{ color: 'white', fontWeight: "500", fontSize: scale(11) }}>{badge}</Text>
                            </View>}
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={this.onShowMenu}
                            activeOpacity={0.6}>
                            <MaterialCommunityIcons
                                name='menu'
                                size={scale(28)}
                                containerStyle={{

                                }}
                            />
                        </TouchableOpacity>

                    </View>
                </View>
                {isLoadingPre && this.renderLoading()}
                {!isLoadingPre && <View>
                    <View style={{ backgroundColor: color.GRAY_COLOR_50, borderRadius: scale(10), height: scale(60), alignItems: 'center', flexDirection: "row" }}>
                        <Image style={{
                            height: scale(50),
                            width: scale(70),
                            transform: [{ rotate: '8deg' }],
                        }} source={require('./res/ic_car_head.png')} />
                        <View style={{ marginLeft: scale(10), flex: 1 }}>
                            <Text style={{ fontSize: scale(12), color: color.GRAY_COLOR_500, fontWeight: '500' }}>Địa chỉ của bạn</Text>
                            <Text numberOfLines={1} style={{ fontSize: scale(11), fontWeight: 'bold' }}>{txt_crrAddress}</Text>
                        </View>
                        <View style={{ flex: 1, justifyContent: 'flex-end', flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ width: scale(1), height: scale(20), backgroundColor: color.GRAY_COLOR_500 }} />
                            <Text style={{ fontSize: scale(11), fontWeight: '600', marginHorizontal: scale(12) }}>Bản đồ</Text>
                        </View>
                    </View>

                    {!currentBooking && this.renderService()}
                    {currentBooking && this.renderCurrentBooking(currentBooking)}
                    {this.renderCoupon()}
                    {!currentBooking && this.state.near_journey.length > 0 && this.renderNearJourney()}
                    {this.renderExplore()}
                </View>}
                <ActionSheet
                    ref={o => this.ActionSheet = o}
                    title={'Chọn dịch vụ ?'}
                    options={['Gửi hàng', 'Đi xe', 'Huỷ']}
                    cancelButtonIndex={2}
                    // destructiveButtonIndex={2}
                    onPress={(index) => {
                        if (index == 0) {
                            const { journey_type, from, to } = this.crrNear;

                            pushToDeliveryScreen(this.props.componentId, { from: from, to: to })
                        }
                        if (index == 1) {
                            const { journey_type, from, to } = this.crrNear;
                            if (journey_type == CONSTANT_TYPE_JOURNEYS.HYBIRD_CAR) {
                                pushToBookingHybirdScreen(this.props.componentId, { from: from, to: to })
                            } else {
                                pushToBookingScreen(this.props.componentId, { from: from, to: to })
                            }
                        }
                    }}
                />
                <ActionSheet
                    ref={o => this.ActionSheetExplore = o}
                    title={'Chọn dịch vụ ?'}
                    options={['Gửi hàng', 'Xe Tiện chuyến', 'Xe tuyến cố định', 'Huỷ']}
                    cancelButtonIndex={3}
                    // destructiveButtonIndex={2}
                    onPress={(index) => {
                        if (index == 0) {
                            pushToDeliveryScreen(this.props.componentId)
                        }
                        if (index == 1) {
                            pushToBookingHybirdScreen(this.props.componentId)
                        }
                        if (index == 2) {
                            pushToBookingScreen(this.props.componentId)
                        }
                    }}
                />
            </ScrollView>
        )
    }
}





