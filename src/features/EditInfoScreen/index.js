import React, { useState, useEffect, PureComponent } from 'react'
import {
    Image,
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    TextInput,
    KeyboardAvoidingView,
    Linking,
    Platform,
    SafeAreaView,
    ActivityIndicator,
    Alert,
    ScrollView
} from 'react-native'
import { PERMISSIONS, request } from 'react-native-permissions';

import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialIcons';
import { scale } from '../../ultis/scale'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';
import { color } from '../../constant/color';
import { Navigation } from 'react-native-navigation';
import Modal from 'react-native-modal';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import parsePhoneNumber from 'libphonenumber-js'
import ImageCropPicker from "react-native-image-crop-picker";
import { UpdateProfileAPI } from '../../api/loginApi'
import { setRootToLogin, pushToHistoryScreen } from '../../NavigationController'
import FastImage from 'react-native-fast-image';
import { UploadImageApi } from '../../api/ImageAPI'
import { updateLocalData } from '../../model'
import _ from 'lodash'
const { width, height } = Dimensions.get('window')

class EditInfoScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showModalImage: false,
            name: props.user_info.name,
            phone: parsePhoneNumber(props.user_info.phone, 'VN').nationalNumber,
            imagePath: {
                uri: props.user_info.avatar
            },
            isloading: false
        };
    }
    renderImage = () => {
        const { imagePath } = this.state;
        return <View style={{ marginTop: scale(20) }}>
            <Text style={{ fontWeight: "600", fontSize: scale(14) }}>Ảnh đại diện</Text>
            <View style={{ marginTop: scale(10), flexDirection: "row", alignItems: "center" }}>
                {imagePath.uri == undefined || imagePath.uri == null || imagePath.uri == '' ? <TouchableOpacity
                    onPress={() => this.setState({ showModalImage: true })}
                    activeOpacity={0.7}
                    style={{ width: scale(60), height: scale(60), borderRadius: scale(30), alignItems: 'center', justifyContent: 'center', backgroundColor: color.ORANGE_COLOR_400 }}>
                    <FontAwesomeIcon
                        name="user-alt"
                        color="#FFFFFF"
                        size={scale(18)}
                    />
                    <View style={{ position: "absolute", bottom: 0, right: 0, backgroundColor: color.GRAY_COLOR_400, width: scale(20), height: scale(20), borderRadius: scale(10), alignItems: 'center', justifyContent: "center" }}>
                        <FontAwesomeIcon
                            name="camera"
                            color="#FFFFFF"
                            size={scale(9)}
                        />
                    </View>
                </TouchableOpacity> : <TouchableOpacity
                    onPress={() => this.setState({ showModalImage: true })}
                    activeOpacity={0.7} >
                    <FastImage style={{ width: scale(60), height: scale(60), borderRadius: scale(30) }} source={{ uri: imagePath.uri }} />
                    <View style={{ position: "absolute", bottom: 0, right: 0, backgroundColor: color.GRAY_COLOR_400, width: scale(20), height: scale(20), borderRadius: scale(10), alignItems: 'center', justifyContent: "center" }}>
                        <FontAwesomeIcon
                            name="camera"
                            color="#FFFFFF"
                            size={scale(9)}
                        />
                    </View>
                </TouchableOpacity>}

                <Text style={{ marginLeft: scale(10), fontSize: scale(15) }}>Hãy chọn ảnh đại diện của bạn ngay nhé</Text>

            </View>

        </View >
    }
    renderName = () => {
        const { name } = this.state;
        return <View style={{ marginTop: scale(30) }}>
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: scale(13), fontWeight: '500' }}>Tên</Text>
                <Text style={{ fontSize: scale(13), color: color.RED_COLOR }}>*</Text>
            </View>
            <TextInput
                style={{ marginTop: scale(15), fontSize: scale(18), borderBottomWidth: 2, borderColor: color.GRAY_COLOR_200, paddingBottom: scale(5) }}
                value={name}
                onChangeText={txt => this.setState({ name: txt })}
                placeholder="Hãy nhập tên" />
        </View>
    }
    renderPhone = () => {
        const { phone } = this.state;
        return <View style={{ marginTop: scale(25) }}>
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: scale(13), fontWeight: '500' }}>Số điện thoại</Text>
                <Text style={{ fontSize: scale(13), color: color.RED_COLOR }}>*</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: scale(15) }}>
                <View style={{ flexDirection: 'row', alignItems: "center", padding: scale(6), backgroundColor: color.GRAY_COLOR_100, borderRadius: scale(10), borderWidth: 1, borderColor: color.GRAY_COLOR_200 }}>
                    <Image
                        resizeMode="cover"
                        style={{ width: scale(17), height: scale(14) }}
                        source={require('../SignIn/res/ic_flag_vn.png')} />
                    <Text style={{ fontSize: scale(13), marginLeft: scale(5), fontWeight: "600" }}>+84</Text>
                </View>
                <TextInput
                    style={{ fontSize: scale(18), borderBottomWidth: 2, borderColor: color.GRAY_COLOR_200, paddingBottom: scale(5), flex: 1, marginLeft: scale(15), fontWeight: '600' }}
                    value={phone}
                    editable={false}
                    // onChangeText={txt => this.setState({ phone: txt })}
                    placeholder="Hãy nhập tên" />
            </View>

        </View>
    }
    onPickImage = () => {
        request(
            Platform.select({
                android: PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
                ios: PERMISSIONS.IOS.PHOTO_LIBRARY
            })
        ).then(response => {
            if (response === "granted") {
                ImageCropPicker.openPicker({
                    includeBase64: false,
                    multiple: false,
                    compressImageQuality: 0.8,
                    mediaType: 'photo',
                    forceJpg: true,

                }).then(async image => {
                    this.setState({
                        imagePath: {
                            uri: image.path,
                            type: image.mime,
                        },
                        showModalImage: false
                    })

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

    onDeleteImage = () => {
        this.setState({
            imagePath: {
                uri: ''
            },
            showModalImage: false
        })
    }
    onSave = async () => {
        const { name, imagePath } = this.state;
        console.log('save')
        this.setState({ isloading: true })
        if (imagePath.type) {
            const formData = new FormData();
            formData.append('file', {
                uri: imagePath.uri,
                type: imagePath.type,
                name: 'image123'
            })
            const dataupload = await UploadImageApi(formData);
            const req = await UpdateProfileAPI({ name: name, avatar: dataupload.data })
            this.setState({ isloading: false })

            if (!req.err) {
                console.log('update local data')
                updateLocalData(req.data)
            }
            Navigation.pop(this.props.componentId)
            console.log('req', req)
        } else {
            const req = await UpdateProfileAPI({ name: name, avatar: imagePath.uri })
            if (!req.err) {
                updateLocalData(req.data)
            }
            this.setState({ isloading: false })
            Navigation.pop(this.props.componentId)

        }


    }
    render() {
        const { componentId, user_info } = this.props;
        const { showModalImage, imagePath, name, isloading } = this.state;
        const isDisable = !name || isloading || (name == user_info.name && imagePath.uri == user_info.avatar)
        console.log("this.props.user_info", this.props.user_info)
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <TouchableOpacity activeOpacity={0.6} onPress={() => Navigation.pop(this.props.componentId)}>
                        <Icon
                            name='arrow-back'
                            size={scale(22)}
                            color="black"
                            style={{ margin: scale(10) }}
                        />
                    </TouchableOpacity>

                    <Text style={{ fontSize: scale(22), fontWeight: 'bold', color: color.GRAY_COLOR_900 }}>Sửa thông tin</Text>
                </View>
                <ScrollView style={{ flex: 1, marginHorizontal: scale(10) }}>
                    {this.renderImage()}
                    {this.renderName()}
                    {this.renderPhone()}
                    <TouchableOpacity
                        disabled={isDisable}
                        onPress={_.debounce(() => this.onSave(), 1000, { leading: true, trailing: false })}
                        activeOpacity={0.6}
                        style={{ marginHorizontal: scale(15), borderRadius: scale(20), borderColor: !isDisable ? color.RED_300 : color.GRAY_COLOR_400, height: scale(40), borderWidth: 2, alignItems: 'center', justifyContent: "center", marginVertical: scale(30), flexDirection: 'row' }}>
                        {this.state.isloading && <ActivityIndicator size="small" color={color.ORANGE_COLOR_400} style={{ marginRight: scale(10) }} />}
                        <Text style={{ fontSize: scale(15), fontWeight: "600", color: !isDisable ? color.RED_300 : color.GRAY_COLOR_400 }}>Lưu thông tin</Text>
                    </TouchableOpacity>
                </ScrollView>
                <Modal
                    isVisible={showModalImage}
                    onSwipeComplete={this.close}
                    swipeDirection={['up', 'left', 'right', 'down']}
                    style={{
                        justifyContent: 'flex-end',
                        margin: 0
                    }}>
                    <TouchableOpacity onPress={() => this.setState({ showModalImage: !showModalImage })} activeOpacity={0.6} style={{ width: scale(40), height: scale(40), borderRadius: scale(25), backgroundColor: "white", alignSelf: 'flex-end', margin: scale(10), alignItems: 'center', justifyContent: "center" }}>
                        <MaterialCommunityIcons
                            name="close"
                            color="black"
                            size={scale(25)}
                        />
                    </TouchableOpacity>
                    <View style={{ backgroundColor: '#FFFFFF', borderTopRightRadius: scale(15), borderTopLeftRadius: scale(15), paddingBottom: 40 }}>
                        <Text style={{ fontSize: scale(20), fontWeight: "600", marginVertical: scale(15), marginHorizontal: scale(10) }}>Thay đổi ảnh đại diện</Text>
                        <TouchableOpacity onPress={this.onPickImage} activeOpacity={0.6} style={{ flexDirection: "row", marginHorizontal: scale(10), alignItems: 'center' }}>
                            <MaterialCommunityIcons
                                name="image"
                                color="black"
                                size={scale(18)}
                            />
                            <View style={{ flexDirection: 'row', alignItems: "center", marginHorizontal: scale(10) }}>
                                <Text style={{ fontWeight: '500', fontSize: scale(15), flex: 1 }}>Chọn ảnh từ thư viện</Text>
                                <FontAwesomeIcon
                                    name="chevron-right"
                                    color={color.GRAY_COLOR_500}
                                    size={scale(15)}
                                    style={{ marginHorizontal: scale(10) }}
                                />
                            </View>
                        </TouchableOpacity>
                        <View style={{ height: 2, backgroundColor: color.GRAY_COLOR_200, marginHorizontal: scale(10), marginVertical: scale(15) }} />
                        {imagePath.uri !== '' && <TouchableOpacity activeOpacity={0.6} onPress={this.onDeleteImage} style={{ flexDirection: "row", marginHorizontal: scale(10), alignItems: 'center' }}>
                            <MaterialCommunityIcons
                                name="delete-empty"
                                color="black"
                                size={scale(18)}
                            />
                            <View style={{ flexDirection: 'row', alignItems: "center", marginHorizontal: scale(10) }}>
                                <Text style={{ fontWeight: '500', fontSize: scale(15), flex: 1 }}>Gỡ ảnh hiện tại</Text>
                                <FontAwesomeIcon
                                    name="chevron-right"
                                    color={color.GRAY_COLOR_500}
                                    size={scale(15)}
                                    style={{ marginHorizontal: scale(10) }}
                                />
                            </View>
                        </TouchableOpacity>}

                    </View>
                </Modal>
            </SafeAreaView >
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

export default connect(mapStateToProps, mapDispatchToProps)(EditInfoScreen)

