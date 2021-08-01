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
const CONSTANT_SELECT = {
    NONE: 'NONE',
    ORIGIN: 'ORIGIN',
    DES: 'DESTINATION'
}
export default class SelectDesOrigin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data_diem_don: null,
            data_diem_den: null,
            isFocus_origin: false,
            isFocus_des: false,
            isloading: false,
            isloadingAPI: false,
            isLoadingAPIPickGG: false,
            dataAutoComplete: [],
            dataPickWithGG: {},
            select_origin_or_des: CONSTANT_SELECT.NONE,
            text_temp: ''
        }
        this._layoutProvider = new LayoutProvider((i) => {
            let data = this.state.dataprovider.getDataForIndex(i)
            let dataLength = data.dataDays.data.length
            return { type: "Item_task", length: dataLength } //this.state.dataProvider.getDataForIndex(i).type;

        }, (type, dim) => {
            switch (type.type) {
                case "Item_task":
                    dim.width = width;
                    dim.height = type.length > 0 ? scale(56) * type.length : scale(56);
                    break;

                default:
                    dim.height = 0;
                    dim.width = width;
                    break;

            };
        });
    }
    componentDidMount() {
        console.log("componentDidMount")
        const { isInCreaseHeight } = this.props;
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

    onComfirmDirection = (data_diem_don, data_diem_den) => {
        const { navigation } = this.props;
        navigation.push("AdditionalInfo", { data_diem_don, data_diem_den });

    }

    onComfirmPickGG = () => {
        const { dataPickWithGG, select_origin_or_des, data_diem_den } = this.state;
        const { setPickWithGG, inCreaseHeight } = this.props;
        setPickWithGG(false);
        setTimeout(() => {
            if (select_origin_or_des === CONSTANT_SELECT.ORIGIN) {
                this.setState({ data_diem_don: dataPickWithGG })
                inCreaseHeight()
                if (!data_diem_den) {
                    this.inPutDiemDen.focus();
                }
            }
            console.log("select_origin_or_des", select_origin_or_des)
            if (select_origin_or_des === CONSTANT_SELECT.DES) {
                this.setState({ data_diem_den: dataPickWithGG })
            }
        }, 100)

    }
    renderPickWithGG = () => {
        const { isLoadingAPIPickGG, dataPickWithGG } = this.state
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
                <Text style={{ fontSize: scale(18), fontWeight: "bold" }}>Đặt điểm đến</Text>
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
                    <Text numberOfLines={1} style={{ fontSize: scale(14), fontWeight: "bold", marginTop: scale(5), width: '90%' }}>{dataPickWithGG?.address?.houseNumber} {dataPickWithGG?.address?.street}</Text>
                    <Text numberOfLines={2} style={{ fontSize: scale(12), fontWeight: '600', marginTop: scale(5), width: '90%', paddingLeft: scale(3) }}>{dataPickWithGG?.title}</Text>
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
            </View>
        )
    }
    onChangeAutoComplete = async (txt) => {
        const { isloading, isloadingAPI } = this.state;
        const { coord } = this.props;
        this.setState({ text_temp: txt })
        if (txt) {
            this.setState({ isloading: true })

        } else {
            this.setState({ isloading: false, dataAutoComplete: [] })
            return
        }

        if (txt.trim().length > 2 && txt.trim() != '' && !isloadingAPI) {
            console.log("text", txt)
            this.setState({ isloadingAPI: true })
            let autocomplete = await AutoCompleteAPI(txt, coord.lat, coord.lng);
            setTimeout(() => {
                if (autocomplete && autocomplete.suggestions) {
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
        console.log("localtion", localtion?.response?.view[0].result[0].location)
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
                    <Text numberOfLines={1} style={{ fontSize: scale(11), color: color.GRAY_COLOR_500, paddingTop: scale(3) }}>{item.label}</Text>
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
        this.setState({ isFocus_des: false, isFocus_origin: false, dataAutoComplete: [] })
        AnimateHeightTovalue(scale(300))
        getCurrentPlace();
        setPickWithGG(true);
    }
    renderHight = () => {
        const { isFocus_origin, diem_don, dataAutoComplete, isloading, data_diem_den, data_diem_don, isFocus_des, text_temp } = this.state;
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
                                    this.setState({ isFocus_origin: true, select_origin_or_des: CONSTANT_SELECT.ORIGIN, text_temp: text });
                                }}
                                onBlur={() => {
                                    this.setState({ isFocus_origin: false, dataAutoComplete: [], text_temp: '' });
                                }}
                                selectTextOnFocus={true}
                                onChangeText={this.onChangeAutoComplete}
                                value={isFocus_origin ? text_temp : (data_diem_don?.address?.label ? data_diem_don?.address?.label : 'Vị trí hiện tại')}
                                style={{ flex: 1 }}
                                blurOnSubmit={false}
                                placeholder="Tìm điểm đón" />
                            <View style={{ height: 0.5, opacity: 0.5, backgroundColor: color.GRAY_COLOR_400 }} />
                            <TextInput
                                ref={e => this.inPutDiemDen = e}
                                onFocus={() => {
                                    const text = data_diem_den?.address?.label ? data_diem_den?.address?.label : ''
                                    this.setState({ isFocus_des: true, select_origin_or_des: CONSTANT_SELECT.DES, text_temp: text });

                                }}
                                onBlur={() => {
                                    this.setState({ isFocus_des: false, text_temp: '', dataAutoComplete: [] })
                                }}
                                value={isFocus_des ? text_temp : data_diem_den?.address?.label}
                                onChangeText={this.onChangeAutoComplete}
                                style={{ flex: 1 }}
                                blurOnSubmit={false}
                                placeholder="Chọn điểm đến" />

                        </View>
                    </View>
                    <TouchableOpacity onPress={this.onPickWithGG} activeOpacity={0.7} style={{ flexDirection: "row", alignItems: 'center', marginVertical: scale(10) }}>
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

                {dataAutoComplete.length > 0 && !isloading && <View style={{ flex: 1, backgroundColor: color.GRAY_COLOR_100 }}>
                    <FlatList
                        data={dataAutoComplete}
                        renderItem={this.renderItem}
                        style={{ flex: 1 }}
                        keyExtractor={item => item.locationId}
                        showsVerticalScrollIndicator={false}
                    />
                </View>}
                {isloading && this.renderLoading()}

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
                            <TouchableOpacity onPress={this.onBack} style={{ paddingRight: 0 }}>
                                <MaterialIcons
                                    name='arrow-back-ios'
                                    size={scale(22)}
                                    color="black"
                                />
                            </TouchableOpacity>
                            <Text style={{ fontSize: scale(20), fontWeight: 'bold' }}>Tìm Xe Khách</Text>

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





