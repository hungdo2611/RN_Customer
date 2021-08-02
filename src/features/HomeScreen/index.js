import React, { Component } from 'react';

import { connect } from 'react-redux';
import MapView, { PROVIDER_GOOGLE, AnimatedRegion, Marker } from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
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
import localeLanguage, { updateLocale } from './language';

import SharePlanAction from './redux/Action';
import BottomTab from './components/BottomTab';
import { scale } from '../../ultis/scale';
import { color } from '../../constant/color';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';

import MainView from './MainView'
import SelectDesOrigin from '../SelectDesOrigin'
import { enableScreens } from 'react-native-screens';
import { getAdressFromLatLng } from '../../api/MapApi'
import AdditionalInfo from '../AdditionInfo'
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
            currentService: constantService.NONE
        };
        Navigation.events().bindComponent(this);

        this._layoutProvider = new LayoutProvider(
            () => 'GG',
            (type, dimention) => {
                switch (type) {
                    case 'GG':
                        dimention.width = width;
                        dimention.height = 80;
                        break;
                    default:
                        dimention.width = width;
                        dimention.height = 0;
                }
            },
        );
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
                        localeLanguage().SharePlanScreen.txt_ask_permission_location,
                        localeLanguage().SharePlanScreen.txt_subtitle_permission,
                        [
                            {
                                text: localeLanguage().SharePlanScreen.txt_cancle,

                                onPress: () => console.log('Permission denied'),
                                style: 'cancel',
                            },

                            {
                                text: localeLanguage().SharePlanScreen.txt_setting,
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

    getLayoutProvider = () => this._layoutProvider;

    animate = (latitude, longitude) => {
        const r = {
            latitude,
            longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
        };
        this.map.animateToRegion(r, 500);
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
            isInCreaseHeight
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

        console.log('ggmap', isPickWithGGMap);

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
                        region={{
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
                            console.log('onlongpress', data)
                            if (renderStep === 3) {
                                this.setState({ WayPoint: [data.nativeEvent.coordinate] })
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
                            onPress={this.onPressMenu}
                        >
                            <Icon
                                name='menu'
                                size={scale(18)}
                                color="black"
                                containerStyle={{

                                }}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={{ position: 'absolute', right: 10, bottom: scale(230), justifyContent: 'center', alignItems: 'center' }}>
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
                            onPress={this.onPressMenu}
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

                    >
                        <View style={{ width: scale(40), height: scale(4), borderRadius: scale(3), backgroundColor: color.GRAY_COLOR_200, alignSelf: 'center', marginTop: scale(5) }} />
                        <View style={{ flex: 1, marginTop: scale(10) }}>
                            <NavigationContainer theme={Theme}>
                                <Stack.Navigator screenOptions={TransitionScreenOptions}>
                                    <Stack.Screen name="MainView">
                                        {props => <MainView {...props} inCreaseHeight={() => this.BottomView.IncreaseHeightBtmView()} isInCreaseHeight={isInCreaseHeight} />}
                                    </Stack.Screen>
                                    <Stack.Screen
                                        name="SelectDesOrigin">
                                        {props => <SelectDesOrigin
                                            ref={e => this.SelectDesOrigin = e}
                                            coord={{ lat: this.state.latitude, lng: this.state.longitude }}
                                            inCreaseHeight={() => this.BottomView.IncreaseHeightBtmView()}
                                            inDecreaseHeiht={() => this.BottomView.DecreaseHeightBtmView()}
                                            AnimateHeightTovalue={vl => this.BottomView.AnimateHeightToValue(vl)}
                                            isInCreaseHeight={isInCreaseHeight}
                                            isPickWithGG={isPickWithGGMap}
                                            setPickWithGG={vl => {
                                                if (vl !== isPickWithGGMap) {
                                                    this.setState({ isPickWithGGMap: vl })
                                                }
                                            }}
                                            getCurrentPlace={() => this.getCurrentPlace()}
                                            {...props} />}
                                    </Stack.Screen>
                                    <Stack.Screen
                                        name="AdditionalInfo">
                                        {props => <AdditionalInfo
                                            ref={e => this.AdditionalInfo = e}
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
    console.log('state', state)
    return {
        SearchPlaceResult: state.homeReducer.GGautoCompleteData,
        destination: state.homeReducer.SearchDestination,
        origin: state.homeReducer.SearchOrigin,
        isLoading: state.homeReducer.getIsLoading,
        UserProfile: null,
        Point: 0
    }
}



function mapDispatchToProps(dispatch) {
    return {
        doSearchPlace: (txt, lat, lng) => {
            dispatch(SharePlanAction.actSearchPlace(txt, lat, lng));
        },
        searchWithLatLng: (lat, lng, type) => {
            dispatch(SharePlanAction.actSearchPlaceWithLatlng(lat, lng, type));
        },
        searchLatLngWithPlaceID: (placeid, type) => {
            dispatch(SharePlanAction.actSearchLatLngWithPlaceID(placeid, type));
        },

        dispatch,
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(CreateTripScreen);
