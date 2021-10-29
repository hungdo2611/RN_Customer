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
    BackHandler
} from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { connect } from 'react-redux'
import MainView from './MainView'
import actions from './redux/actions'
import { scale } from '../../ultis/scale'
import Icon from 'react-native-vector-icons/AntDesign';
import { getListCoupon } from '../../api/couponAPI'
import _ from 'lodash';

const { width, height } = Dimensions.get('window')

class HomeScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }
    async componentDidMount() {
        const { update_list_coupon } = this.props;
        const reqCoupon = await getListCoupon();
        console.log("reqCoupon", reqCoupon)
        if (reqCoupon && !reqCoupon.err) {
            const length = reqCoupon?.data?.length ? reqCoupon?.data?.length : 0
            const data_lst = reqCoupon.data ? reqCoupon.data : []
            update_list_coupon(data_lst, length)
        }

    }

    render() {
        const { componentId, isLoadingPre, currentBooking } = this.props;
        const { lst_coupon, total_coupon } = this.props;
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <KeyboardAvoidingView
                    style={{
                        flex: 1,
                        justifyContent: "space-between",
                    }}
                    behavior={Platform.OS == 'ios' ? 'padding' : ''}>

                    <View style={{ paddingHorizontal: scale(10), flex: 1 }}>
                        <MainView
                            total={total_coupon}
                            lst_coupon={lst_coupon}
                            isLoadingPre={isLoadingPre}
                            componentId={componentId}
                            currentBooking={currentBooking}
                        />
                    </View>


                </KeyboardAvoidingView>
            </SafeAreaView>
        )
    }
}



const mapStateToProps = (state) => {
    return {
        isLoadingPre: state.HomeReducer.isLoadingPre,
        currentBooking: state.HomeReducer.currentBooking,
        lst_coupon: state.HomeReducer.lst_coupon,
        total_coupon: state.HomeReducer.total_coupon
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        update_list_coupon: (coupon, total) => {
            dispatch(actions.action.updateListCoupon(coupon, total));
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen)

