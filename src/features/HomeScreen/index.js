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

import { scale } from '../../ultis/scale'
import Icon from 'react-native-vector-icons/AntDesign';
import { getListCoupon } from '../../api/couponAPI'
import _ from 'lodash';

const { width, height } = Dimensions.get('window')

class HomeScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lst_coupon: [],
            total: 0,
        };
    }
    async componentDidMount() {
        const reqCoupon = await getListCoupon(1, 10);
        if (reqCoupon && !reqCoupon.err) {
            this.setState({ lst_coupon: reqCoupon.data, total: reqCoupon.total })
        }

    }

    render() {
        const { componentId, isLoadingPre } = this.props;
        const { lst_coupon, total } = this.state;
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <KeyboardAvoidingView
                    style={{
                        flex: 1,
                        justifyContent: "space-between",
                    }}
                    behavior={Platform.OS == 'ios' ? 'padding' : ''}>

                    <View style={{ paddingHorizontal: scale(10), flex: 1 }}>
                        <MainView total={total} lst_coupon={lst_coupon} isLoadingPre={isLoadingPre} componentId={componentId} />
                    </View>


                </KeyboardAvoidingView>
            </SafeAreaView>
        )
    }
}



const mapStateToProps = (state) => {
    return {
        isLoadingPre: state.HomeReducer.isLoadingPre
    }
}

const mapDispatchToProps = (dispatch) => {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen)

