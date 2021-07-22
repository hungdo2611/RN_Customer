import React, { PureComponent, Children } from 'react';
import PropTypes from 'prop-types';
import { Dimensions, View, TouchableOpacity, Animated, PanResponder, Keyboard } from 'react-native';

import * as Animatable from 'react-native-animatable';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import { scale } from '../../../../ultis/scale';
const { width, height } = Dimensions.get('window');

class BottomTab extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isInCreaseHeight: false,
    };
  }

  componentWillMount() {
    const { BottomViewHeight } = this.props;
    this.BottomViewHeight = new Animated.Value(BottomViewHeight);

    this._panResponder = PanResponder.create({
      // onStartShouldSetPanResponder: (evt, gestureState) => true,
      // onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      // onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => this._onMoveShouldSetPanResponderCapture(gestureState),
      onPanResponderGrant: this._handlePanResponderGrant,
      onPanResponderMove: this.__handlePanResponderMove,
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: this._handlePanResponderEnd,
      onPanResponderTerminate: this._handlePanResponderEnd,
      onShouldBlockNativeResponder: (evt, gestureState) => true,
    });
  }

  _onMoveShouldSetPanResponderCapture = (gestureState) => {
    const { isInCreaseHeight } = this.state;
    const { heightIncreased } = this.props;
    const heightPull = height - heightIncreased + scale(80);


    return isInCreaseHeight ? gestureState.dy > 0 && gestureState.moveY < heightPull : gestureState.dy < 0
  }

  componentDidMount() {
    const { IsIncreaseFromStart } = this.props;
    if (IsIncreaseFromStart) {
      this.IncreaseHeightBtmView();
    }
  }


  // Check if pulled down
  pulledDown = gestureState => gestureState.dy > 50;

  tapped = gestureState => gestureState.dx === 0 && gestureState.dy === 0;

  pulledUp = gestureState => gestureState.dy < 0;

  _handlePanResponderGrant = (evt, gestureState) => {
    // console.log('gesture start ', gestureState);
  };

  _handlePanResponderEnd = (evt, gestureState) => {
    const { HeightTopDown } = this.props;
    console.log('gesture end ', gestureState);
    if (this.pulledDown(gestureState)) {
      if (HeightTopDown) {
        this.IncreaseHeightBtmView();
      } else {
        this.DecreaseHeightBtmView();
      }



      // console.log('pull down');
    }
    if (this.pulledUp(gestureState)) {
      if (HeightTopDown) {
        this.DecreaseHeightBtmView();
      } else {
        this.IncreaseHeightBtmView();
      }
      // console.log('pull up');
    }
    if (this.tapped(gestureState)) {
      Keyboard.dismiss();

      // console.log('tapped');
    }
  };

  __handlePanResponderMove = (evt, gestureState) => {
    // Update position unless we go outside of allowed range
    // this._animatedPosition.setValue(gestureState.dy);
    // const { allowIncrease, BottomViewHeight, heightIncreased } = this.props;
    // const { isInCreaseHeight } = this.state;
    // Keyboard.dismiss();
    // // console.log('move', gestureState);
    // if (isInCreaseHeight) {
    //   Animated.timing(this.BottomViewHeight, {
    //     toValue: heightIncreased - (gestureState.moveY - gestureState.y0),
    //     duration: 0,
    //     useNativeDriver: false
    //   }).start();
    // } else if (allowIncrease) {
    //   Animated.timing(this.BottomViewHeight, {
    //     // toValue: 200 - (gestureState.moveY - gestureState.y0),
    //     toValue: BottomViewHeight - (gestureState.moveY - gestureState.y0),
    //     duration: 0,
    //     useNativeDriver: false
    //   }).start();
    // }
  };

  DecreaseHeightBtmView = () => {
    const { BottomViewHeight, onDecrease } = this.props;
    Animated.timing(this.BottomViewHeight, {
      //   toValue: 200,
      toValue: BottomViewHeight,
      duration: 500,
      useNativeDriver: false
    }).start();
    this.setState({ isInCreaseHeight: false });
    onDecrease();
    // console.log('decrease');
  };

  IncreaseHeightBtmView = () => {
    const { heightIncreased, allowIncrease, onIncrease } = this.props;
    if (allowIncrease) {
      Animated.timing(this.BottomViewHeight, {
        toValue: heightIncreased,
        // toValue: height - 80,
        duration: 500,
        useNativeDriver: false,
      }).start();
      this.setState({ isInCreaseHeight: true });
      onIncrease();
    }
  };

  render() {
    const { children } = this.props;
    const { isInCreaseHeight } = this.state;
    return (
      <Animatable.View animation="slideInUp" iterationCount={1} {...this._panResponder.panHandlers}>
        <KeyboardAwareScrollView
          style={{ position: 'relative' }}
          onScroll={() => {
            Keyboard.dismiss();
          }}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={{
              height: this.BottomViewHeight,
              backgroundColor: 'white',
              borderTopLeftRadius: scale(20),
              borderTopRightRadius: scale(20)
            }}
          >
            {children}
          </Animated.View>
        </KeyboardAwareScrollView>
      </Animatable.View>
    );
  }
}
BottomTab.propTypes = {
  BottomViewHeight: PropTypes.any,
  heightIncreased: PropTypes.number,
  allowIncrease: PropTypes.bool,
  children: PropTypes.any,
  IsIncreaseFromStart: PropTypes.bool,
};

export default BottomTab;
