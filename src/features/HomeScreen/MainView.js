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
import { pushToBookingScreen, pushToBookingHybirdScreen, pushToDeliveryScreen } from '../../NavigationController'
import Geolocation from 'react-native-geolocation-service';
import { getNearJourneyAPI } from '../../api/bookingApi'

const { width, height } = Dimensions.get('window')

export default class MainView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            location: null,
            isloadingNear: true,
        };
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
            },
            error => console.log('error', error),
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    }
    getNearJourney = async (location) => {
        console.log("location", location)
        const req = await getNearJourneyAPI(1, 5, { location: location });
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
    renderNearJourney = () => {
        return <View style={{ marginVertical: scale(10) }}>
            <Text style={{ fontSize: scale(14), fontWeight: 'bold' }}>Chuyến xe gần bạn</Text>
        </View>
    }

    render() {
        const { isInCreaseHeight } = this.props;
        return (
            <View style={{ flex: 1, backgroundColor: "#FFFFFF", borderRadius: scale(20), marginHorizontal: scale(10) }}>
                <View style={{ backgroundColor: color.GRAY_COLOR_50, borderRadius: scale(10), height: scale(50), alignItems: 'center', flexDirection: "row" }}>
                    <Image style={{
                        height: scale(50),
                        width: scale(70),
                        transform: [{ rotate: '8deg' }],
                    }} source={require('./res/ic_car_head.png')} />
                    <View style={{ marginLeft: scale(10) }}>
                        <Text style={{ fontSize: scale(12), color: color.GRAY_COLOR_500, fontWeight: '500' }}>Địa chỉ của bạn</Text>
                        <Text style={{ fontSize: scale(11), fontWeight: 'bold' }}>Hà Nội</Text>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'flex-end', flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ width: scale(1), height: scale(20), backgroundColor: color.GRAY_COLOR_500 }} />
                        <Text style={{ fontSize: scale(11), fontWeight: '600', marginHorizontal: scale(12) }}>Bản đồ</Text>
                    </View>
                </View>
                <ScrollView scrollEnabled={isInCreaseHeight} showsVerticalScrollIndicator={false}>

                    {this.renderService()}
                    {this.renderNearJourney()}
                </ScrollView>
            </View>
        )
    }
}





