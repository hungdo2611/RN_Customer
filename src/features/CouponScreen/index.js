import React, { useState, useEffect, PureComponent } from 'react'
import {
    View,
    Text,
    Dimensions,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard,
    SafeAreaView,
    TouchableOpacity,
    FlatList,
    Image

} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons';

import { connect } from 'react-redux'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
    Placeholder,
    PlaceholderMedia,
    PlaceholderLine,
    Fade
} from "rn-placeholder";
import _ from 'lodash';
import { scale } from '../../ultis/scale';
import { color } from '../../constant/color';
import { Navigation } from 'react-native-navigation';
import { getListCoupon } from '../../api/couponAPI'
import moment from 'moment';


const { width, height } = Dimensions.get('window')
const widthBox = width / 2 - scale(30);
class CouponScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            page_number: 1,
            total: 0,
            data: [],
            isloading: false,
            refreshing: false
        };
    }
    getDataCoupon = async (page_number) => {
        const { total, data, isloading } = this.state;
        if (isloading) {
            return
        }
        if (page_number > 1 && page_number * 10 > total) {
            console.log('not data')
            return
        }
        this.setState({ isloading: true })
        const lst_coupon = await getListCoupon(page_number, 10);
        setTimeout(() => {
            this.setState({ isloading: false })

        }, 300)

        if (lst_coupon && !lst_coupon.err) {
            if (page_number == 1) {
                this.setState({ page_number: page_number + 1, total: lst_coupon.total, data: [...lst_coupon.data] })
            } else {
                this.setState({ page_number: page_number + 1, total: lst_coupon.total, data: [...data, ...lst_coupon.data] })

            }
        }
    }
    async componentDidMount() {
        const { data } = this.props;
        if (data) {
            this.setState({ data: data })
        }
    }


    renderEmpty = () => {
        return <View style={{ flex: 2, alignItems: "center", marginTop: scale(30) }}>
            <Image style={{ width: scale(80), height: scale(80) }} source={require('../HistoryScreen/res/ic_no_data.png')} />
            <Text style={{ fontSize: scale(14), fontWeight: '500', marginHorizontal: scale(20), textAlign: 'center', paddingTop: scale(10) }}>Bạn không có mã giảm giá nào! </Text>
        </View>
    }
    renderLoading = () => {
        let arr = [1, 2, 3, 4, 5, 6, 7, 8];
        return <View style={{}}>
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


        </View>
    }
    renderHeader = () => {
        const { componentId } = this.props;
        return <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity activeOpacity={0.6} onPress={() => Navigation.pop(componentId)}>
                <Icon
                    name='arrow-back'
                    size={scale(22)}
                    color="black"
                    style={{ margin: scale(10) }}
                />
            </TouchableOpacity>

            <Text style={{ fontSize: scale(22), fontWeight: 'bold', color: color.GRAY_COLOR_900 }}>Mã giảm giá</Text>
        </View>
    }
    onPressItem = (item) => {
        handleNoti(item.data)
    }
    renderItem = ({ item, index }) => {
        const { isloading } = this.state;
        console.log('item', item)
        if (item.type == "loading") {
            if (!isloading) {
                return
            }
            return this.renderLoading();

        }
        if (item.type == 'header') {
            return this.renderHeader()
        }
        return <View style={{ marginTop: scale(20) }} >
            <View style={{
                marginHorizontal: scale(10),
                flexDirection: "row",
                borderLeftWidth: scale(10),
                borderLeftColor: color.ORANGE_COLOR_400,
                paddingVertical: scale(15),
                borderWidth: scale(1.5),
                borderTopLeftRadius: scale(10),
                borderBottomLeftRadius: scale(10),
                borderTopRightRadius: scale(10),
                borderBottomRightRadius: scale(10),
                borderColor: color.GRAY_COLOR_200
            }}>
                <Image
                    style={{ width: scale(28), height: scale(28), marginLeft: scale(7) }}
                    source={require('../HomeScreen/res/ic_coupon.png')} />
                <View style={{ marginLeft: scale(10), flex: 1 }}>
                    <Text style={{ fontSize: scale(13), fontWeight: '500' }}>{item.content}</Text>
                    <Text style={{ fontSize: scale(13), color: color.GRAY_COLOR_500, paddingTop: scale(3) }}>
                        Hết hạn: ngày {moment(item.expired_time * 1000).format('DD')} tháng {moment(item.expired_time * 1000).format('MM')}, {moment(item.expired_time * 1000).format('YYYY')}
                    </Text>
                </View>
                <TouchableOpacity activeOpacity={0.6} style={{ alignItems: "center", justifyContent: "center", paddingHorizontal: scale(10), borderLeftWidth: scale(1), borderColor: color.ORANGE_COLOR_400 }}>
                    <Text style={{ fontWeight: "600", color: color.ORANGE_COLOR_400 }}>Sử dụng</Text>
                </TouchableOpacity>
            </View>

        </View>
    }
    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <KeyboardAvoidingView
                    style={{
                        flex: 1,
                        justifyContent: "space-between",
                    }}
                    behavior={Platform.OS == 'ios' ? 'padding' : ''}>
                    <FlatList
                        data={[{ type: "header" }, ...this.state.data, { type: "loading" }]}
                        renderItem={this.renderItem}
                        style={{ flex: 1 }}
                        keyExtractor={item => item._id}
                        showsVerticalScrollIndicator={false}
                        onScrollBeginDrag={() => Keyboard.dismiss()}
                        onEndReached={({ distanceFromEnd }) => {
                            if (distanceFromEnd < 0) return;
                            this.getDataCoupon(this.state.page_number)
                        }}
                        onEndReachedThreshold={0.5}
                        refreshing={this.state.refreshing}
                        onRefresh={() => {
                            this.setState({
                                refreshing: true
                            });
                            this.getDataCoupon(1)
                            setTimeout(
                                function () {
                                    //console.oldlog("")
                                    this.setState({
                                        refreshing: false
                                    });
                                }.bind(this),
                                2000
                            );
                        }}
                    />
                    {this.state.data.length == 0 && !this.state.isloading && this.renderEmpty()}
                </KeyboardAvoidingView>
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

export default connect(mapStateToProps, mapDispatchToProps)(CouponScreen)

