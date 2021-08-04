import React, { useState, useEffect, PureComponent } from 'react'
import {
    Image,
    View,
    Text,
    TouchableOpacity,
    RefreshControl,
    Dimensions,
    TextInput,
    KeyboardAvoidingView,
    FlatList,
    Keyboard,
    SafeAreaView,
    ActivityIndicator,
    Alert,
    ScrollView,
    Animated
} from 'react-native'
import CheckBox from '@react-native-community/checkbox';

import { connect } from 'react-redux'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';
import EvilIconsIcon from 'react-native-vector-icons/EvilIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { AutoCompleteAPI, getFromLocationId } from '../../api/MapApi';
import { scale } from '../../ultis/scale'
import { RecyclerListView, LayoutProvider, DataProvider } from 'recyclerlistview';
import {
    Placeholder,
    PlaceholderMedia,
    PlaceholderLine,
    Fade
} from "rn-placeholder";
import { color } from '../../constant/color'

import _ from 'lodash';

const { width, height } = Dimensions.get('window')

class AdditionalInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            seat: 1,
            selectAll: false
        }
    }

    onBack = () => {
        const { navigation } = this.props;
        navigation.pop();

    }

    renderInfo = () => {
        const { data_diem_don, data_diem_den } = this.props?.route?.params;

        return <View style={{ marginHorizontal: scale(10) }}>
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    height: scale(80),
                    borderRadius: scale(15),
                    borderColor: color.GRAY_COLOR_400,
                    backgroundColor: color.GRAY_COLOR_100,
                    marginVertical: scale(7),
                    borderStartWidth: 0.3,
                    borderEndWidth: 0.3,
                    borderTopWidth: 0.3,
                    borderBottomWidth: 0.3,
                    overflow: 'hidden',
                }}
            >
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <FontAwesomeIcon
                        name='arrow-circle-up'
                        size={scale(17)}
                        color={color.GREEN_COLOR_300}
                        style={{ marginLeft: scale(10) }}
                        containerStyle={{

                        }}
                    />
                    <MaterialCommunityIcons
                        name='dots-vertical'
                        size={scale(14)}
                        color={color.GRAY_COLOR_400}
                        style={{ marginLeft: scale(10), opacity: 0.6 }}
                        containerStyle={{

                        }}
                    />
                    <MaterialCommunityIcons
                        name='record-circle'
                        size={scale(20)}
                        color={color.ORANGE_COLOR_400}
                        style={{ marginLeft: scale(10) }}
                        containerStyle={{

                        }}
                    />
                </View>
                <View style={{ flex: 1, marginHorizontal: scale(10), paddingVertical: scale(5) }}>
                    <View style={{ flex: 1, justifyContent: "center" }}>
                        <Text style={{ fontSize: scale(13), fontWeight: '600' }}>{data_diem_don?.address?.label ? data_diem_don?.address?.label : 'Vị trí của bạn'}</Text>
                    </View>
                    <View style={{ height: 0.5, opacity: 0.5, backgroundColor: color.GRAY_COLOR_400 }} />
                    <View style={{ flex: 1, justifyContent: "center" }}>
                        <Text style={{ fontSize: scale(13), fontWeight: '600' }}>{data_diem_den?.address?.label}</Text>
                    </View>

                </View>
            </View>


        </View>
    }
    renderLine = () => {
        return <View style={{ height: 0.6, opacity: 0.5, backgroundColor: color.GRAY_COLOR_400, marginVertical: scale(5) }} />

    }
    renderLoading = () => {
        let arr = [1, 2, 3, 4, 5];
        return <ScrollView showsVerticalScrollIndicator={false}>
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


        </ScrollView>
    }

    renderLstDriver = (lstDriver) => {
        return <View>
            <Text>Driver</Text>
        </View>
    }
    render() {
        const { seat, selectAll } = this.state;
        const { isLoading_getListDriver, lstDriver } = this.props;
        return (
            <View style={{ flex: 1, backgroundColor: "#FFFFFF", borderRadius: scale(20) }}>
                <KeyboardAvoidingView
                    style={{
                        flex: 1,

                    }}
                    behavior={Platform.OS == 'ios' ? 'padding' : ''}>
                    <View style={{ marginBottom: scale(10), flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <View style={{ marginHorizontal: scale(10), flexDirection: 'row', alignItems: 'center' }}>
                            <TouchableOpacity onPress={this.onBack} style={{ paddingRight: 0 }}>
                                <MaterialIcons
                                    name='arrow-back-ios'
                                    size={scale(22)}
                                    color="black"
                                />
                            </TouchableOpacity>
                            <Text style={{ fontSize: scale(20), fontWeight: 'bold' }}>Xe Khách</Text>

                        </View>
                        <TouchableOpacity
                            onPress={this.onChangeLocation}
                            style={{
                                width: scale(90),
                                height: scale(30),
                                borderRadius: scale(20),
                                alignItems: "center",
                                justifyContent: 'center',
                                backgroundColor: color.ORANGE_COLOR_400,
                                marginRight: scale(10)
                            }}>
                            <Text style={{ fontSize: scale(12), fontWeight: 'bold', color: '#FFFFFF' }}>Tìm xe</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ width: width, height: 1, backgroundColor: color.GRAY_COLOR_400, opacity: 0.5 }} />

                    <View style={{ marginHorizontal: scale(10), marginTop: scale(5) }}>
                        <Text style={{ fontSize: scale(13), fontWeight: 'bold', color: color.GRAY_COLOR_500 }}>Thông tin chuyến xe</Text>
                    </View>
                    {this.renderInfo()}
                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginHorizontal: scale(10), marginVertical: scale(5), alignItems: "center" }}>
                        <Text style={{ fontSize: scale(14), fontWeight: 'bold', color: color.GRAY_COLOR_500 }}>Số người:</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <TouchableOpacity disabled={seat == 1} activeOpacity={0.6} onPress={() => this.setState({ seat: seat - 1 })} style={{ width: scale(34), height: scale(34), borderRadius: scale(17), alignItems: "center", justifyContent: "center", backgroundColor: color.GRAY_COLOR_200 }}>
                                <FontAwesomeIcon
                                    name='minus'
                                    size={scale(11)}
                                    color="black"

                                />
                            </TouchableOpacity>
                            <Text style={{ marginHorizontal: scale(10), fontSize: scale(18), fontWeight: 'bold' }}>{seat}</Text>
                            <TouchableOpacity onPress={() => this.setState({ seat: seat + 1 })} activeOpacity={0.6} style={{ width: scale(34), height: scale(34), borderRadius: scale(17), alignItems: "center", justifyContent: "center", backgroundColor: color.GRAY_COLOR_200 }}>
                                <FontAwesomeIcon
                                    name='plus'
                                    size={scale(11)}
                                    color="black"

                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    {this.renderLine()}
                    {this.render}
                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginHorizontal: scale(10), alignItems: 'center' }}>
                        <Text style={{ fontSize: scale(14), fontWeight: 'bold', color: color.GRAY_COLOR_500 }}>Danh sách nhà xe</Text>
                        <View style={{ flexDirection: 'row', alignItems: "center" }}>
                            <Text style={{ marginRight: scale(5), fontWeight: '600' }}>Tất cả</Text>
                            <CheckBox
                                disabled={false}
                                value={selectAll}
                                tintColors={color.GREEN_COLOR_300}
                                onValueChange={(newValue) => this.setState({ selectAll: newValue })}
                            />
                        </View>
                    </View>
                    {isLoading_getListDriver && this.renderLoading()}
                    {!isLoading_getListDriver && lstDriver && lstDriver.length > 0 && this.renderLstDriver(lstDriver)}
                </KeyboardAvoidingView>
            </View>
        )
    }
}


const mapStateToProps = (state) => {
    return {
        isLoading_getListDriver: state.SelectDesOriginReducer.isLoading,
        lstDriver: state.SelectDesOriginReducer.lstDriver
    }
}

export default connect(
    mapStateToProps,
    null,
)(AdditionalInfo);

