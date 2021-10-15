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
    SafeAreaView,
    ActivityIndicator,
    Alert,
    ScrollView
} from 'react-native'

import { connect } from 'react-redux'


import { scale } from '../../ultis/scale'

import { color } from '../../constant/color'
import Permissions from 'react-native-permissions';

import _ from 'lodash';
import { StackActions } from '@react-navigation/native';
import { pushToBookingScreen, pushToBookingHybirdScreen, pushToDeliveryScreen, pushToMenuScreen } from '../../NavigationController'
import Geolocation from 'react-native-geolocation-service';
import { getNearJourneyAPI } from '../../api/bookingApi'
import { getAdressFromLatLng } from '../../api/MapApi'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';
import { CONSTANT_TYPE_JOURNEYS } from '../../constant';
import ActionSheet from 'react-native-actionsheet'

const { width, height } = Dimensions.get('window')

export default class MainView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            location: null,
            isloadingNear: true,
            near_journey: [],
            txt_crrAddress: ''
        };
        this.crrNear = null
    }
    componentDidMount() {
        Permissions.check('location').then(response => {
            // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
            console.log('respone check permission', response);
            if (response !== 'authorized') {
                if (response !== 'denied') {
                    Permissions.check('location', { type: 'always' }).then(res => {
                        console.log('respone request permission ', res);
                    });
                } else {
                    Alert.alert(
                        'Ứng dụng cần quyền truy cập vị trí',
                        'Ứng dụng cần quyền vị trí của bạn để có thể kết nối với mọi người',
                        [
                            {
                                text: 'Không',

                                onPress: () => console.log('Permission denied'),
                                style: 'cancel',
                            },

                            {
                                text: 'Cài đặt',
                                onPress: Permissions.openSettings,
                            },
                        ],
                    );
                }
            }
        });
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
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    }
    getCrrLocation = async (location) => {
        const req = await getAdressFromLatLng(location.lat, location.lng)
        if (req.items && req.items[0]) {
            this.setState({ txt_crrAddress: req.items[0].address.county })
        }
    }
    getNearJourney = async (location) => {
        console.log("location", location)

        const req = await getNearJourneyAPI(1, 5, { location: location });
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
    renderExplore = () => {
        return <View style={{ marginVertical: scale(10), marginHorizontal: scale(5) }}>
            <Text style={{ fontSize: scale(18), fontWeight: 'bold' }}>Khám phá</Text>
            <View>
                <Image style={{ height: scale(170), borderRadius: scale(15), width: '100%', marginTop: scale(10) }} source={require('../DeliveryScreen/res/ic_letgo.jpg')} />
                <Image style={{ height: scale(170), borderRadius: scale(15), width: '100%', marginTop: scale(20) }} source={require('../DeliveryScreen/res/ic_letgo.jpg')} />

            </View>
        </View>
    }
    renderNearJourney = () => {
        const { near_journey } = this.state;
        return <View style={{ marginVertical: scale(10), marginHorizontal: scale(5) }}>
            <Text style={{ fontSize: scale(18), fontWeight: 'bold' }}>Hành trình gần bạn</Text>
            {near_journey.map((vl, index) => {
                return <TouchableOpacity
                    onPress={() => this.onSelectNearJourney(vl)}
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
                    <Text style={{ fontSize: scale(18), fontWeight: "600", paddingTop: scale(10), paddingBottom: scale(5) }}>{vl?.driver_id?.name}</Text>
                    <View style={{ height: 1, backgroundColor: color.GRAY_COLOR_200 }} />
                    {this.renderInfo(vl.from, vl.to)}
                    <View style={{ height: 1, backgroundColor: color.GRAY_COLOR_200 }} />
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: scale(10) }}>
                        <Text style={{ fontSize: scale(14), fontWeight: '600' }}>Loại chuyến:</Text>
                        <Text style={{ fontWeight: '500' }}>{vl.journey_type == CONSTANT_TYPE_JOURNEYS.COACH_CAR ? 'Xe tuyến cố định' : 'Xe tiện chuyến'}</Text>
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
            })}


        </View>
    }
    onShowMenu = () => {
        pushToMenuScreen(this.props.componentId)
    }

    render() {
        const { isInCreaseHeight } = this.props;
        const { txt_crrAddress } = this.state;
        return (
            <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, backgroundColor: "#FFFFFF", marginHorizontal: scale(10) }}>
                <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: "space-between" }}>
                    <Image style={{ width: scale(120), height: scale(70) }} resizeMode="stretch" source={require('./res/ic_logo.png')} />
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <MaterialCommunityIcons
                            name='bell'
                            size={scale(24)}
                            style={{ marginRight: scale(10) }}
                            containerStyle={{

                            }}
                        />
                        <TouchableOpacity
                            onPress={this.onShowMenu}
                            activeOpacity={0.6}>
                            <MaterialCommunityIcons
                                name='menu'
                                size={scale(24)}
                                containerStyle={{

                                }}
                            />
                        </TouchableOpacity>

                    </View>
                </View>
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

                {this.renderService()}
                {this.renderExplore()}
                {this.state.near_journey.length > 0 && this.renderNearJourney()}
                <ActionSheet
                    ref={o => this.ActionSheet = o}
                    title={'Chọn dịch vụ ?'}
                    options={['Gửi hàng', 'Đi xe', 'Huỷ']}
                    cancelButtonIndex={2}
                    // destructiveButtonIndex={2}
                    onPress={(index) => {
                        if (index == 0) {
                            const { journey_type, from, to } = this.crrNear;

                            //ffrom library
                            pushToDeliveryScreen(this.props.componentId, { from: from, to: to })
                        }
                        if (index == 1) {
                            //ffrom camera
                            const { journey_type, from, to } = this.crrNear;
                            if (journey_type == CONSTANT_TYPE_JOURNEYS.HYBIRD_CAR) {
                                pushToBookingHybirdScreen(this.props.componentId)
                            } else {
                                pushToBookingScreen(this.props.componentId, { from: from, to: to })
                            }
                        }
                    }}
                />
            </ScrollView>
        )
    }
}





