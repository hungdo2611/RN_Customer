import React from 'react';
import { StyleSheet, Text, View, Dimensions, Easing, Animated, TouchableOpacity } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { color } from '../../constant/color';
import { scale } from '../../ultis/scale';
const MAX_POINTS = 30;
export default class LocationAnimate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isMoving: false,
            pointsDelta: 0,
            points: 1,
            isLoading: false

        };
        this.margin = new Animated.Value(0);

    }

    componentDidMount() {
        const TIME_RELOAD = 1300;
        this.intervalId = setInterval(
            () => {
                if (this.circularProgress) {
                    this.circularProgress.reAnimate(0, 100, TIME_RELOAD, Easing.linear)
                }

            },
            TIME_RELOAD
        );
    }


    componentWillUnmount() {
        clearInterval(this.intervalId);
    }
    MoveUp = () => {
        this.setState({ isLoading: true })
        Animated.timing(this.margin, {
            //   toValue: 200,
            toValue: 10,
            duration: 150,
            useNativeDriver: false
        }).start();
    }
    MoveDown = () => {
        this.setState({ isLoading: false })

        Animated.timing(this.margin, {
            //   toValue: 200,
            toValue: 0,
            duration: 150,
            useNativeDriver: false
        }).start();
    }

    render() {
        const { width } = Dimensions.get("window");
        const { isLoading } = this.state;
        return (
            <View style={{ alignItems: 'center' }}>
                <Animated.View style={{ bottom: this.margin, alignItems: 'center' }}>
                    <Icon
                        type="material"
                        name="location-pin"
                        color={color.ORANGE_COLOR_400}
                        size={scale(40)}
                    />
                    {isLoading && <AnimatedCircularProgress
                        size={scale(16)}
                        loading={true}
                        width={2}
                        backgroundWidth={2}
                        fill={0}
                        style={{ position: "absolute", top: scale(8) }}
                        tintColor={color.MAIN_COLOR}
                        backgroundColor="#FFFFFF"
                        ref={(ref) => this.circularProgress = ref}
                        lineCap="round"
                    >
                    </AnimatedCircularProgress>}
                    
                </Animated.View>

                <View style={{

                    width: scale(6),
                    height: scale(6),
                    borderRadius: scale(3),
                    backgroundColor: color.ORANGE_COLOR_400
                }} />

            </View>
        );
    }
}

const styles = StyleSheet.create({
    points: {
        textAlign: 'center',
        color: '#ef9837',
        fontSize: 50,
        fontWeight: '100',
    },
    container: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#0d131d',
        padding: 50,
    },
    pointsDelta: {
        color: '#4c6479',
        fontSize: 50,
        fontWeight: '100',
    },
    pointsDeltaActive: {
        color: '#fff',
    },
});