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
import FastImage from 'react-native-fast-image';

import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialIcons';
import { scale } from '../../ultis/scale'
import _ from 'lodash';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';
import { color } from '../../constant/color';
import { Navigation } from 'react-native-navigation';
import { logOutAPI } from '../../api/loginApi'
import { deleteLocalData } from '../../model'
import { setRootToLogin, pushToHistoryScreen, pushToEditInfoScreen, pushToCouponScreen } from '../../NavigationController'
const { width, height } = Dimensions.get('window')


class MenuScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }
    renderProfile = () => {
        const { componentId, user_info } = this.props;
        const uri_image = user_info?.avatar
        return <TouchableOpacity onPress={() => pushToEditInfoScreen(componentId)} activeOpacity={0.6} style={{ flexDirection: "row", marginTop: scale(10) }}>
            {uri_image == undefined || uri_image == null || uri_image == '' ? <View style={{ width: scale(36), height: scale(36), borderRadius: scale(18), alignItems: 'center', justifyContent: 'center', backgroundColor: color.ORANGE_COLOR_400 }}>
                <FontAwesomeIcon
                    name="user-alt"
                    color="#FFFFFF"
                    size={scale(14)}
                />
            </View> : <View>
                <FastImage style={{ width: scale(60), height: scale(60), borderRadius: scale(30) }} source={{ uri: uri_image }} />
            </View>}
            <View style={{ marginLeft: scale(15), flex: 1 }}>
                <Text style={{ fontWeight: '600', fontSize: scale(20), fontWeight: 'bold', color: color.GRAY_COLOR_900 }}>{user_info?.name}</Text>
                <Text style={{ fontSize: scale(16), color: color.GRAY_COLOR_500, fontWeight: '500', marginTop: scale(5) }}>{user_info?.phone}</Text>
            </View>
            <FontAwesomeIcon
                name="chevron-right"
                color={color.GRAY_COLOR_500}
                size={scale(20)}
                style={{ marginHorizontal: scale(10) }}
            />
        </TouchableOpacity>
    }
    renderOrder = () => {
        return <TouchableOpacity
            onPress={() => { pushToHistoryScreen(this.props.componentId) }}
            activeOpacity={0.6}
            style={{ flexDirection: 'row', alignItems: "center" }}>
            <View style={{ width: scale(28), height: scale(28), borderRadius: scale(14), backgroundColor: color.ORANGE_COLOR_400, alignItems: "center", justifyContent: "center" }}>
                <Image style={{ tintColor: '#FFFFFF', width: scale(15), height: scale(15) }} source={require('./res/ic_order.png')} />
            </View>
            <View style={{ flex: 1, marginLeft: scale(20), flexDirection: 'row', alignItems: "center", borderBottomWidth: 2, paddingVertical: scale(16), borderColor: color.GRAY_COLOR_200 }}>
                <Text style={{ color: color.GRAY_COLOR_900, fontSize: scale(15), fontWeight: '700', flex: 1 }}>Đơn hàng</Text>
                <Text style={{ fontSize: scale(12), color: color.GRAY_COLOR_700 }}>Xem chuyến đi và lịch sử</Text>
                <FontAwesomeIcon
                    name="chevron-right"
                    color={color.GRAY_COLOR_500}
                    size={scale(15)}
                    style={{ marginLeft: scale(8) }}
                />
            </View>

        </TouchableOpacity>
    }
    renderVocher = () => {
        return <TouchableOpacity onPress={() => pushToCouponScreen(this.props.componentId)} style={{ flexDirection: 'row', alignItems: "center" }}>
            <View style={{ width: scale(28), height: scale(28), borderRadius: scale(14), backgroundColor: color.ORANGE_COLOR_400, alignItems: "center", justifyContent: "center" }}>
                <FontAwesomeIcon
                    name="tag"
                    color="#FFFFFF"
                    size={scale(15)}
                />
            </View>
            <View style={{ flex: 1, marginLeft: scale(20), flexDirection: 'row', alignItems: "center", borderBottomWidth: 2, paddingVertical: scale(16), borderColor: color.GRAY_COLOR_200 }}>
                <Text style={{ color: color.GRAY_COLOR_900, fontSize: scale(15), fontWeight: '700', flex: 1 }}>Mã Voucher</Text>
                <FontAwesomeIcon
                    name="chevron-right"
                    color={color.GRAY_COLOR_500}
                    size={scale(15)}
                    style={{ marginLeft: scale(8) }}
                />
            </View>

        </TouchableOpacity>
    }
    renderSupport = () => {
        return <View style={{ flexDirection: 'row', alignItems: "center" }}>
            <View style={{ width: scale(28), height: scale(28), borderRadius: scale(14), backgroundColor: color.ORANGE_COLOR_400, alignItems: "center", justifyContent: "center" }}>
                <FontAwesomeIcon
                    name="question"
                    color="#FFFFFF"
                    size={scale(15)}
                />
            </View>
            <View style={{ flex: 1, marginLeft: scale(20), flexDirection: 'row', alignItems: "center", borderBottomWidth: 2, paddingVertical: scale(16), borderColor: color.GRAY_COLOR_200 }}>
                <Text style={{ color: color.GRAY_COLOR_900, fontSize: scale(15), fontWeight: '700', flex: 1 }}>Hỗ trợ góp ý</Text>
                <FontAwesomeIcon
                    name="chevron-right"
                    color={color.GRAY_COLOR_500}
                    size={scale(15)}
                    style={{ marginLeft: scale(8) }}
                />
            </View>

        </View>
    }
    renderAboutUs = () => {
        return <View style={{ flexDirection: 'row', alignItems: "center" }}>
            <View style={{ width: scale(28), height: scale(28), borderRadius: scale(14), backgroundColor: color.ORANGE_COLOR_400, alignItems: "center", justifyContent: "center" }}>
                <FontAwesomeIcon
                    name="info"
                    color="#FFFFFF"
                    size={scale(15)}
                />
            </View>
            <View style={{ flex: 1, marginLeft: scale(20), flexDirection: 'row', alignItems: "center", borderBottomWidth: 2, paddingVertical: scale(16), borderColor: color.GRAY_COLOR_200 }}>
                <Text style={{ color: color.GRAY_COLOR_900, fontSize: scale(15), fontWeight: '700', flex: 1 }}>Điều khoản dịch vụ</Text>
                <FontAwesomeIcon
                    name="chevron-right"
                    color={color.GRAY_COLOR_500}
                    size={scale(15)}
                    style={{ marginLeft: scale(8) }}
                />
            </View>

        </View>
    }
    onLogOut = async () => {
        Alert.alert(
            'Thông báo',
            'Bạn có chắc chắn muốn đăng xuất?',
            [
                {
                    text: 'Không',

                    onPress: () => console.log('Permission denied'),
                    style: 'cancel',
                },

                {
                    text: 'Đồng ý',
                    onPress: async () => {
                        await logOutAPI();
                        deleteLocalData();
                        setRootToLogin();
                    },
                },
            ],
        );

    }
    render() {
        const { componentId, user_info } = this.props;
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <TouchableOpacity activeOpacity={0.6} onPress={() => Navigation.pop(componentId)}>
                        <Icon
                            name='arrow-back'
                            size={scale(22)}
                            color="black"
                            style={{ margin: scale(10) }}
                        />
                    </TouchableOpacity>

                    <Text style={{ fontSize: scale(22), fontWeight: 'bold', color: color.GRAY_COLOR_900 }}>Thông tin tài khoản</Text>
                </View>
                <ScrollView style={{ flex: 1, marginHorizontal: scale(13) }}>
                    {this.renderProfile()}
                    <Text style={{ fontSize: scale(16), fontWeight: "600", marginVertical: scale(10), color: color.GRAY_COLOR_900, marginTop: scale(30) }}>Tài khoản</Text>
                    {this.renderOrder()}
                    {this.renderVocher()}
                    {this.renderSupport()}
                    {this.renderAboutUs()}
                </ScrollView>
                <TouchableOpacity onPress={this.onLogOut} activeOpacity={0.6} style={{ marginHorizontal: scale(15), borderRadius: scale(20), borderColor: color.RED_300, height: scale(40), borderWidth: 2, alignItems: 'center', justifyContent: "center", marginBottom: scale(20) }}>
                    <Text style={{ fontSize: scale(15), fontWeight: "600", color: color.RED_300 }}>Đăng xuất</Text>
                </TouchableOpacity>
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

export default connect(mapStateToProps, mapDispatchToProps)(MenuScreen)

