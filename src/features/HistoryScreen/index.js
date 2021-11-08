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
    Image,
    RefreshControl
} from 'react-native'

import { connect } from 'react-redux'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { pushToOrderInfoScreen, pushToBookingScreen, pushToBookingHybirdScreen, pushToDeliveryScreen } from '../../NavigationController'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';
import ActionSheet from 'react-native-actionsheet'

import {
    Placeholder,
    PlaceholderMedia,
    PlaceholderLine,
    Fade
} from "rn-placeholder";
import { CONSTANT_TYPE_BOOKING } from '../../constant'

import _ from 'lodash';
import { scale } from '../../ultis/scale';
import { color } from '../../constant/color';
import { getHistoryBookingAPI } from '../../api/bookingApi'
import { Navigation } from 'react-native-navigation';
import { constant_type_status_booking } from '../BookingScreen/constant';
import moment from 'moment';

import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';

const { width, height } = Dimensions.get('window')
const widthBox = width / 2 - scale(30);


const toastConfig = {
    /* 
      overwrite 'success' type, 
      modifying the existing `BaseToast` component
    */
    success: (props) => (
        <BaseToast
            {...props}
            style={{ borderLeftColor: color.GREEN_COLOR_300, paddingHorizontal: scale(10), height: scale(70), borderLeftWidth: scale(8) }}
            text1Style={{
                color: color.GREEN_COLOR_400,
                fontSize: 17
            }}
            text2Style={{
                fontSize: 15,
                color: 'black'
            }}
        />
    ),

    /*
      Reuse the default ErrorToast toast component
    */
    error: (props) => (
        <BaseToast
            {...props}
            style={{ borderLeftColor: color.RED_COLOR, height: scale(70), paddingHorizontal: scale(10), borderLeftWidth: scale(8) }}
            text1Style={{
                color: color.RED_COLOR,
                fontSize: 17
            }}
            text2Style={{
                fontSize: 15,
                color: 'black'
            }}
        />
    ),
    /* 
      or create a completely new type - `my_custom_type`,
      building the layout from scratch
    */
    my_custom_type: ({ text1, props, ...rest }) => (
        <View style={{ height: 60, width: '100%', backgroundColor: 'tomato' }}>
            <Text>{text1}</Text>
        </View>
    )
};

export let instance_history = null;

class HistoryScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            page_number: 1,
            total: 0,
            data: [],
            isloading: false,
            filter_type: '',
            refreshing: false,
        };
    }


    getDataHistory = async (page_number) => {
        const { total, data, isloading, filter_type } = this.state;
        if (isloading) {
            return
        }
        if (page_number > 1 && page_number * 10 > total) {
            console.log('not data')
            return
        }
        this.setState({ isloading: true })
        const lst_history = await getHistoryBookingAPI(page_number, 10, filter_type);
        setTimeout(() => {
            this.setState({ isloading: false })

        }, 300)

        if (lst_history && !lst_history.err) {
            if (page_number == 1) {
                this.setState({ page_number: page_number + 1, total: lst_history.total, data: lst_history.data })
            } else {
                this.setState({ page_number: page_number + 1, total: lst_history.total, data: [...data, ...lst_history.data] })

            }
        }
    }
    updateData = (dt) => {
        if (dt) {
            let index = this.state.data.findIndex(vl => {
                return vl._id == dt._id
            })
            if (index != -1) {
                let newData = this.state.data;
                newData[index] = dt;
                this.setState({ data: newData })
            }
        }

    }

    async componentDidMount() {
        instance_history = this;
        this.getDataHistory(1);
    }
    componentWillUnmount() {
        instance_history = null;
    }


    renderItemMenu = (text, icon, onPress) => {
        return <TouchableOpacity onPress={onPress} style={{ width: widthBox, height: widthBox - scale(30), borderRadius: scale(10), borderWidth: 1, borderColor: color.GRAY_COLOR_400, alignItems: 'center', justifyContent: 'center', marginHorizontal: scale(10), marginVertical: scale(10) }}>
            {icon}
            <Text style={{ fontSize: scale(16), fontWeight: "bold", paddingTop: scale(10) }}>{text}</Text>
        </TouchableOpacity>
    }
    renderInfo = (data) => {
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
    renderHeader = () => {
        return <View style={{ flexDirection: "row", marginHorizontal: scale(20), alignItems: 'center', marginBottom: scale(10) }}>
            <TouchableOpacity activeOpacity={0.6} onPress={() => Navigation.pop(this.props.componentId)}>
                <MaterialIcons
                    name='arrow-back'
                    size={scale(22)}
                    color="black"
                />
            </TouchableOpacity>
            <Text style={{ fontSize: scale(22), fontWeight: 'bold', marginTop: scale(5), marginBottom: scale(5), marginLeft: scale(15) }}>Lịch sử chuyến</Text>

        </View>
    }
    callbackRatingSuccess = (id, rate_id) => {
        const { data } = this.state;
        Toast.show({
            type: 'success',
            text1: 'Đánh giá tài xế thành công',
            text2: 'Cảm ơn bạn đã đóng góp để dịch vụ tốt hơn',
            topOffset: scale(50)
        })
        if (id && rate_id) {
            const newData = data;
            let index = data.findIndex(vl => {
                return vl._id == id
            })
            newData[index].rating_id = rate_id;
            this.setState({ data: newData })
        }
    }
    onPressJourney = (crrJourneys) => {
        const { componentId } = this.props;
        if (crrJourneys.status == constant_type_status_booking.WAITING_DRIVER
            || crrJourneys.status == constant_type_status_booking.PROCESSING
            || crrJourneys.status == constant_type_status_booking.FINDING_DRIVER) {
            if (crrJourneys.booking_type === CONSTANT_TYPE_BOOKING.HYBIRD_CAR) {
                pushToBookingHybirdScreen(componentId)
            } else if (crrJourneys.booking_type === CONSTANT_TYPE_BOOKING.COACH_CAR) {
                pushToBookingScreen(componentId)

            } else {
                pushToDeliveryScreen(componentId)

            }
        } else {
            pushToOrderInfoScreen(componentId, { data: crrJourneys, callback: (dt, id) => this.callbackRatingSuccess(dt, id) })
        }

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
    renderItem = (journey) => {
        const { isloading } = this.state;
        const crrJourneys = journey.item;
        const txtStatus = this.getStatusName(crrJourneys.status);
        const txtColor = this.getColorStatus(crrJourneys.status);


        if (crrJourneys.type == "loading") {
            if (!isloading) {
                return
            }
            return this.renderLoading();

        }

        return <TouchableOpacity
            onPress={() => this.onPressJourney(crrJourneys)}
            activeOpacity={0.5}
            style={{
                backgroundColor: '#FFFFFF',
                borderRadius: scale(10),
                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 9,
                },
                shadowOpacity: 0.50,
                shadowRadius: 12.35,

                elevation: 19, alignItems: 'center', marginHorizontal: scale(10), marginVertical: scale(10),
                flexDirection: "row",
                paddingHorizontal: scale(15),
                width: width - scale(20),
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
                {this.renderInfo(crrJourneys)}

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
    renderEmpty = () => {
        return <View style={{ flex: 2, alignItems: "center", marginTop: scale(30) }}>
            <Image style={{ width: scale(80), height: scale(80) }} source={require('./res/ic_no_data.png')} />
            <Text style={{ fontSize: scale(14), fontWeight: '500', marginHorizontal: scale(20), textAlign: 'center', paddingTop: scale(10) }}>Bạn chưa có hành trình nào! </Text>
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

    render() {
        const { user_info } = this.props;
        const { isloading, refreshing } = this.state;
        // if (isloading || ) {
        //     return <SafeAreaView
        //         style={{
        //             flex: 1,
        //             justifyContent: "space-between",
        //         }}>
        //         {this.renderHeader()}
        //         {this.renderLoading()}
        //     </SafeAreaView>
        // }
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <KeyboardAvoidingView
                    style={{
                        flex: 1,
                        justifyContent: "space-between",
                    }}
                    behavior={Platform.OS == 'ios' ? 'padding' : ''}>
                    {/* <View style={{ flexDirection: "row", marginHorizontal: scale(20), alignItems: 'center' }}>
                            <Text style={{ fontSize: scale(28), fontWeight: 'bold', marginTop: scale(10), marginBottom: scale(5) }}>Lịch sử hành trình</Text>
                        </View> */}
                    {this.renderHeader()}
                    <FlatList
                        data={[ ...this.state.data, { type: "loading" }]}
                        renderItem={this.renderItem}
                        style={{ flex: 1 }}
                        keyExtractor={item => item._id}
                        showsVerticalScrollIndicator={false}
                        onScrollBeginDrag={() => Keyboard.dismiss()}
                        onEndReached={({ distanceFromEnd }) => {
                            if (distanceFromEnd < 0) return;
                            this.getDataHistory(this.state.page_number)
                        }}
                        onEndReachedThreshold={0.5}
                        refreshing={this.state.refreshing}
                        onRefresh={() => {
                            this.setState({
                                refreshing: true
                            });
                            this.getDataHistory(1)
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
                <Toast config={toastConfig} ref={(ref) => Toast.setRef(ref)} />
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

export default connect(mapStateToProps, mapDispatchToProps)(HistoryScreen)

