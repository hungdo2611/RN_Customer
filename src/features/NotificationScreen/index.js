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

import { connect } from 'react-redux'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { getListNotification } from '../../api/notificationAPI'
import handleNoti from '../../notification/handleNoti'
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
import moment from 'moment';

export let NotiScreenInstance = null;

const { width, height } = Dimensions.get('window')
const widthBox = width / 2 - scale(30);
class NotiScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            page_number: 1,
            total: 0,
            data: [],
            isloading: false,
            refreshing: false
        };
        NotiScreenInstance = this;

    }
    getDataNotify = async (page_number) => {
        console.log("getDataNotify")
        const { total, data, isloading } = this.state;
        if (isloading) {
            return
        }
        if (page_number > 1 && page_number * 10 > total) {
            console.log('not data')
            return
        }
        this.setState({ isloading: true })
        const lst_notify = await getListNotification(page_number, 10);
        console.log("lst_notify", lst_notify)
        setTimeout(() => {
            this.setState({ isloading: false })

        }, 300)

        if (lst_notify && !lst_notify.err) {
            if (page_number == 1) {
                this.setState({ page_number: page_number + 1, total: lst_notify.total, data: [...lst_notify.data] })
            } else {
                this.setState({ page_number: page_number + 1, total: lst_notify.total, data: [...data, ...lst_notify.data] })

            }
        }
    }
    async componentDidMount() {
        this.getDataNotify(1);
    }


    renderItemMenu = (text, icon, onPress) => {
        return <TouchableOpacity onPress={onPress} style={{ width: widthBox, height: widthBox - scale(30), borderRadius: scale(10), borderWidth: 1, borderColor: color.GRAY_COLOR_400, alignItems: 'center', justifyContent: 'center', marginHorizontal: scale(10), marginVertical: scale(10) }}>
            {icon}
            <Text style={{ fontSize: scale(16), fontWeight: "bold", paddingTop: scale(10) }}>{text}</Text>
        </TouchableOpacity>
    }
    renderEmpty = () => {
        return <View style={{ flex: 2, alignItems: "center", marginTop: scale(30) }}>
            <Image style={{ width: scale(80), height: scale(80) }} source={require('./res/bell.png')} />
            <Text style={{ fontSize: scale(14), fontWeight: '500', marginHorizontal: scale(20), textAlign: 'center', paddingTop: scale(10) }}>Bạn chưa có thông báo nào! </Text>
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
        return <View style={{ flexDirection: "row", alignItems: 'center', marginBottom: scale(10) }}>
            <TouchableOpacity activeOpacity={0.6} onPress={() => Navigation.pop(this.props.componentId)}>
                <MaterialIcons
                    name='arrow-back'
                    size={scale(22)}
                    color="black"
                    style={{ margin: scale(10) }}
                />
            </TouchableOpacity>
            <Text style={{ fontSize: scale(26), fontWeight: 'bold', marginTop: scale(5), marginBottom: scale(5) }}>Thông báo</Text>

        </View>
    }
    onPressItem = (item) => {
        handleNoti(item.data)
    }
    getImageSrc = (type) => {
        switch (type) {
            case 'ALERT_NOTIFICATION':
                return require('./res/bell.png')
            case 'PROMOTION_NOTIFICATION':
                return require('./res/gift.png')
        }
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
        return <View >
            <View style={{ height: 1, backgroundColor: color.GRAY_COLOR_200 }} />
            <TouchableOpacity onPress={() => this.onPressItem(item)} style={{ flexDirection: 'row', marginVertical: scale(10) }} activeOpacity={0.5} >
                <Image style={{ width: scale(30), height: scale(30), marginHorizontal: scale(15) }} source={this.getImageSrc(item.data.type)} />
                <View style={{ flex: 1 }}>
                    <Text numberOfLines={1} style={{ fontSize: scale(15), fontWeight: '600', width: '95%' }}>{item.title}</Text>
                    <Text style={{ fontSize: scale(13), paddingTop: scale(3), width: '95%' }}>{item.content}</Text>
                    <Text style={{ fontSize: scale(12), color: color.GRAY_COLOR_500, paddingTop: scale(3) }}>{moment(item.time).fromNow()}</Text>
                </View>
            </TouchableOpacity>
            {index == this.state.data.length && <View style={{ height: 1, backgroundColor: color.GRAY_COLOR_200 }} />}
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
                            this.getDataNotify(this.state.page_number)
                        }}
                        onEndReachedThreshold={0.5}
                        refreshing={this.state.refreshing}
                        onRefresh={() => {
                            this.setState({
                                refreshing: true
                            });
                            this.getDataNotify(1)
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

export default connect(mapStateToProps, mapDispatchToProps)(NotiScreen)

