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
    TouchableWithoutFeedback,
    Platform
} from 'react-native'

import { connect } from 'react-redux'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';
import EvilIconsIcon from 'react-native-vector-icons/EvilIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { AutoCompleteAPI, getFromLocationId } from '../../../api/MapApi';
import { scale } from '../../../ultis/scale'
import { RecyclerListView, LayoutProvider, DataProvider } from 'recyclerlistview';
import {
    Placeholder,
    PlaceholderMedia,
    PlaceholderLine,
    Fade
} from "rn-placeholder";
import { color } from '../../../constant/color'
import { getListDriverAPI } from '../../../api/bookingApi'
import _ from 'lodash';
import actions from '../redux/actions'
import { CONSTANT_TYPE_JOURNEYS } from '../../../constant';

const { width, height } = Dimensions.get('window')
const CONSTANT_SELECT = {
    NONE: 'NONE',
    ORIGIN: 'ORIGIN',
    DES: 'DESTINATION'
}
const CONSTANT_TYPE_AUTOCOMPLETE_NULL = {
    START_FIND: 'START_FIND',
    NOT_FOUND: 'NOT_FOUND'
}
class SelectDesOrigin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data_diem_don: null,
            data_diem_den: null,
            isloading: false,
            isloadingAPI: false,
            isLoadingAPIPickGG: false,
            dataAutoComplete: null,
            dataPickWithGG: {},
            select_origin_or_des: CONSTANT_SELECT.NONE,
            text_temp: '',
            type_autocompleteNull: null
        }
        this.props.setRef(this)
    }
    componentDidMount() {
        console.log("componentDidMount")
        const { isInCreaseHeight } = this.props;
        const { from, to } = this.props
        if (from && to) {
            const diem_den = {
                displayPosition: {
                    latitude: to?.loc?.coordinates[1],
                    longitude: to?.loc?.coordinates[0]
                },
                address: {
                    label: to.address
                }
            }
            const diem_don = {
                displayPosition: {
                    latitude: from?.loc?.coordinates[1],
                    longitude: from?.loc?.coordinates[0]
                },
                address: {
                    label: from.address
                }
            }
            this.setState({ data_diem_don: diem_don, data_diem_den: diem_den })
            this.onComfirmDirection(diem_don, diem_den)
            return
        }
        if (isInCreaseHeight) {
            this.inPutDiemDen.focus();
        }
    }
    setLoadingPickWithGG = (isloading) => {
        this.setState({ isLoadingAPIPickGG: isloading })
    }
    setDataPickWithGG = (data) => {
        console.log("setDataPickWithGG", data)
        this.setState({ dataPickWithGG: data })
    }
    onChangeLocation = () => {
        const { setPickWithGG, inCreaseHeight } = this.props;
        const { select_origin_or_des } = this.state;
        setPickWithGG(false);

        setTimeout(() => {
            inCreaseHeight()
            if (select_origin_or_des === CONSTANT_SELECT.ORIGIN) {
                this.inPutDiemDon.focus();
            }
            if (select_origin_or_des === CONSTANT_SELECT.DES) {
                this.inPutDiemDen.focus();
            }
        }, 100)
    }

    onComfirmDirection = async (data_diem_don, data_diem_den) => {
        const { navigation, setPolygon, coord, getListDriver, getListDriverDone } = this.props;
        let lat_origin = data_diem_don ? data_diem_don.displayPosition.latitude : coord.lat
        let lng_origin = data_diem_don ? data_diem_don.displayPosition.longitude : coord.lng
        let lstPoint = [{ lat: lat_origin, lng: lng_origin }, { lat: data_diem_den.displayPosition.latitude, lng: data_diem_den.displayPosition.longitude }]
        setPolygon(lstPoint, data_diem_don, data_diem_den);
        const { isInCreaseHeight, inCreaseHeight } = this.props;
        if (!isInCreaseHeight) {
            setTimeout(() => {
                inCreaseHeight();
            }, 200)
        }
        navigation.push("AdditionalInfo", {
            data_diem_don: data_diem_don,
            data_diem_den: data_diem_den,
            onbackCB: () => {
                this.inPutDiemDen.focus();
                if (!this.state.dataAutoComplete) {
                    this.onChangeAutoComplete(this.state.data_diem_den?.address?.label, false)
                }
            }
        });

        getListDriver();
        const body_booking = {
            from: {
                lat: lat_origin,
                lng: lng_origin

            },
            to: {
                lat: data_diem_den.displayPosition.latitude,
                lng: data_diem_den.displayPosition.longitude,
            },
            journey_type: CONSTANT_TYPE_JOURNEYS.HYBIRD_CAR

        };
        let reqGetDriver = await getListDriverAPI(body_booking);
        console.log("reqGetDriver", reqGetDriver)
        if (!reqGetDriver.err) {
            getListDriverDone(reqGetDriver.data)
        }

    }

    onComfirmPickGG = () => {
        const { dataPickWithGG, select_origin_or_des, data_diem_den, data_diem_don } = this.state;
        const { setPickWithGG, inCreaseHeight } = this.props;
        setPickWithGG(false);
        const formatData = { ...dataPickWithGG, displayPosition: { latitude: dataPickWithGG.position.lat, longitude: dataPickWithGG.position.lng } }
        setTimeout(() => {
            if (select_origin_or_des === CONSTANT_SELECT.ORIGIN) {
                this.setState({ data_diem_don: formatData })
                inCreaseHeight()
                if (!data_diem_den) {
                    this.inPutDiemDen.focus();
                } else {
                    this.onComfirmDirection(formatData, data_diem_den)

                }
            }
            console.log("select_origin_or_des", select_origin_or_des)
            if (select_origin_or_des === CONSTANT_SELECT.DES) {
                this.setState({ data_diem_den: formatData })
                this.onComfirmDirection(data_diem_don, formatData)
            }
        }, 100)

    }
    renderPickWithGG = () => {
        const { isLoadingAPIPickGG, dataPickWithGG, select_origin_or_des } = this.state
        if (isLoadingAPIPickGG)
            return <View>
                <Placeholder
                    Animation={Fade}
                    Left={props => <PlaceholderMedia isRound style={[{ marginLeft: scale(10), marginTop: scale(5) }, props.style]} />}
                    style={{ marginVertical: scale(12) }}
                >
                    <PlaceholderLine width={80} height={10} style={{ borderRadius: 10 }} />
                    <PlaceholderLine width={80} height={10} style={{ borderRadius: 10 }} />
                    <PlaceholderLine width={80} height={10} style={{ borderRadius: 10 }} />
                </Placeholder>
            </View>


        return <View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: 'center' }}>
                <Text style={{ fontSize: scale(18), fontWeight: "bold" }}>{select_origin_or_des == CONSTANT_SELECT.ORIGIN ? "Chọn điểm đón" : "Đặt điểm đến"}</Text>
                <TouchableOpacity
                    onPress={this.onChangeLocation}
                    style={{
                        width: scale(90),
                        height: scale(30),
                        borderRadius: scale(20),
                        alignItems: "center",
                        justifyContent: 'center',
                        borderWidth: 1,
                        borderColor: color.MAIN_COLOR
                    }}>
                    <Text style={{ fontSize: scale(12), fontWeight: 'bold', color: color.MAIN_COLOR }}>Thay đổi</Text>
                </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', backgroundColor: '#d3f5de', marginTop: scale(10), height: scale(80), borderRadius: scale(15), width: width - scale(30), alignSelf: "center" }}>
                <View style={{ width: scale(24), height: scale(24), borderRadius: scale(12), backgroundColor: color.ORANGE_COLOR_400, alignItems: "center", justifyContent: "center", margin: scale(10), marginTop: scale(5) }}>
                    <View style={{ width: scale(10), height: scale(10), borderRadius: scale(5), backgroundColor: 'white' }}>
                    </View>
                </View>
                <View style={{ flex: 1 }}>
                    <Text numberOfLines={1} style={{ fontSize: scale(14), fontWeight: "bold", marginTop: scale(5), width: '90%' }}> {dataPickWithGG.title}</Text>
                    <Text numberOfLines={2} style={{ fontSize: scale(12), fontWeight: '600', marginTop: scale(5), width: '90%', paddingLeft: scale(3) }}>{dataPickWithGG?.address?.label}</Text>
                </View>
            </View>
            <TouchableOpacity onPress={this.onComfirmPickGG} style={{ width: width / 1.5, height: scale(40), alignSelf: "center", backgroundColor: color.GREEN_COLOR_400, borderRadius: scale(20), alignItems: 'center', justifyContent: 'center', marginTop: scale(20) }}>
                <Text style={{ fontSize: scale(15), color: '#FFFFFF', fontWeight: "bold" }}>Tiếp tục</Text>
            </TouchableOpacity>
        </View>
    }
    renderLow = () => {
        const { isInCreaseHeight, inCreaseHeight, isPickWithGG } = this.props;
        if (isPickWithGG) {
            return this.renderPickWithGG()
        }
        return (
            <View>
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                        inCreaseHeight();
                        setTimeout(() => {
                            this.inPutDiemDen.focus();
                        }, 500)
                    }}
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        height: scale(40),
                        borderRadius: scale(15),
                        borderColor: color.GRAY_COLOR_400,
                        backgroundColor: color.GRAY_COLOR_100,
                        borderStartWidth: 0.3,
                        borderEndWidth: 0.3,
                        borderTopWidth: 0.3,
                        borderBottomWidth: 0.3,
                        marginVertical: scale(7),
                    }}>
                    <MaterialCommunityIcons
                        name='record-circle'
                        size={scale(18)}
                        color={color.ORANGE_COLOR_400}
                        style={{ marginLeft: scale(10) }}
                        containerStyle={{

                        }}
                    />
                    <Text
                        style={{ flex: 1, marginHorizontal: scale(7), fontSize: scale(13), color: color.GRAY_COLOR_400 }}
                    >
                        Bạn muốn đi đâu
                    </Text>
                    <EvilIconsIcon
                        name='search'
                        size={scale(18)}
                        color={color.GRAY_COLOR_400}
                        style={{ marginRight: scale(10) }}
                        containerStyle={{

                        }} />
                </TouchableOpacity>
                <View style={{ marginVertical: scale(15), flexDirection: "row", alignItems: 'center' }}>
                    <Image resizeMode="stretch" style={{ width: scale(100), height: scale(70), borderRadius: scale(20), overflow: "hidden", }} source={require('../res/ic_letgo.jpg')} />
                    <View style={{ flex: 1, marginLeft: scale(10) }}>
                        <Text style={{ fontSize: scale(13), fontWeight: '600' }}>Đặt xe ngay nhé!</Text>
                        <Text style={{ fontSize: scale(12), fontWeight: '500', marginTop: scale(5) }}>Tìm chuyến đi phù hợp. Chủ động lựa chọn nhà xe</Text>
                    </View>
                </View>
            </View>
        )
    }
    onChangeAutoComplete = async (txt, isOrigin) => {
        const { isloading, isloadingAPI, data_diem_don } = this.state;
        const { coord } = this.props;


        let lat, lng;
        if (isOrigin) {
            lat = coord.lat;
            lng = coord.lng;
        } else {
            if (data_diem_don) {
                lat = data_diem_don.displayPosition.latitude;
                lng = data_diem_don.displayPosition.longitude;
            } else {
                lat = coord.lat;
                lng = coord.lng;
            }
        }

        this.setState({ text_temp: txt })
        if (txt) {
            this.setState({ isloading: true })

        } else {
            this.setState({ isloading: false, dataAutoComplete: null })
            return
        }

        if (txt.trim().length > 2 && txt.trim() != '' && !isloadingAPI) {
            console.log("text", txt)
            this.setState({ isloadingAPI: true })

            let autocomplete = await AutoCompleteAPI(txt, lat, lng);
            setTimeout(() => {
                if (autocomplete && autocomplete.suggestions) {
                    console.log("autocomplete.suggestions", autocomplete.suggestions)
                    this.setState({ dataAutoComplete: autocomplete.suggestions })
                }
                this.setState({ isloading: false, isloadingAPI: false })

            }, 500)
        }
    }
    onChooseLocation = async (item) => {
        const location_id = item?.locationId;
        const { select_origin_or_des, data_diem_den, data_diem_don } = this.state;
        let localtion = await getFromLocationId(location_id)
        const result = localtion?.response?.view[0].result;
        const dataLocation = localtion?.response?.view[0]?.result[0]?.location
        if (select_origin_or_des === CONSTANT_SELECT.ORIGIN) {
            this.setState({ data_diem_don: dataLocation, text_temp: dataLocation?.address?.label })
            if (!data_diem_den) {
                this.inPutDiemDen.focus();
            } else {
                this.onComfirmDirection(dataLocation, data_diem_den)
            }
        }
        if (select_origin_or_des === CONSTANT_SELECT.DES) {
            this.setState({ data_diem_den: dataLocation, text_temp: dataLocation?.address?.label })
            this.onComfirmDirection(data_diem_don, dataLocation)
        }
    }
    renderItem = ({ item }) => {
        const distance = item.distance / 1000;
        const label = item.label.split(',')
        return <TouchableOpacity onPress={() => this.onChooseLocation(item)} activeOpacity={0.7}>
            <View style={{ flexDirection: "row", alignItems: 'center' }}>
                <View style={{ width: scale(65), alignItems: "center", justifyContent: "center", height: scale(60) }}>
                    <View style={{
                        width: scale(18),
                        height: scale(18),
                        borderRadius: scale(9),
                        backgroundColor: color.GRAY_COLOR_400,
                        alignItems: 'center',
                        justifyContent: "center",
                    }}>
                        <MaterialIcons
                            name='location-on'
                            size={scale(12)}
                            color="#FFFFFF"
                        />
                    </View>
                    <Text style={{ fontSize: scale(10), marginTop: scale(4), paddingHorizontal: scale(5), textAlign: "center" }}>{distance.toFixed(2)} km</Text>
                </View>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <Text style={{ fontSize: scale(12), fontWeight: 'bold', color: color.GRAY_COLOR_500 }}>{label[label.length - 1]}</Text>
                    <Text numberOfLines={1} style={{ fontSize: scale(11), color: color.GRAY_COLOR_500, paddingTop: scale(3), paddingLeft: scale(3) }}>{item.label}</Text>
                </View>
            </View>
            <View style={{ height: 0.5, width: width, backgroundColor: color.GRAY_COLOR_500, opacity: 0.3 }}></View>
        </TouchableOpacity>
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
    onPickWithGG = () => {
        const { setPickWithGG, inDecreaseHeiht, getCurrentPlace, AnimateHeightTovalue } = this.props;
        this.setState({ dataAutoComplete: null })
        AnimateHeightTovalue(scale(250))
        getCurrentPlace();
        setPickWithGG(true);
    }
    renderAutoCompleteList = () => {
        const { dataAutoComplete, isloading } = this.state;
        if (!dataAutoComplete && !isloading) {
            return <View style={{ margin: scale(15), flexDirection: "row", alignItems: 'center' }}>
                <Image resizeMode="stretch" style={{ width: scale(100), height: scale(70), borderRadius: scale(20), overflow: "hidden", }} source={require('../res/ic_letgo.jpg')} />
                <View style={{ flex: 1, marginLeft: scale(10) }}>
                    <Text style={{ fontSize: scale(13), fontWeight: '600' }}>Đặt xe ngay nhé!</Text>
                    <Text style={{ fontSize: scale(12), fontWeight: '500', marginTop: scale(5) }}>Tìm chuyến đi phù hợp. Chủ động lựa chọn nhà xe</Text>
                </View>
            </View>
        }
        if (dataAutoComplete && dataAutoComplete.length == 0 && !isloading) {
            return <View style={{ margin: scale(15), flexDirection: "row", alignItems: 'center' }}>
                <Image resizeMode="stretch" style={{ tintColor: color.ORANGE_COLOR_400, width: scale(70), height: scale(70), borderRadius: scale(20), overflow: "hidden", }} source={require('../res/ic_location_off.png')} />
                <View style={{ flex: 1, marginLeft: scale(10) }}>
                    <Text style={{ fontSize: scale(13), fontWeight: '600' }}>Không tìm được địa điểm này!</Text>
                    <Text style={{ fontSize: scale(12), fontWeight: '400', marginTop: scale(5) }}>Hãy kiểm tra lại chính tả hoặc chọn địa điểm trên bản đồ để xác định vị trí</Text>
                </View>
            </View>
        }
        if (isloading) {
            return this.renderLoading()
        }
        if (dataAutoComplete && dataAutoComplete.length && dataAutoComplete.length > 0 && !isloading) {
            return <View style={{ flex: 1, backgroundColor: color.GRAY_COLOR_100 }}>
                <FlatList
                    data={dataAutoComplete}
                    renderItem={this.renderItem}
                    style={{ flex: 1 }}
                    keyExtractor={item => item.locationId}
                    showsVerticalScrollIndicator={false}
                    onScrollBeginDrag={() => Keyboard.dismiss()}
                />
            </View>
        }
    }
    renderHight = () => {
        const { diem_don, dataAutoComplete, isloading, data_diem_den, data_diem_don, text_temp, select_origin_or_des } = this.state;
        const { coord } = this.props;
        console.log("coord", data_diem_den)
        return (
            <View style={{ flex: 1 }}>
                <View style={{ marginHorizontal: scale(10) }}>
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
                            <TextInput
                                ref={e => this.inPutDiemDon = e}
                                onFocus={() => {
                                    const text = data_diem_don?.address?.label ? data_diem_don?.address?.label : ''
                                    this.setState({ select_origin_or_des: CONSTANT_SELECT.ORIGIN, text_temp: text, data_diem_don: null });
                                    if (select_origin_or_des == CONSTANT_SELECT.DES) {
                                        this.setState({ dataAutoComplete: null, isloading: false })
                                    }
                                }}
                                selectTextOnFocus={true}
                                onChangeText={txt => this.onChangeAutoComplete(txt, true)}
                                value={select_origin_or_des == CONSTANT_SELECT.ORIGIN ? text_temp : (data_diem_don ? data_diem_don?.address?.label : 'Vị trí của bạn')}
                                style={{ flex: 1 }}
                                blurOnSubmit={true}
                                placeholderTextColor={color.GRAY_COLOR_400}
                                placeholder="Tìm điểm đón" />
                            <View style={{ height: 0.5, opacity: 0.5, backgroundColor: color.GRAY_COLOR_400 }} />
                            <TextInput
                                ref={e => this.inPutDiemDen = e}
                                onFocus={() => {

                                    const text = data_diem_den?.address?.label ? data_diem_den?.address?.label : ''
                                    this.setState({ select_origin_or_des: CONSTANT_SELECT.DES, text_temp: text, data_diem_den: null });
                                    if (select_origin_or_des == CONSTANT_SELECT.ORIGIN) {
                                        this.setState({ dataAutoComplete: null, isloading: false })
                                    }
                                }}
                                value={select_origin_or_des == CONSTANT_SELECT.DES ? text_temp : (data_diem_den?.address?.label ? data_diem_den?.address?.label : '')}
                                onChangeText={txt => this.onChangeAutoComplete(txt, false)}
                                style={{ flex: 1 }}
                                blurOnSubmit={true}
                                selectTextOnFocus={true}
                                placeholderTextColor={color.GRAY_COLOR_400}
                                placeholder="Chọn điểm đến" />

                        </View>
                    </View>
                    <TouchableOpacity onPress={this.onPickWithGG} activeOpacity={0.7} style={{ flexDirection: "row", alignItems: 'center', marginVertical: scale(10), width: scale(170) }}>
                        <FontAwesomeIcon
                            name='map'
                            size={scale(15)}
                            color={color.GREEN_COLOR_300}
                            style={{ marginLeft: scale(10) }}
                            containerStyle={{

                            }}
                        />
                        <Text style={{ fontSize: scale(14), marginLeft: scale(10) }}>Chọn bằng bản đồ</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ height: 0.5, opacity: 0.5, width: '100%', alignSelf: "center", backgroundColor: color.GRAY_COLOR_400 }} />
                {this.renderAutoCompleteList()}
                {/* {dataAutoComplete && dataAutoComplete.length > 0 && !isloading && <View style={{ flex: 1, backgroundColor: color.GRAY_COLOR_100 }}>
                    <FlatList
                        data={dataAutoComplete}
                        renderItem={this.renderItem}
                        style={{ flex: 1 }}
                        keyExtractor={item => item.locationId}
                        showsVerticalScrollIndicator={false}
                        onScrollBeginDrag={() => Keyboard.dismiss()}
                    />
                </View>}
                {isloading && this.renderLoading()}
                {!isloading && dataAutoComplete.length == 0 && <View>
                    <Text></Text>
                </View>} */}
            </View>
        )
    }
    onBack = () => {
        const { navigation, setPickWithGG, isPickWithGG } = this.props;
        if (isPickWithGG) {
            this.onChangeLocation()
            return
        }
        setPickWithGG(false);
        navigation.pop();

    }

    render() {
        const { isInCreaseHeight, inCreaseHeight, navigation } = this.props;
        return (
            <View style={{ flex: 1, backgroundColor: "#FFFFFF", borderRadius: scale(20) }}>
                <KeyboardAvoidingView
                    style={{
                        flex: 1,

                    }}
                    behavior={Platform.OS == 'ios' ? 'padding' : ''}>
                    <View style={{ marginBottom: scale(10) }}>
                        <View style={{ marginHorizontal: scale(10), flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ fontSize: scale(20), fontWeight: 'bold' }}>Xe tiện chuyến</Text>

                        </View>
                        <View style={{ width: width, height: 0.8, backgroundColor: color.GRAY_COLOR_400, opacity: 0.5, marginTop: scale(8) }} />
                    </View>
                    <View style={{ marginHorizontal: scale(10) }}>
                        {!isInCreaseHeight && this.renderLow()}
                    </View>
                    {isInCreaseHeight && this.renderHight()}
                </KeyboardAvoidingView>
            </View>
        )
    }
}




function mapDispatchToProps(dispatch) {
    return {
        getListDriver: () => {
            dispatch(actions.action.getListDriver());
        },
        getListDriverDone: (data) => {
            dispatch(actions.action.getListDriverDone(data));
        },
    };
}

export default connect(
    null,
    mapDispatchToProps,
)(SelectDesOrigin);



