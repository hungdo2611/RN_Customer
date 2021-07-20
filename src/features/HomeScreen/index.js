import React, { useState, useEffect, PureComponent } from 'react'
import {
    View,
    Text,
    Dimensions,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard,
    SafeAreaView,

} from 'react-native'

import { connect } from 'react-redux'



import _ from 'lodash';

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
                        }}
                        behavior={Platform.OS == 'ios' ? 'padding' : ''}>
                        <View style={{ flex: 1 }}>
                          
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

