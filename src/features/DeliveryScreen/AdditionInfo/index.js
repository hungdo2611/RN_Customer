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
    Linking,
    Platform,
    Modal
} from 'react-native'
import CheckBox from '@react-native-community/checkbox';
import { PERMISSIONS, request } from 'react-native-permissions';
import { getListDriverDeliveryAPI } from '../../../api/bookingApi'
import { CONSTANT_TYPE_JOURNEYS } from '../../../constant';

import { connect } from 'react-redux'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';
import EvilIconsIcon from 'react-native-vector-icons/EvilIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import ActionSheet from 'react-native-actionsheet'

import { scale } from '../../../ultis/scale'

import { color } from '../../../constant/color'
import moment from 'moment'
import _ from 'lodash';
import FastImage from 'react-native-fast-image'

import actions from '../redux/actions'
import { CONSTANT_TYPE_BOOKING } from '../../../constant';
import actionsHome from '../../HomeScreen/redux/actions'
import ImageCropPicker from "react-native-image-crop-picker";
import { UploadMultipleImageApi } from '../../../api/ImageAPI'
import ImageViewer from 'react-native-image-zoom-viewer';
import { isValidPhoneNumber } from 'libphonenumber-js'

const { width, height } = Dimensions.get('window')

class AdditionalInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            phone_number: '',
            weight: '',
            isloading: false,
            method_take: null,
            note: '',
            lst_image: [],
            showImage: { show: false, index: 0 }
        }

    }
    componentDidMount() {
        const { disablePull } = this.props;
        disablePull();
    }
    componentWillUnmount() {
        const { enablePull } = this.props;
        enablePull();
    }

    onBack = () => {
        const { navigation, onBack } = this.props;
        navigation.pop();
        onBack();
        const { onbackCB } = this.props?.route?.params;
        onbackCB();

    }
    onPressCamera = () => {
        request(
            Platform.select({
                android: PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
                ios: PERMISSIONS.IOS.CAMERA,
            }),
        ).then(response => {
            if (response === "granted") {
                ImageCropPicker.openCamera({
                    includeBase64: false,
                    cropping: false,
                    includeExif: false, //True thì có nhiều thông tin metadata nhưng nặng. 
                    compressImageQuality: 0.8,
                })
                    .then(image => {
                        console.log("image", image)
                        const imagePayload = {
                            uri: image.path,
                            type: image.mime,
                        };
                        this.setState({ lst_image: [...this.state.lst_image, imagePayload] })

                    })
                    .catch(e => { });
            } else {
                if (Platform.OS === "ios") {
                    Alert.alert(
                        'Cấp quyền truy cập',
                        'Ứng dụng cần cấp quyền truy cập vào camera để cập nhật hình ảnh hàng gửi',
                        [
                            {
                                text: 'Huỷ',
                                onPress: () => console.log("Cancel Pressed"),
                                style: "cancel"
                            },
                            {
                                text: 'Đồng ý',
                                onPress: () => {
                                    Linking.canOpenURL("app-settings:")
                                        .then(supported => {
                                            if (!supported) {
                                                //console.oldlog('Can\'t handle settings url');
                                            } else {
                                                return Linking.openURL("app-settings:1");
                                            }
                                        })
                                        .catch(err =>
                                            console.error("An error occurred", err)
                                        );
                                }
                            }
                        ],
                        { cancelable: true }
                    );
                }
            }
        });

    }

    onPressPickerImage = () => {
        request(
            Platform.select({
                android: PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
                ios: PERMISSIONS.IOS.PHOTO_LIBRARY
            })
        ).then(response => {
            if (response === "granted") {
                ImageCropPicker.openPicker({
                    includeBase64: false,
                    multiple: true,
                    maxFiles: 5 - this.state.lst_image.length,
                    compressImageQuality: 0.8,
                    mediaType: 'photo',
                    forceJpg: true,

                }).then(async image => {
                    const lst = image.map(value => {
                        return {
                            uri: value.path,
                            type: value.mime,
                        }
                    })
                    this.setState({ lst_image: [...this.state.lst_image, ...lst] })
                    // const formData = new FormData();
                    // image.map((data, index) => {
                    //     formData.append('files', {
                    //         uri: data.path,
                    //         type: data.mime,
                    //         name: 'image' + index
                    //     })
                    // })
                    // console.log('formData', formData)
                    // const dataupload = await UploadMultipleImageApi(formData);
                    // console.log("dataupload", dataupload)

                }).catch(error => {
                    console.log("error", error)
                })
            } else {
                if (Platform.OS === 'ios') {
                    Alert.alert(
                        'Cấp quyền truy cập',
                        'Ứng dụng cần quyền truy cập thư viện để cập nhật hình ảnh đơn hàng',
                        [
                            { text: 'Huỷ', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                            {
                                text: 'Đồng ý', onPress: () => {

                                    Linking.canOpenURL('app-settings:').then(supported => {
                                        if (!supported) {
                                            //console.oldlog('Can\'t handle settings url');
                                        } else {
                                            return Linking.openURL('app-settings:1');
                                        }
                                    }).catch(err => console.error('An error occurred', err));

                                }
                            },
                        ],
                        { cancelable: true }
                    )
                }
            }
        })
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
        return <View style={{ height: 0.8, opacity: 1, backgroundColor: color.GRAY_COLOR_400, marginVertical: scale(5) }} />

    }





    renderPhoneTakeOrder = () => {
        return <View style={{ marginHorizontal: scale(10) }}>
            <Text style={{ fontSize: scale(15), fontWeight: '600', color: color.GRAY_COLOR_500, marginVertical: scale(10) }}>Số điện thoại người nhận <Text style={{ color: color.RED_COLOR }}>*</Text></Text>
            <View style={{ flexDirection: 'row', alignItems: "center", paddingVertical: scale(10), borderRadius: scale(7), borderWidth: scale(0.7), borderColor: color.GRAY_COLOR_400 }}>
                <Image style={{ width: scale(20), height: scale(16), marginHorizontal: scale(10) }} source={require('./res/ic_flag_vn.png')} />
                <TextInput onChangeText={txt => this.setState({ phone_number: txt })} placeholderTextColor={color.GRAY_COLOR_400} keyboardType="number-pad" style={{ fontSize: scale(14), fontWeight: '500', flex: 1 }} placeholder="Số điện thoại người nhận" />
            </View>
        </View>
    }

    renderWeight = () => {
        return <View style={{ marginHorizontal: scale(10) }}>
            <Text style={{ fontSize: scale(15), fontWeight: '600', color: color.GRAY_COLOR_500, marginVertical: scale(10) }}>Trọng lượng (kg) <Text style={{ color: color.RED_COLOR }}>*</Text></Text>
            <View style={{ flexDirection: 'row', alignItems: "center", paddingVertical: scale(10), borderRadius: scale(7), borderWidth: scale(0.7), borderColor: color.GRAY_COLOR_400 }}>
                <MaterialCommunityIcons
                    name='weight-kilogram'
                    size={scale(20)}
                    color={color.MAIN_COLOR}
                    style={{ marginHorizontal: scale(10), opacity: 0.7 }}
                />
                <TextInput onChangeText={txt => this.setState({ weight: txt })} keyboardType="numeric" placeholderTextColor={color.GRAY_COLOR_400} style={{ fontSize: scale(14), fontWeight: '500', flex: 1 }} placeholder="Trọng lượng hàng hoá" />
            </View>
        </View>
    }
    renderNote = () => {
        return <View style={{ marginHorizontal: scale(10) }}>
            <Text style={{ fontSize: scale(15), fontWeight: '600', color: color.GRAY_COLOR_500, marginVertical: scale(10) }}>Lưu ý với tài xế</Text>
            <View style={{ flexDirection: 'row', alignItems: "center", paddingVertical: scale(10), borderRadius: scale(7), borderWidth: scale(0.7), borderColor: color.GRAY_COLOR_400 }}>
                <MaterialCommunityIcons
                    name='note'
                    size={scale(20)}
                    color={color.MAIN_COLOR}
                    style={{ marginHorizontal: scale(10), opacity: 0.7 }}
                />
                <TextInput onChangeText={txt => this.setState({ note: txt })} placeholderTextColor={color.GRAY_COLOR_400} style={{ fontSize: scale(14), fontWeight: '500', flex: 1, marginRight: scale(7) }} multiline={true} placeholder="Lưu ý với tài xế" />
            </View>
        </View>
    }
    renderMethodTake = () => {
        const { method_take } = this.state;
        return <View style={{ marginHorizontal: scale(10) }}>
            <Text style={{ fontSize: scale(15), fontWeight: '600', color: color.GRAY_COLOR_500, marginVertical: scale(10) }}>Cách thức nhà xe lấy và giao hàng  <Text style={{ color: color.RED_COLOR }}>*</Text></Text>
            <TouchableOpacity
                onPress={() => {
                    this.methodTake.show();
                }}
                style={{ flexDirection: 'row', alignItems: "center", paddingVertical: scale(10), borderRadius: scale(7), borderWidth: scale(0.7), borderColor: color.GRAY_COLOR_400 }}>
                <FontAwesomeIcon
                    name='shopping-bag'
                    size={scale(20)}
                    color={color.MAIN_COLOR}
                    style={{ marginHorizontal: scale(10), opacity: 0.7 }}
                />
                {!method_take && <Text style={{ fontSize: scale(14), fontWeight: '500', color: color.GRAY_COLOR_400 }}>Chọn cách thức lấy và giao hàng</Text>}
                {method_take && <Text style={{ fontSize: scale(14), fontWeight: '500' }}> {method_take == CONSTANT_TYPE_BOOKING.COACH_DELIVERY_CAR ? 'Lấy và giao hàng tại điểm xe đi qua' : 'Lấy và giao hàng tại điểm chỉ định'}</Text>}
                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                    <FontAwesomeIcon
                        name='angle-down'
                        size={scale(20)}
                        color={color.MAIN_COLOR}
                        style={{ marginHorizontal: scale(10), opacity: 0.7 }}
                    />
                </View>
            </TouchableOpacity>
        </View>
    }
    renderImageOrder = () => {
        const widthButton = (width - scale(60)) / 5
        return <View style={{}}>
            <Text style={{ fontSize: scale(15), fontWeight: '600', color: color.GRAY_COLOR_500, marginVertical: scale(10), marginHorizontal: scale(10) }}>Ảnh hàng gửi</Text>
            <View style={{ flexDirection: 'row', alignItems: "center", borderRadius: scale(7) }}>
                {this.state.lst_image.length < 5 && <TouchableOpacity
                    onPress={() => {
                        this.ActionSheet.show()
                    }}
                    style={{ borderWidth: scale(0.7), borderColor: color.MAIN_COLOR, borderStyle: 'dashed', width: widthButton, height: widthButton, borderRadius: scale(10), alignItems: 'center', justifyContent: "center", marginLeft: scale(10) }}>
                    <MaterialCommunityIcons
                        name='camera-outline'
                        size={scale(26)}
                        color={color.MAIN_COLOR}
                    />
                </TouchableOpacity>
                }
                {this.state.lst_image.map((img, index) => {
                    console.log("img", img)
                    return <TouchableOpacity onPress={() => this.onShowImage(index)}>
                        <FastImage
                            source={{ uri: img.uri }}
                            style={{ width: widthButton, height: widthButton, borderRadius: scale(10), alignItems: 'center', justifyContent: "center", marginLeft: scale(10) }}
                        />
                        <TouchableOpacity
                            onPress={() => {
                                this.deleteImage(img);
                            }}
                            style={{
                                width: scale(20),
                                height: scale(20),
                                position: 'absolute',
                                bottom: scale(-2),
                                right: scale(-2),
                                alignItems: 'center', justifyContent: "center",
                                backgroundColor: '#FFFFFF',
                                borderRadius: scale(10)
                            }}>
                            <MaterialCommunityIcons
                                name='window-close'
                                size={scale(14)}
                            />
                        </TouchableOpacity>
                    </TouchableOpacity>

                })}

            </View>
            <View style={{ height: scale(6), backgroundColor: color.GRAY_COLOR_200, marginTop: scale(10), opacity: 0.7 }} />
        </View >
    }
    renderPayment = () => {
        return <View style={{ marginHorizontal: scale(10) }}>
            <Text style={{ fontSize: scale(15), fontWeight: '600', color: color.GRAY_COLOR_500, marginTop: scale(10) }}>Cách thanh toán</Text>
            <View style={{ flexDirection: 'row', alignItems: "center", marginTop: scale(10) }}>
                <View style={{ height: scale(20), width: scale(20), borderRadius: scale(5), borderWidth: 2, alignItems: 'center', justifyContent: "center" }}>
                    <Text style={{ fontWeight: '600' }}>đ</Text>
                </View>
                <Text style={{ marginLeft: scale(10), fontSize: scale(14) }}>Thanh toán bằng tiền mặt</Text>
            </View>
            <View style={{ height: scale(6), backgroundColor: color.GRAY_COLOR_200, marginTop: scale(10), opacity: 0.7 }} />

        </View>
    }
    onShowImage = (index) => {
        this.setState({ showImage: { show: true, index: index } })
    }
    deleteImage = (img) => {
        const { lst_image } = this.state;
        let newArr = lst_image.filter(dt => img.uri != dt.uri)
        console.log("newArr", newArr)
        this.setState({ lst_image: newArr })
    }
    onContinue = async () => {
        // const { lst_image } = this.state;
        // const formData = new FormData();
        // lst_image.map((data, index) => {
        //     formData.append('files', {
        //         uri: data.uri,
        //         type: data.type,
        //         name: 'image' + index
        //     })
        // })
        // const dataupload = await UploadMultipleImageApi(formData);
        const { getListDriver, getListDriverDone, coord } = this.props;

        const { phone_number, method_take, lst_image, note, weight } = this.state;
        if (!isValidPhoneNumber(phone_number, 'VN')) {
            Alert.alert('Số điện thoại không hợp lệ')
            return;
        }
        const { data_diem_don, data_diem_den } = this.props?.route?.params;
        const { navigation } = this.props;

        navigation.push(
            "FindDriver",
            {
                data_diem_don: data_diem_don,
                data_diem_den: data_diem_den,
                infoOrder: {
                    phone_number: phone_number,
                    method_take: method_take,
                    lst_image: lst_image,
                    note: note,
                    weight: weight
                }
            });
        getListDriver();
        let lat_origin = data_diem_don ? data_diem_don.displayPosition.latitude : coord.lat
        let lng_origin = data_diem_don ? data_diem_don.displayPosition.longitude : coord.lng
        const body_booking = {
            from: {
                lat: lat_origin,
                lng: lng_origin

            },
            to: {
                lat: data_diem_den.displayPosition.latitude,
                lng: data_diem_den.displayPosition.longitude,
            },
            journey_type: method_take == CONSTANT_TYPE_BOOKING.COACH_DELIVERY_CAR ? CONSTANT_TYPE_JOURNEYS.COACH_CAR : CONSTANT_TYPE_JOURNEYS.HYBIRD_CAR,
        };
        let reqGetDriver = await getListDriverDeliveryAPI(body_booking);
        console.log("reqGetDriver", reqGetDriver)
        if (!reqGetDriver.err) {
            getListDriverDone(reqGetDriver.data)
        }
    }
    render() {
        const { phone_number, weight, method_take } = this.state;
        const enablebtn = phone_number && weight && method_take;
        let index = 0;

        const data = [
            { key: index++, section: true, label: 'Cách thức nhà xe lấy và giao hàng' },
            { key: index++, label: 'Lấy và giao hàng điểm chỉ định', type: CONSTANT_TYPE_BOOKING.HYBIRD_DELIVERY_CAR },
            { key: index++, label: 'Lấy và giao hàng tại điểm xe đi qua', type: CONSTANT_TYPE_BOOKING.COACH_DELIVERY_CAR },

        ];
        const UrlImageShow = this.state.lst_image.map(img => {
            return { url: img.uri }
        })
        return (
            <View style={{ flex: 1, backgroundColor: "#FFFFFF", borderRadius: scale(20) }}>
                <View style={{ marginBottom: scale(10), flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <View style={{ marginHorizontal: scale(10), flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity onPress={this.onBack} style={{ paddingRight: 0 }}>
                            <MaterialIcons
                                name='arrow-back-ios'
                                size={scale(22)}
                                color="black"
                            />
                        </TouchableOpacity>
                        <Text style={{ fontSize: scale(20), fontWeight: 'bold' }}>Gửi hàng theo xe</Text>

                    </View>
                    <TouchableOpacity
                        onPress={this.onContinue}
                        disabled={!enablebtn}
                        style={{
                            height: scale(30),
                            borderRadius: scale(20),
                            alignItems: "center",
                            justifyContent: 'center',
                            backgroundColor: enablebtn ? color.ORANGE_COLOR_400 : color.GRAY_COLOR_400,
                            marginRight: scale(10),
                            width: scale(120),
                            flexDirection: 'row'
                        }}>
                        {this.state.isloading && <ActivityIndicator size="small" color={color.ORANGE_COLOR_400} style={{}} />}
                        <Text style={{ fontSize: scale(12), fontWeight: 'bold', color: '#FFFFFF' }}>Tìm xe</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ width: width, height: 1, backgroundColor: color.GRAY_COLOR_400, opacity: 0.5 }} />
                <KeyboardAwareScrollView
                    extraScrollHeight={scale(50)}
                    extraHeight={scale(340)}
                    innerRef={ref => {
                        this.scroll = ref
                    }}
                    showsVerticalScrollIndicator={false}>


                    <View style={{ marginHorizontal: scale(10), marginTop: scale(5) }}>
                        <Text style={{ fontSize: scale(13), fontWeight: 'bold', color: color.GRAY_COLOR_500 }}>Thông tin đơn hàng</Text>
                    </View>
                    {this.renderInfo()}
                    {this.renderPhoneTakeOrder()}
                    {this.renderWeight()}
                    {this.renderMethodTake()}
                    {this.renderNote()}
                    {this.renderPayment()}
                    {this.renderImageOrder()}
                    <View style={{ marginBottom: scale(30) }}></View>

                </KeyboardAwareScrollView>

                <ActionSheet
                    ref={o => this.methodTake = o}
                    title={'Cách thức nhà xe lấy và giao hàng'}
                    options={['Lấy và giao hàng tại điểm chỉ định', 'Lấy và giao hàng tại điểm xe đi qua', 'Huỷ']}
                    cancelButtonIndex={2}
                    // destructiveButtonIndex={2}
                    onPress={(index) => {
                        if (index == 0) {
                            this.setState({ method_take: CONSTANT_TYPE_BOOKING.HYBIRD_DELIVERY_CAR })
                        }
                        if (index == 1) {
                            this.setState({ method_take: CONSTANT_TYPE_BOOKING.COACH_DELIVERY_CAR })
                        }
                    }}
                />
                <ActionSheet
                    ref={o => this.ActionSheet = o}
                    title={'Chọn ảnh từ ?'}
                    options={['Thư viện', 'Camera', 'Huỷ']}
                    cancelButtonIndex={2}
                    // destructiveButtonIndex={2}
                    onPress={(index) => {
                        if (index == 0) {
                            //ffrom library
                            this.onPressPickerImage()
                        }
                        if (index == 1) {
                            //ffrom camera
                            this.onPressCamera()
                        }
                    }}
                />
                <Modal
                    onRequestClose={() => this.setState({ showImage: { show: false } })}
                    visible={this.state.showImage.show}
                    transparent={true}>
                    <ImageViewer
                        index={this.state.showImage.index}
                        onSwipeDown={() => {
                            this.setState({ showImage: { show: false } })
                        }}
                        renderFooter={index => {
                            return <View style={{ width: width, height: 50 }}>
                                <Text style={{ color: color.MAIN_COLOR, alignSelf: "center", marginBottom: scale(10), fontSize: scale(15), fontWeight: '500' }}>Vuốt xuống để tắt</Text>
                            </View>
                        }}
                        enableSwipeDown
                        imageUrls={UrlImageShow} />
                </Modal>
            </View>
        )
    }
}


const mapStateToProps = (state) => {
    return {
        isLoading_getListDriver: state.DeliveryReducer.isLoading,
        lstDriver: state.DeliveryReducer.lstDriver,
        distance: state.DeliveryReducer.distance,
    }
}
function mapDispatchToProps(dispatch) {
    return {
        updateCurrentBooking: (dt) => {
            dispatch(actionsHome.action.updateCurrentBooking(dt));
        },
        getListDriver: () => {
            dispatch(actions.action.getListDriver());
        },
        getListDriverDone: (data) => {
            dispatch(actions.action.getListDriverDone(data));
        },

        dispatch,
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(AdditionalInfo);

