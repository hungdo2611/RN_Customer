import React, { useState, useEffect, PureComponent } from 'react'
import {
    Image,
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    FlatList,
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
import {
    Placeholder,
    PlaceholderMedia,
    PlaceholderLine,
    Fade
} from "rn-placeholder";
import { Rating, AirbnbRating } from 'react-native-ratings';
import moment from 'moment';

const { width, height } = Dimensions.get('window')


class InfoDriverScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data_driver: {},
            page_number: 1,
            total: 0,
            data: [],
        };
    }
    async componentDidMount() {
        const { data } = this.props;

        let req = await getLicenseDriver(data.verified_status)
        if (req && !req.err) {
            console.log("123")
            this.setState({ data_driver: req.data })
        }
        this.getDataRatingRecent(1, data._id);

    }
    getDataRatingRecent = async (page_number, id) => {
        const { total, data, isloading } = this.state;
        if (isloading) {
            return
        }
        if (page_number > 1 && page_number * 10 > total) {
            console.log('not data')
            return
        }
        this.setState({ isloading: true })
        const rate_recent = await getRecentRatingDriver(page_number, 10, id);
        console.log("rate_recent", rate_recent)
        setTimeout(() => {
            this.setState({ isloading: false })
        }, 300)

        if (rate_recent && !rate_recent.err) {
            if (page_number == 1) {
                this.setState({ page_number: page_number + 1, total: rate_recent.total, data: rate_recent.data })
            } else {
                this.setState({ page_number: page_number + 1, total: rate_recent.total, data: [...data, ...rate_recent.data] })

            }
        }
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
                <Text style={{ fontWeight: "500", paddingVertical: scale(5) }}>{ratingPoint.value.toFixed(2)} *</Text>
            </View>
        }
    }
    renderStar = (number) => {
        let arr = [];
        let index = 0;
        while (index < number) {
            index = index + 1;
            arr.push(1);
        }
        return <View style={{ flexDirection: "row", alignItems: "center", paddingTop: scale(5) }}>
            {arr.map(vl => {
                return <FontAwesomeIcon
                    name="star"
                    color={color.ORANGE_COLOR_400}
                    size={scale(16)}
                />
            })}
        </View>
    }

    renderItem = ({ item, type }) => {
        const { isloading } = this.state;
        if (type == "loading") {
            if (!isloading) {
                return
            }
            return this.renderLoading();

        }
        let avatar = item?.avatar ? item?.avatar : '';
        let name = item?.name ? item?.name : 'Người dùng ẩn danh';
        let rate = item?.rate_value ? item?.rate_value : 0;
        let comment = item?.comment ? item?.comment : 'Không có bình luận';
        let time = item?.time ? (item?.time * 1000) >> 0 : Date.now();
        return <View style={{ flexDirection: 'row', paddingVertical: scale(7), borderBottomWidth: 1, borderColor: color.GRAY_COLOR_200 }}>
            {!avatar || avatar == '' ? <View style={{ width: scale(24), height: scale(24), borderRadius: scale(12), alignItems: 'center', justifyContent: 'center', backgroundColor: color.ORANGE_COLOR_400 }}>
                <FontAwesomeIcon
                    name="user-alt"
                    color="#FFFFFF"
                    size={scale(12)}
                />
            </View> : <View>
                <FastImage style={{ width: scale(24), height: scale(24), borderRadius: scale(12) }} source={{ uri: avatar }} />
            </View>}
            <View style={{ marginHorizontal: scale(10) }}>
                <Text style={{ fontWeight: "500", color: color.GRAY_COLOR_700 }}>{name}</Text>
                {this.renderStar(rate)}
                <Text style={{ paddingTop: scale(5), fontWeight: "600" }}>{comment}</Text>
                <Text style={{ paddingTop: scale(5) }}>{moment(time).format('HH:mm - DD/MM/YYYY')}</Text>
            </View>
        </View>
    }
    renderLoading = () => {
        let arr = [1, 2, 3];
        return <View style={{}}>
            {arr.map(vl => {
                return <Placeholder
                    Animation={Fade}
                    Left={props => <PlaceholderMedia style={[{ height: scale(50), width: scale(50), marginLeft: scale(10), marginTop: scale(5) }, props.style]} />}
                    style={{ marginVertical: scale(12) }}
                >
                    <PlaceholderLine width={90} height={10} style={{ borderRadius: 10 }} />
                    <PlaceholderLine width={90} height={10} style={{ borderRadius: 10 }} />
                    <PlaceholderLine width={90} height={10} style={{ borderRadius: 10 }} />
                    <PlaceholderLine width={90} height={10} style={{ borderRadius: 10 }} />
                    <PlaceholderLine width={90} height={10} style={{ borderRadius: 10 }} />
                    <PlaceholderLine width={90} height={10} style={{ borderRadius: 10 }} />
                    <PlaceholderLine width={90} height={10} style={{ borderRadius: 10 }} />
                    <PlaceholderLine width={90} height={10} style={{ borderRadius: 10 }} />

                </Placeholder>
            })}


        </View>
    }

    recentRate = () => {
        return <View style={{ flex: 1, marginHorizontal: scale(10), marginTop: scale(15) }}>
            <Text style={{ fontSize: scale(15), fontWeight: '500', color: color.GRAY_COLOR_500 }}>Đánh giá gần đây</Text>
            <View style={{ height: 1, backgroundColor: color.GRAY_COLOR_200, marginTop: scale(7) }} />
            <FlatList
                data={[...this.state.data, { type: "loading" }]}
                renderItem={this.renderItem}
                style={{ flex: 1 }}
                keyExtractor={item => item._id}
                showsVerticalScrollIndicator={false}
                onEndReached={({ distanceFromEnd }) => {
                    if (distanceFromEnd < 0) return;
                    this.getDataRatingRecent(this.state.page_number, this.props.data._id)
                }}
                onEndReachedThreshold={0.5}

            />
        </View>
    }
    render() {
        const { componentId, data } = this.props;
        const { avatar, name, license_plate } = data;
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

