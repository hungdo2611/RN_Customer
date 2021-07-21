import React, { useState, useEffect, PureComponent } from 'react'
import {
    View,
    Text,
    Dimensions,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard,
    SafeAreaView,
    TouchableOpacity
} from 'react-native'

import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialIcons';



import _ from 'lodash';
import { scale } from '../../ultis/scale';

const { width, height } = Dimensions.get('window')

class HomeScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }
    async componentDidMount() {
    }

    render() {
        const { enableButton, isvalidate, isloading, password, security, err_wrongpass } = this.state;
        const { phone } = this.props;
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <SafeAreaView style={{ flex: 1 }}>
                    <KeyboardAvoidingView
                        style={{
                            flex: 1,
                            justifyContent: "space-between",
                            backgroundColor: "red"
                        }}
                        behavior={Platform.OS == 'ios' ? 'padding' : ''}>
                        <View style={{ flex: 1 }}>
                            <TouchableOpacity style={{
                                position: 'absolute',
                                width: scale(36),
                                height: scale(36),
                                borderRadius: scale(18),
                                backgroundColor: "#FFFFFF",
                                alignItems: "center",
                                justifyContent: "center",
                                top: scale(15),
                                left: scale(15)
                            }}>
                                <Icon
                                    onPress={this.onClearText}
                                    name="menu"
                                    size={scale(22)}
                                    style={{ marginHorizontal: scale(10) }}
                                />
                            </TouchableOpacity>
                        </View>
                    </KeyboardAvoidingView>
                </SafeAreaView>
            </TouchableWithoutFeedback >
        )
    }
}



const mapStateToProps = (state) => {
    return {

    }
}

const mapDispatchToProps = (dispatch) => {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen)

