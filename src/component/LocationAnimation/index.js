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
        };
        this.margin = new Animated.Value(0);

    }

    componentDidMount() {
        const TIME_RELOAD = 1500;
        this.circularProgress.animate(100, TIME_RELOAD, Easing.linear);

        this.intervalId = setInterval(
            () => this.circularProgress.reAnimate(0, 100, TIME_RELOAD, Easing.linear),
            TIME_RELOAD
        );
    }

    componentWillUnmount() {
        clearInterval(this.intervalId);
    }

    render() {
        const { width } = Dimensions.get("window");

        return (
            <View style={{ alignItems: 'center' }}>
                <Animated.View style={{ bottom: this.margin, alignItems: 'center' }}>
                    <Icon
                        type="material"
                        name="location-pin"
                        color="red"
                        size={scale(40)}
                    />
                    <AnimatedCircularProgress
                        size={scale(16)}
                        width={2}
                        backgroundWidth={2}
                        fill={0}
                        style={{ position: "absolute", top: scale(8) }}
                        tintColor={color.MAIN_COLOR}
                        backgroundColor="#FFFFFF"
                        ref={(ref) => this.circularProgress = ref}
                        lineCap="round"
                    >
                    </AnimatedCircularProgress>
                </Animated.View>

                <View style={{

                    width: scale(6),
                    height: scale(6),
                    borderRadius: scale(3),
                    backgroundColor: "blue"
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