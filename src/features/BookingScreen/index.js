import React, { Component } from 'react';

import { connect } from 'react-redux';
import MapView, { PROVIDER_GOOGLE, AnimatedRegion, Marker, Polyline } from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import { Navigation } from 'react-native-navigation';
import MapViewDirections from 'react-native-maps-directions';
import Placeholder from 'rn-placeholder';
import Permissions from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';
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

import * as Animatable from 'react-native-animatable';
import PropTypes from 'prop-types';
import { RecyclerListView, LayoutProvider, DataProvider } from 'recyclerlistview';

import BottomTab from './components/BottomTab';
import { scale } from '../../ultis/scale';
import { color } from '../../constant/color';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';

import SelectDesOrigin from './SelectDesOrigin'
import { enableScreens } from 'react-native-screens';
import { getAdressFromLatLng, getRouteBetween2Point } from '../../api/MapApi'
import AdditionalInfo from './AdditionInfo'
import actions from './SelectDesOrigin/redux/actions'
import WaitingDriverScreen from './WaitingDriver'
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
    const arr = data.response.route[0].leg[0].maneuver
    let route = arr.map(vl => {
        return { longitude: vl.position.longitude, latitude: vl.position.latitude }

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
            EnablePull: true
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


        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
        AppState.addEventListener('change', this._handleAppStateChange);
        Permissions.check('location').then(response => {
            // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
            console.log('respone check permission', response);
            if (response !== 'authorized') {
                if (response !== 'denied') {
                    Permissions.check('location', { type: 'always' }).then(res => {
                        console.log('respone request permission ', res);
                    });
                } else {
                    Alert.alert(
                        'Ứng dụng cần quyền truy cập vị trí',
                        'Ứng dụng cần quyền vị trí của bạn để có thể kết nối với mọi người',
                        [
                            {
                                text: 'Không',

                                onPress: () => console.log('Permission denied'),
                                style: 'cancel',
                            },

                            {
                                text: 'Cài đặt',
                                onPress: Permissions.openSettings,
                            },
                        ],
                    );
                }
            }
        });
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
            { enableHighAccuracy: Platform.OS !== 'android', timeout: 360000 },
        );
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
        AppState.removeEventListener('change', this._handleAppStateChange);
    }

    _handleAppStateChange = () => {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);

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
            { enableHighAccuracy: Platform.OS !== 'android', timeout: 360000 },
        );
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
            { enableHighAccuracy: Platform.OS !== 'android', timeout: 360000 },
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
    setPolygon = async (lstCoord, diem_don, diem_den) => {

        const { getRoute, getRouteDone } = this.props;
        getRoute();
        let reqGetRoute = await getRouteBetween2Point(lstCoord)
        let distance = reqGetRoute.response.route[0].summary.distance;
        let route = convertRouteDataForShowRoute(reqGetRoute)
        let routeAPi = convertRouteDataForAPI(reqGetRoute)
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

        getRouteDone(distance);
        this.setState({ lst_polyline: route, diem_don: diem_don, diem_den: diem_den, routeAPI: routeAPi })
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
                    bottom: height / 4 + 200,
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
        const { destination, isLoading, origin, CaculatePoint } = this.props;

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
        const MAX_POINTS = 30;
        const fill = (this.state.points / MAX_POINTS) * 100;


        return (
            <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: '#FFFFFF' }}>
                <View style={[StyleSheet.absoluteFillObject, {}]}>
                    <MapView
                        provider={Platform.OS == 'android' ? PROVIDER_GOOGLE : null}
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


                        {/* {renderStep === 3 && (
                            <MapViewDirections
                                origin={{
                                    latitude: origin.geometry.location.lat,
                                    longitude: origin.geometry.location.lng,
                                }}
                                destination={{
                                    latitude: destination.geometry.location.lat,
                                    longitude: destination.geometry.location.lng,
                                }}
                                language="vi"
                                apikey={ApiKey}
                                strokeWidth={5}
                                strokeColor={color.MAIN_COLOR}
                                onError={errorMessage => {
                                    console.log('GOT AN ERROR', errorMessage);
                                }}
                                waypoints={this.state.WayPoint}
                                onReady={result => {
                                    console.log('map ready', result);
                                    this.setState({ distance: result.distance });
                                    // CaculatePoint(result.distance);

                                    this.map.fitToCoordinates(result.coordinates, {
                                        edgePadding: {
                                            right: width / 5,
                                            bottom: height / 5,
                                            left: width / 5,
                                            top: height / 5,
                                        },
                                    });
                                }}
                            />
                        )} */}
                        {lst_polyline.length > 0 && <Polyline
                            coordinates={lst_polyline}
                            strokeColor={color.ORANGE_COLOR_400} // fallback for when `strokeColors` is not supported by the map-provider
                            strokeWidth={5}
                        />}
                        {lst_polyline.length > 0 && <Marker
                            pinColor={color.GREEN_COLOR_400}
                            title="Điểm bắt đầu"
                            coordinate={!diem_don ? { latitude, longitude } : { latitude: diem_don.displayPosition.latitude, longitude: diem_don.displayPosition.longitude }}
                        />}
                        {lst_polyline.length > 0 && diem_den && <Marker
                            title="Điểm dừng"
                            coordinate={{ latitude: diem_den.displayPosition.latitude, longitude: diem_den.displayPosition.longitude }}
                        />}
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
                {isInCreaseHeight && <View style={{ width: width, height: height, position: 'absolute', backgroundColor: 'rgba(52, 52, 52, 0.3)' }}></View>}
                <View style={{}}>
                    <BottomTab
                        ref={e => {
                            this.BottomView = e;
                        }}
                        IsIncreaseFromStart={false}
                        BottomViewHeight={scale(height / 3)}
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
                                            disablePull={() => this.setState({ EnablePull: false })}
                                            enablePull={() => this.setState({ EnablePull: true })}
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
                    </BottomTab>
                </View>
            </View >
        );
    }
}

CreateTripScreen.propTypes = {
    doSearchPlace: PropTypes.func,
    searchWithLatLng: PropTypes.func,
    searchLatLngWithPlaceID: PropTypes.func,
    Point: PropTypes.number,
    CaculatePoint: PropTypes.func,
};

const mapStateToProps = (state) => {
    return {

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
        dispatch,
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(CreateTripScreen);
