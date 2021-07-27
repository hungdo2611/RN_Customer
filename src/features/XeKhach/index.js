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

export default class XeKhachView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            diem_don: '',
            isFocus: false,
            isloading: false,
            isloadingAPI: false,
            dataAutoComplete: [],
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

    }
    renderPickWithGG = () => {
        return <View>
            <Text>pick GG</Text>
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
    onChangeDiemDen = async (txt) => {
        const { isloading, isloadingAPI } = this.state;
        const { coord } = this.props;
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
        let localtion = await getFromLocationId(location_id)
        const result = localtion?.response?.view[0].result;
        console.log("localtion", localtion?.response?.view[0].result)
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
        const { setPickWithGG, inDecreaseHeiht } = this.props;
        setPickWithGG(true);
        inDecreaseHeiht();
    }
    renderHight = () => {
        const { isFocus, diem_don, dataAutoComplete, isloading } = this.state;
        const { coord } = this.props;
        console.log("coord", coord)
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
                                onFocus={() => {
                                    this.setState({ isFocus: true });
                                }}
                                onBlur={() => {
                                    this.setState({ isFocus: false });
                                }}
                                defaultValue={diem_don == '' && !isFocus ? 'Vị trí hiện tại' : diem_don}
                                style={{ flex: 1 }}
                                placeholder="Tìm điểm đón" />
                            <View style={{ height: 0.5, opacity: 0.5, backgroundColor: color.GRAY_COLOR_400 }} />
                            <TextInput
                                ref={e => this.inPutDiemDen = e}
                                onChangeText={this.onChangeDiemDen}
                                style={{ flex: 1 }}
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

    render() {
        const { isInCreaseHeight, inCreaseHeight } = this.props;
        return (
            <View style={{ flex: 1, backgroundColor: "#FFFFFF", borderRadius: scale(20) }}>
                <View style={{ marginHorizontal: scale(10) }}>
                    <Text style={{ fontSize: scale(20), fontWeight: 'bold', marginBottom: scale(10) }}>Tìm Xe Khách</Text>
                    {!isInCreaseHeight && this.renderLow()}
                </View>
                {isInCreaseHeight && this.renderHight()}
            </View>
        )
    }
}





