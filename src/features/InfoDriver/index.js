import React, { useState, useEffect, PureComponent } from 'react'
import {
    Image,
    View,
    Text,
    TouchableOpacity,
    Dimensions,

    SafeAreaView,

} from 'react-native'
import FastImage from 'react-native-fast-image';

import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialIcons';
import { scale } from '../../ultis/scale'
import _ from 'lodash';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';
import { color } from '../../constant/color';
import { Navigation } from 'react-native-navigation';
import { getLicenseDriver, getRecentRatingDriver } from '../../api/bookingApi'
const { width, height } = Dimensions.get('window')


class InfoDriverScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data_driver: {},
        };
    }
    async componentDidMount() {
        const { data } = this.props;

        let req = await getLicenseDriver(data.verified_status)
        if (req && !req.err) {
            console.log("123")
            this.setState({ data_driver: req.data })
        }
        const reqComment = await getRecentRatingDriver(1, 10, data._id);
        console.log("reqComment", reqComment)
    }
    renderAvatar = () => {
        const { componentId, data } = this.props;
        const { avatar, name, license_plate } = data;
        return <View style={{ flexDirection: "row", margin: scale(10), alignItems: "center" }}>
            {avatar == undefined || avatar == null || avatar == '' ? <View style={{ width: scale(36), height: scale(36), borderRadius: scale(18), alignItems: 'center', justifyContent: 'center', backgroundColor: color.ORANGE_COLOR_400 }}>
                <FontAwesomeIcon
                    name="user-alt"
                    color="#FFFFFF"
                    size={scale(14)}
                />
            </View> : <View>
                <FastImage style={{ width: scale(60), height: scale(60), borderRadius: scale(30) }} source={{ uri: avatar }} />
            </View>}
            <View style={{ marginHorizontal: scale(15), flex: 1 }}>
                <Text style={{ fontSize: scale(17), fontWeight: "600" }}>{name}</Text>
                <Text style={{ fontSize: scale(15), fontWeight: "500" }}>{license_plate}</Text>
            </View>
            <View
                style={{
                    width: scale(28),
                    height: scale(28),
                    borderRadius: scale(18),
                    backgroundColor: color.GREEN_COLOR_300,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginHorizontal: scale(10)
                }}
            >
                <FontAwesomeIcon
                    name='check'
                    size={scale(13)}
                    color="#FFFFFF"
                />
            </View>
        </View>
    }
    getTypeCar = (type) => {
        const nameType = [
            { label: "Xe mô tô", value: 1 },
            { label: "4 chỗ nhỏ (hatchback)", value: 4 },
            { label: "4 chỗ cốp rộng (sedan)", value: 5 },
            { label: "7 chỗ phổ thông", value: 7 },
            { label: "9 chỗ Dcar", value: 9 },
            { label: "16 chỗ", value: 16 },
            { label: "29-45 chỗ", value: 60 },
            { label: "Xe bán tải", value: 70 },
            { label: "Xe tải", value: 71 }
        ];
        let crr = nameType.find(vl => {
            return vl.value === type
        })
        return crr.label
    }
    renderCarType = () => {
        const { vehicle_type } = this.state.data_driver;
        if (vehicle_type) {
            return <View style={{ marginHorizontal: scale(10), borderBottomWidth: 1, borderColor: color.GRAY_COLOR_200 }}>
                <Text style={{ fontSize: scale(15), fontWeight: '500', color: color.GRAY_COLOR_500 }}>Loại xe</Text>
                <Text style={{ fontWeight: "500", paddingVertical: scale(5) }}>{this.getTypeCar(vehicle_type)}</Text>
            </View>
        }
    }
    renderTurnRate = () => {
        const { ratingPoint } = this.props.data;
        if (ratingPoint) {
            return <View style={{ marginHorizontal: scale(10), borderBottomWidth: 1, borderColor: color.GRAY_COLOR_200, marginTop: scale(15) }}>
                <Text style={{ fontSize: scale(15), fontWeight: '500', color: color.GRAY_COLOR_500 }}>Số lượt đánh giá</Text>
                <Text style={{ fontWeight: "500", paddingVertical: scale(5) }}>{ratingPoint.count} lần</Text>
            </View>
        }
    }
    renderValueRate = () => {
        const { ratingPoint } = this.props.data;
        if (ratingPoint) {
            return <View style={{ marginHorizontal: scale(10), borderBottomWidth: 1, borderColor: color.GRAY_COLOR_200, marginTop: scale(15) }}>
                <Text style={{ fontSize: scale(15), fontWeight: '500', color: color.GRAY_COLOR_500 }}>Điểm đánh giá trung bình</Text>
                <Text style={{ fontWeight: "500", paddingVertical: scale(5) }}>{ratingPoint.value} *</Text>
            </View>
        }
    }
    recentRate = () => {
        return <View style={{ marginHorizontal: scale(10), marginTop: scale(15) }}>
            <Text style={{ fontSize: scale(15), fontWeight: '500', color: color.GRAY_COLOR_500 }}>Đánh giá gần đây</Text>
            <View style={{ height: 1, backgroundColor: color.GRAY_COLOR_200, marginVertical: scale(7) }} />

        </View>
    }
    render() {
        const { componentId, data } = this.props;
        const { avatar, name, license_plate } = data;
        console.log("data", data)
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <TouchableOpacity activeOpacity={0.6} onPress={() => Navigation.dismissModal(componentId)}>
                        <Icon
                            name='arrow-back'
                            size={scale(22)}
                            color="black"
                            style={{ margin: scale(10) }}
                        />
                    </TouchableOpacity>

                    <Text style={{ fontSize: scale(22), fontWeight: 'bold', color: color.GRAY_COLOR_900 }}>Thông tin tài xế</Text>
                </View>
                <View style={{ height: 1, backgroundColor: color.GRAY_COLOR_200, marginVertical: scale(5) }} />
                {this.renderAvatar()}
                {this.renderCarType()}
                {this.renderTurnRate()}
                {this.renderValueRate()}
                {this.recentRate()}
            </SafeAreaView>
        )
    }
}



const mapStateToProps = (state) => {
    return {
        user_info: state.HomeReducer.user_info
    }
}

const mapDispatchToProps = (dispatch) => {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(InfoDriverScreen)

