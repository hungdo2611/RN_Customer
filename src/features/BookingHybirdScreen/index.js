import React, { Component } from 'react';

import { connect } from 'react-redux';
import MapView, { PROVIDER_GOOGLE, AnimatedRegion, Marker, Polyline } from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import { Navigation } from 'react-native-navigation';

import { PERMISSIONS, request } from "react-native-permissions";
import Geolocation from 'react-native-geolocation-service';
import LocationAnimate from '../../component/LocationAnimation'
import {
    Text,
    View,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Image,
    Animated,
    PanResponder,
    TextInput,
    ScrollView,
    Platform,
    Keyboard,
    TouchableWithoutFeedback,
    BackHandler,
    Alert,
    AppState,
    Easing,
} from 'react-native';


import BottomTab from './components/BottomTab';
import { scale } from '../../ultis/scale';
import { color } from '../../constant/color';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';

import SelectDesOrigin from './SelectDesOrigin'
import { enableScreens } from 'react-native-screens';
import { getAdressFromLatLng, getRouteBetween2Point, getPolyline } from '../../api/MapApi'
import AdditionalInfo from './AdditionInfo'
import actions from './redux/actions'
import WaitingDriverScreen from './WaitingDriver'
import { decode } from '../../ultis/polyline'
import { constant_type_status_booking } from './constant'
import UserCancelBooking from './UserCancelBooking';
import BookingProcessing from './BookingProcessing';
import BookingFinish from './BookingFinish';
import WaitingPickup from './WaitingPickup';
import { instanceData, disable_help_coach } from '../../model';
import Tooltip from 'react-native-walkthrough-tooltip';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import actionsHome from '../HomeScreen/redux/actions'
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';

enableScreens();
const Stack = Platform.OS == 'android' ? createStackNavigator() : createNativeStackNavigator();

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        flex: 1,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});
const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.1;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

/** Màn hình tạo yêu cầu */

const constantService = {
    XE_KHACH: 'XE_KHACH',
    XE_TIEN_CHUYEN: 'XE_TIEN_CHUYEN',
    GUI_HANG: 'GUI_HANG',
    NONE: 'NONE'
}

function convertRouteDataForAPI(data) {
    const arr = data.response.route[0].leg[0].maneuver
    let route = arr.map(vl => {
        return [vl.position.longitude, vl.position.latitude]

    })
    return route
}
function convertRouteDataForShowRoute(data) {
    let route = data.map(vl => {
        return { longitude: vl[1], latitude: vl[0] }

    })
    return route
}
class CreateTripScreen extends Component {
    map = null;

    marker = null;


    BottomViewStep2 = null;

    constructor(props) {
        super(props);

        this.state = {
            latitude: 0,
            longitude: 0,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
            coordinate: new AnimatedRegion({
                latitude: 0,
                longitude: 0,
                longitudeDelta: LONGITUDE_DELTA,
                latitudeDelta: LATITUDE_DELTA,
            }),
            isPickWithGGMap: false,
            isInCreaseHeight: false,
            renderStep: 1,
            distance: 0,
            IsIncreaseFromStart: false,
            WayPoint: [],
            currentService: constantService.NONE,
            lst_polyline: [],
            diem_don: null,
            diem_den: null,
            routeAPI: [],
            EnablePull: true,
            appState: AppState.currentState,
            show_help: instanceData.show_help.hybird
        };
        Navigation.events().bindComponent(this);

    }

    static get options() {
        return {
            topBar: { visible: false, height: 0 },
        };
    }

    // eslint-disable-next-line react/sort-comp
    componentWillMount() { }

    componentDidMount() {

        disable_help_coach({ ...instanceData.show_help, hybird: false })
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
        AppState.addEventListener('change', this._handleAppStateChange);
        try {
            request(
                Platform.select({
                    android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
                    ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
                })
            ).then(res => {
                console.log("res", res)
                if (res == "granted") {
                    Geolocation.getCurrentPosition(
                        position => {
                            console.log(position);
                            this.setState({
                                latitude: position.coords.latitude,
                                longitude: position.coords.longitude,
                                coordinate: new AnimatedRegion({
                                    latitude: position.coords.latitude,
                                    longitude: position.coords.longitude,
                                    latitudeDelta: LATITUDE_DELTA,
                                    longitudeDelta: LONGITUDE_DELTA,
                                }),
                            });
                            const r = {
                                latitude: position.coords.latitude,
                                longitude: position.coords.longitude,
                                latitudeDelta: LATITUDE_DELTA,
                                longitudeDelta: LONGITUDE_DELTA,
                            };
                            this.map.animateToRegion(r, 500);
                        },
                        error => console.log('error', error),
                        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
                    );
                } else {
                    if (Platform.OS === "ios" || res == 'blocked') {
                        Alert.alert(
                            'Ứng dụng cần quyền truy cập vị trí',
                            'Ứng dụng cần quyền vị trí của bạn để có thể tạo chuyến và kết nối với tài xế',
                            [
                                {
                                    text: 'Không',

                                    onPress: () => console.log('Permission denied'),
                                    style: 'cancel',
                                },

                                {
                                    text: 'Cài đặt',
                                    onPress: () => {
                                        Linking.openSettings();
                                    }
                                },
                            ],
                        );
                    }

                    // console.log("Location is not enabled");
                }
            });
        } catch (error) {
            console.log("location set error:", error);
        }


        if (this.props.currentBooking) {
            this.setDataRouteBooking()
        }
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.props.currentBooking && prevProps.currentBooking !== this.props.currentBooking) {
            this.setDataRouteBooking()
        }
    }
    setDataRouteBooking = () => {
        let lst_Point = []
        this.props.currentBooking.line_string.map(value => {
            const lst_polyline = decode(value)
            lst_Point = [...lst_Point, ...lst_polyline.polyline]
        });
        const newRoute = convertRouteDataForShowRoute(lst_Point);
        console.log("setDataRouteBooking", newRoute)

        this.setState({ lst_polyline: newRoute })
        setTimeout(() => {
            this.map.fitToCoordinates(newRoute, {
                edgePadding: {
                    right: 20,
                    bottom: height / 4 + 200,
                    left: 20,
                    top: 20,
                }
            });
            if (this.suggestion) {
                this.suggestion.showCallout();
            }
        }, 500)
    }


    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
        AppState.removeEventListener('change', this._handleAppStateChange);
    }

    _handleAppStateChange = (nextAppState) => {
        if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
            console.log('App has come to the foreground!')
            BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
            const { getCurrentBooking, currentBooking } = this.props;
            if (currentBooking) {
                getCurrentBooking(currentBooking._id);
            }
            Geolocation.getCurrentPosition(
                position => {
                    console.log(position);
                    this.setState({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        coordinate: new AnimatedRegion({
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                            latitudeDelta: LATITUDE_DELTA,
                            longitudeDelta: LONGITUDE_DELTA,
                        }),
                    });
                },
                error => console.log('error', error),
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
            );

        }
        this.setState({ appState: nextAppState });


    };

    handleBackPress = () => true;


    animate = (latitude, longitude) => {
        const r = {
            latitude,
            longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
        };
        this.map.animateToRegion(r, 200);
    };

    onRegionChange = async data => {
        const { coordinate, isPickWithGGMap, renderStep, latitude, longitude } = this.state;
        const { searchWithLatLng } = this.props;
        console.log('data', data);

        if (isPickWithGGMap) {
            let reqAdress = await getAdressFromLatLng(data.latitude, data.longitude)
            if (reqAdress && reqAdress.items && reqAdress.items[0]) {
                if (this.LocationAnimate && isPickWithGGMap) {
                    this.LocationAnimate.MoveDown();
                }
                this.SelectDesOrigin.setLoadingPickWithGG(false);
                this.SelectDesOrigin.setDataPickWithGG(reqAdress.items[0])
            }

        }
    };
    getCurrentPlace = async () => {
        const { latitude, longitude, isPickWithGGMap } = this.state;
        this.SelectDesOrigin.setLoadingPickWithGG(true);

        let reqAdress = await getAdressFromLatLng(latitude, longitude)
        if (reqAdress && reqAdress.items && reqAdress.items[0]) {
            if (this.LocationAnimate && isPickWithGGMap) {
                this.LocationAnimate.MoveDown();
            }
            this.SelectDesOrigin.setLoadingPickWithGG(false);
            this.SelectDesOrigin.setDataPickWithGG(reqAdress.items[0])

        }
    }



    PutDestination = () => {
        const { latitude, longitude } = this.state;

        this.setState({ renderStep: 2 });
        Geolocation.getCurrentPosition(
            position => {
                // this.animate(position.coords.latitude, position.coords.longitude);
                this.setState({ latitude: position.coords.latitude, longitude: position.coords.longitude });
            },
            error => console.log('get current location false', error),
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    };






    _onPressBackIcon = () => {
        const { renderStep } = this.state;
        const { componentId } = this.props;

        if (renderStep === 1) {
            Navigation.pop(componentId);
        } else {
            this.setState({ renderStep: 1, isPickWithGGMap: false });
        }
    };




    onMarkerDragEnd = (data) => {
        console.log("onMarkerDragEnd", data)

        // const { latLng } = coord;
        // const lat = latLng.lat();
        // const lng = latLng.lng();
        // console.log("coord", coord)
        // this.setState({ latitude: lat, longitude: lng });
    };
    setRoute = async (lstCoord) => {
        let reqGetPolyline = await getPolyline(lstCoord);
        let lst_Point = []
        let line_string = []
        reqGetPolyline.routes[0].sections.map(value => {
            const lst_polyline = decode(value.polyline)
            line_string = [...line_string, value.polyline]
            lst_Point = [...lst_Point, ...lst_polyline.polyline]
        });
        let route = convertRouteDataForShowRoute(lst_Point)
        setTimeout(() => {
            this.map.fitToCoordinates(route, {
                edgePadding: {
                    right: width / 4,
                    bottom: height / 4 + 200,
                    left: width / 4,
                    top: height / 4,
                }
            });
        }, 100)
        this.setState({ lst_polyline: route, lineString: line_string })

    }
    setPolygon = async (lstCoord, diem_don, diem_den) => {

        const { getRoute, getRouteDone } = this.props;
        getRoute();
        this.setRoute(lstCoord);
        let reqGetRoute = await getRouteBetween2Point(lstCoord);
        let distance = reqGetRoute.response.route[0].summary.distance;
        let routeAPi = convertRouteDataForAPI(reqGetRoute)

        getRouteDone(distance);
        this.setState({ diem_don: diem_don, diem_den: diem_den, routeAPI: routeAPi })
    }
    focusOnCurrentLoc = () => {
        const {
            latitude,
            longitude,
            lst_polyline
        } = this.state;
        if (lst_polyline.length) {
            this.map.fitToCoordinates(lst_polyline, {
                edgePadding: {
                    right: width / 4,
                    bottom: height / 4 + 300,
                    left: width / 4,
                    top: height / 4,
                }
            });
        } else {
            const r = {
                latitude,
                longitude,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
            };
            this.map.animateToRegion(r, 500);
        }

    };
    onNavigationBack = () => {
        const { currentBooking, updateCurrentBooking } = this.props;
        if (currentBooking && (currentBooking.status === constant_type_status_booking.USER_CANCEL || currentBooking.status === constant_type_status_booking.END)) {
            updateCurrentBooking(null);
        }
        Navigation.pop(this.props.componentId)
    }
    onCancelPick = () => {
        const {
            latitude,
            longitude,
        } = this.state;
        const r = {
            latitude,
            longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
        };
        this.map.animateToRegion(r, 500);
        this.setState({ lst_polyline: [], diem_don: null, diem_den: null })
    }
    getCoordFrom = () => {
        const { currentBooking } = this.props;
        const { lst_polyline, diem_don, diem_den, latitude, longitude } = this.state;
        if (!currentBooking) {
            return !diem_don ? { latitude, longitude } : { latitude: diem_don.displayPosition.latitude, longitude: diem_don.displayPosition.longitude }
        } else {
            return { latitude: currentBooking.from.loc.coordinates[1], longitude: currentBooking.from.loc.coordinates[0] }
        }
    }
    getCoordTo = () => {
        const { currentBooking } = this.props;
        console.log("currentBooking", currentBooking)
        const { lst_polyline, diem_don, diem_den, latitude, longitude } = this.state;
        if (!currentBooking) {
            if (diem_den) {
                return { latitude: diem_den.displayPosition.latitude, longitude: diem_den.displayPosition.longitude }
            }
        } else {
            return { latitude: currentBooking.to.loc.coordinates[1], longitude: currentBooking.to.loc.coordinates[0] }
        }
    }

    render() {
        const {
            latitude,
            longitude,
            coordinate,
            isPickWithGGMap,
            renderStep,
            latitudeDelta,
            longitudeDelta,
            IsIncreaseFromStart,
            isInCreaseHeight,
            lst_polyline,
            diem_don,
            diem_den
        } = this.state;
        const { currentBooking } = this.props;

        const TransitionScreenOptions = {
            ...TransitionPresets.SlideFromRightIOS,
            headerShown: false,
        };
        const Theme = {
            ...DefaultTheme,
            colors: {
                ...DefaultTheme.colors,
                border: 20,
                background: '#FFFFFF',
            },
        };



        return (
            <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: '#FFFFFF' }}>
                <View style={[StyleSheet.absoluteFillObject, {}]}>
                    <MapView
                        provider={PROVIDER_GOOGLE}
                        style={{
                            ...StyleSheet.absoluteFillObject,
                        }}
                        ref={c => {
                            this.map = c;
                        }}
                        initialRegion={{
                            latitude: latitude,
                            longitude,
                            latitudeDelta,
                            longitudeDelta,
                        }}
                        onRegionChange={() => {
                            if (isPickWithGGMap) {
                                this.LocationAnimate.MoveUp();
                                this.SelectDesOrigin.setLoadingPickWithGG(true);
                            }
                        }}
                        onRegionChangeComplete={this.onRegionChange}
                        showsUserLocation={true}
                        showsMyLocationButton={false}
                        onLongPress={data => {
                            console.log('onlongpress', data.nativeEvent.coordinate)
                            if (lst_polyline.length > 0 && diem_den && !isPickWithGGMap) {
                                let lat_origin = diem_don ? diem_don.displayPosition.latitude : latitude
                                let lng_origin = diem_don ? diem_don.displayPosition.longitude : longitude
                                let lstPoint = [
                                    { lat: lat_origin, lng: lng_origin },
                                    { lat: data.nativeEvent.coordinate.latitude, lng: data.nativeEvent.coordinate.longitude },
                                    { lat: diem_den.displayPosition.latitude, lng: diem_den.displayPosition.longitude },
                                ]
                                this.setPolygon(lstPoint, diem_don, diem_den)
                            }
                        }}

                    >
                        {lst_polyline.length > 0 && <Polyline
                            coordinates={lst_polyline}
                            strokeColor={color.ORANGE_COLOR_400} // fallback for when `strokeColors` is not supported by the map-provider
                            strokeWidth={5}
                        />}
                        {lst_polyline.length > 0 && <Marker
                            pinColor={color.GREEN_COLOR_400}
                            title="Vị trí của bạn"
                            coordinate={this.getCoordFrom()}
                        />}
                        {lst_polyline.length > 0 && <Marker
                            title="Điểm dừng"
                            coordinate={this.getCoordTo()}
                        />}
                        {currentBooking && currentBooking.suggestion_pick && <Marker
                            ref={e => this.suggestion = e}
                            identifier="marker_suggest"
                            description={currentBooking.suggestion_pick.address}
                            title="Gợi ý điểm đón"
                            coordinate={{
                                latitude: currentBooking.suggestion_pick.lat,
                                longitude: currentBooking.suggestion_pick.lng,
                            }}
                        >
                            <Image
                                source={require('./res/ic_boarding.png')}
                                style={{ width: scale(32), height: scale(32), }}
                                resizeMode="contain"
                            />
                        </Marker>}
                    </MapView>



                    {isPickWithGGMap && (
                        <View style={{
                            left: '50%',
                            marginLeft: scale(-19.5),
                            marginTop: Platform.OS == 'android' ? scale(-44) : scale(-38),
                            position: 'absolute',
                            top: '50%'
                        }}>
                            <LocationAnimate ref={e => this.LocationAnimate = e} />
                        </View>
                    )}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: scale(40) }}>
                        <TouchableOpacity
                            style={{
                                marginLeft: 10,
                                height: scale(36),
                                width: scale(36),
                                borderRadius: scale(18),
                                backgroundColor: 'white',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                            onPress={this.onNavigationBack}
                        >
                            <Icon
                                name='arrow-back'
                                size={scale(18)}
                                color="black"
                                containerStyle={{

                                }}
                            />
                        </TouchableOpacity>
                        <Tooltip
                            isVisible={this.state.show_help}
                            content={<View style={{ width: width - scale(50), paddingHorizontal: scale(10) }}>
                                <Text style={{ fontSize: scale(18), fontWeight: 'bold', color: color.RED_300 }}>Xe tiện chuyến</Text>
                                <Text style={{ fontSize: scale(14), fontWeight: "500", color: color.GRAY_COLOR_400, paddingTop: scale(10) }}>
                                    Chúng tôi sẽ tìm những chuyến xe có lộ trình đi qua gần chỗ của bạn. Tài xế sẽ đón bọn tại nơi bạn yêu cầu
                                </Text>
                                <TouchableOpacity onPress={() => this.setState({ show_help: false })} style={{ backgroundColor: color.ORANGE_COLOR_400, width: scale(200), height: scale(35), borderRadius: scale(15), alignSelf: 'center', alignItems: "center", justifyContent: "center", marginTop: scale(20), marginBottom: scale(10) }}>
                                    <Text style={{ color: '#FFFFFF', fontWeight: "600", fontSize: scale(17) }}>Đã hiểu</Text>
                                </TouchableOpacity>
                            </View>}
                            placement="bottom"
                            closeOnChildInteraction={false}
                            onClose={() => this.setState({ show_help: false })}
                        >
                            <TouchableOpacity
                                style={{
                                    marginRight: 10,
                                    height: scale(36),
                                    width: scale(36),
                                    borderRadius: scale(18),
                                    backgroundColor: 'white',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            // onPress={this.onNavigationBack}
                            >
                                <MaterialCommunityIcons
                                    onPress={() => this.setState({ show_help: !this.state.show_help })}
                                    name='help'
                                    size={scale(20)}
                                    color={color.ORANGE_COLOR_400}
                                    containerStyle={{

                                    }}
                                />
                            </TouchableOpacity>

                        </Tooltip>
                    </View>
                    <View style={{ position: 'absolute', right: 10, bottom: scale(height / 3) + 20, justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableOpacity
                            style={{
                                marginLeft: 10,
                                height: scale(36),
                                width: scale(36),
                                borderRadius: scale(18),
                                backgroundColor: 'white',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                            onPress={this.focusOnCurrentLoc}
                        >
                            <Icon
                                name='near-me'
                                size={scale(18)}
                                color="black"
                                containerStyle={{

                                }}
                            />
                        </TouchableOpacity>
                    </View>


                </View>
                {isInCreaseHeight && <TouchableOpacity activeOpacity={1} onPress={() => this.BottomView.DecreaseHeightBtmView()} style={{ width: width, height: height, position: 'absolute', backgroundColor: 'rgba(52, 52, 52, 0.3)' }}></TouchableOpacity>}
                <View style={{}}>
                    {!currentBooking && <BottomTab
                        ref={e => {
                            this.BottomView = e;
                        }}
                        IsIncreaseFromStart={false}
                        BottomViewHeight={(height / 3)}
                        heightIncreased={height * 6 / 7}
                        allowIncrease={!isPickWithGGMap}
                        onDecrease={() => { this.setState({ isInCreaseHeight: false }) }}
                        onIncrease={() => { this.setState({ isInCreaseHeight: true }) }}
                        EnablePull={this.state.EnablePull}
                    >
                        <View style={{ width: scale(40), height: scale(4), borderRadius: scale(3), backgroundColor: color.GRAY_COLOR_200, alignSelf: 'center', marginTop: scale(5) }} />
                        <View style={{ flex: 1, marginTop: scale(10) }}>
                            <NavigationContainer theme={Theme}>
                                <Stack.Navigator screenOptions={TransitionScreenOptions}>

                                    <Stack.Screen
                                        name="SelectDesOrigin">
                                        {props => <SelectDesOrigin
                                            from={this.props.from}
                                            to={this.props.to}
                                            setRef={(ref) => this.SelectDesOrigin = ref}
                                            coord={{ lat: this.state.latitude, lng: this.state.longitude }}
                                            inCreaseHeight={() => this.BottomView.IncreaseHeightBtmView()}
                                            inDecreaseHeiht={() => this.BottomView.DecreaseHeightBtmView()}
                                            AnimateHeightTovalue={vl => this.BottomView.AnimateHeightToValue(vl)}
                                            isInCreaseHeight={isInCreaseHeight}
                                            isPickWithGG={isPickWithGGMap}
                                            setPickWithGG={vl => {
                                                this.focusOnCurrentLoc()
                                                if (vl !== isPickWithGGMap) {
                                                    this.setState({ isPickWithGGMap: vl })
                                                }
                                            }}
                                            getCurrentPlace={() => this.getCurrentPlace()}
                                            setPolygon={(lstCoord, diem_don, diem_den) => this.setPolygon(lstCoord, diem_don, diem_den)}
                                            {...props} />}
                                    </Stack.Screen>
                                    <Stack.Screen
                                        name="AdditionalInfo">
                                        {props => <AdditionalInfo
                                            onBack={this.onCancelPick}
                                            line_string={this.state.lineString}
                                            coupon={this.props.coupon}
                                            index_coupon={this.props.index_coupon}
                                            disablePull={() => this.setState({ EnablePull: false })}
                                            enablePull={() => this.setState({ EnablePull: true })}
                                            AnimateHeightTovalue={vl => this.BottomView.AnimateHeightToValue(vl)}
                                            ref={e => this.AdditionalInfo = e}
                                            coord={{ lat: this.state.latitude, lng: this.state.longitude }}
                                            {...props} />}
                                    </Stack.Screen>
                                    <Stack.Screen
                                        name="WaitingDriverScreen">
                                        {props => <WaitingDriverScreen
                                            onNavigationBack={this.onNavigationBack}

                                            {...props} />}
                                    </Stack.Screen>
                                </Stack.Navigator>
                            </NavigationContainer>
                        </View>
                    </BottomTab>}
                    {currentBooking && currentBooking.status === constant_type_status_booking.FINDING_DRIVER && <BottomTab
                        ref={e => {
                            this.BottomView = e;
                        }}
                        IsIncreaseFromStart={true}
                        BottomViewHeight={scale(200)}
                        heightIncreased={height * 6 / 7}
                        allowIncrease={!isPickWithGGMap}
                        onDecrease={() => { this.setState({ isInCreaseHeight: false }) }}
                        onIncrease={() => { this.setState({ isInCreaseHeight: true }) }}
                        EnablePull={true}
                    >
                        <View style={{ width: scale(40), height: scale(4), borderRadius: scale(3), backgroundColor: color.GRAY_COLOR_200, alignSelf: 'center', marginTop: scale(5) }} />

                        <View style={{ flex: 1, marginTop: scale(10) }}>
                            <WaitingDriverScreen
                                reloadData={() => {
                                    if (currentBooking) {
                                        this.props.getCurrentBooking(currentBooking._id);
                                    }
                                }}
                                isInCreaseHeight={isInCreaseHeight}
                                onNavigationBack={this.onNavigationBack}
                            />

                        </View>
                    </BottomTab>}
                    {currentBooking && currentBooking.status === constant_type_status_booking.USER_CANCEL && <BottomTab
                        ref={e => {
                            this.BottomView = e;
                        }}
                        IsIncreaseFromStart={true}
                        BottomViewHeight={scale(200)}
                        heightIncreased={height * 5 / 6}
                        allowIncrease={!isPickWithGGMap}
                        onDecrease={() => { this.setState({ isInCreaseHeight: false }) }}
                        onIncrease={() => { this.setState({ isInCreaseHeight: true }) }}
                        EnablePull={true}
                    >
                        <View style={{ width: scale(40), height: scale(4), borderRadius: scale(3), backgroundColor: color.GRAY_COLOR_200, alignSelf: 'center', marginTop: scale(5) }} />

                        <View style={{ flex: 1, marginTop: scale(10) }}>
                            <UserCancelBooking
                                isInCreaseHeight={isInCreaseHeight}
                                onNavigationBack={this.onNavigationBack}
                            />

                        </View>
                    </BottomTab>}
                    {currentBooking && currentBooking.status === constant_type_status_booking.PROCESSING && <BottomTab
                        ref={e => {
                            this.BottomView = e;
                        }}
                        IsIncreaseFromStart={true}
                        BottomViewHeight={scale(200)}
                        heightIncreased={height * 6 / 7}
                        allowIncrease={!isPickWithGGMap}
                        onDecrease={() => { this.setState({ isInCreaseHeight: false }) }}
                        onIncrease={() => { this.setState({ isInCreaseHeight: true }) }}
                        EnablePull={true}
                    >
                        <View style={{ width: scale(40), height: scale(4), borderRadius: scale(3), backgroundColor: color.GRAY_COLOR_200, alignSelf: 'center', marginTop: scale(5) }} />

                        <View style={{ flex: 1, marginTop: scale(10) }}>
                            <BookingProcessing
                                isInCreaseHeight={isInCreaseHeight}
                                onNavigationBack={this.onNavigationBack}
                                inDecreaseHeiht={() => this.BottomView.DecreaseHeightBtmView()}

                            />

                        </View>
                    </BottomTab>}
                    {currentBooking && currentBooking.status === constant_type_status_booking.END && <BottomTab
                        ref={e => {
                            this.BottomView = e;
                        }}
                        IsIncreaseFromStart={true}
                        BottomViewHeight={scale(200)}
                        heightIncreased={height * 6 / 7}
                        allowIncrease={!isPickWithGGMap}
                        onDecrease={() => { this.setState({ isInCreaseHeight: false }) }}
                        onIncrease={() => { this.setState({ isInCreaseHeight: true }) }}
                        EnablePull={true}
                    >
                        <View style={{ width: scale(40), height: scale(4), borderRadius: scale(3), backgroundColor: color.GRAY_COLOR_200, alignSelf: 'center', marginTop: scale(5) }} />

                        <View style={{ flex: 1, marginTop: scale(10) }}>
                            <BookingFinish
                                isInCreaseHeight={isInCreaseHeight}
                                onNavigationBack={this.onNavigationBack}
                                inDecreaseHeiht={() => this.BottomView.DecreaseHeightBtmView()}

                            />

                        </View>
                    </BottomTab>}
                    {currentBooking && currentBooking.status === constant_type_status_booking.WAITING_DRIVER && <BottomTab
                        ref={e => {
                            this.BottomView = e;
                        }}
                        IsIncreaseFromStart={true}
                        BottomViewHeight={scale(200)}
                        heightIncreased={height * 6 / 7}
                        allowIncrease={!isPickWithGGMap}
                        onDecrease={() => { this.setState({ isInCreaseHeight: false }) }}
                        onIncrease={() => { this.setState({ isInCreaseHeight: true }) }}
                        EnablePull={true}
                    >
                        <View style={{ width: scale(40), height: scale(4), borderRadius: scale(3), backgroundColor: color.GRAY_COLOR_200, alignSelf: 'center', marginTop: scale(5) }} />

                        <View style={{ flex: 1, marginTop: scale(10) }}>
                            <WaitingPickup
                                isInCreaseHeight={isInCreaseHeight}
                                onNavigationBack={this.onNavigationBack}
                                inDecreaseHeiht={() => this.BottomView.DecreaseHeightBtmView()}

                            />

                        </View>
                    </BottomTab>}

                </View>
                <Toast ref={(ref) => Toast.setRef(ref)} />
            </View >
        );
    }
}



const mapStateToProps = (state) => {
    return {
        currentBooking: state.HomeReducer.currentBooking

    }
}



function mapDispatchToProps(dispatch) {
    return {
        getRoute: () => {
            dispatch(actions.action.getRoute());
        },
        getRouteDone: (data) => {
            dispatch(actions.action.getRouteDone(data));
        },
        getCurrentBooking: (_id) => {
            dispatch(actionsHome.action.getCurrentBooking(_id));
        },
        updateCurrentBooking: (dt) => {
            dispatch(actionsHome.action.updateCurrentBooking(dt));
        },


        dispatch,
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(CreateTripScreen);
