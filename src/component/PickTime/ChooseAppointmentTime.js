import React, { Component } from 'react';
import {
  Text,
  View,
  Modal,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native';
import { BlurView } from '@react-native-community/blur';
import moment from 'moment';
import DatePicker from 'react-native-date-picker';
import styles from './Styles';

class ChooseAppointmentTimeModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      valueTime: new Date(),
      type: 'fromTime',
    };
  }

  showModal = (type, currentTimeString) => {
    this.setState({
      showModal: true,
      type: type,
      valueTime: moment(currentTimeString, 'DD/MM/YYYY HH:mm').toDate(),
    });
  };

  render() {
    return (
      <Modal
        animated
        style={{ backgroundColor: 'red' }}
        animationType="slide"
        transparent={true}
        visible={this.state.showModal}>
        <TouchableHighlight
          style={{ flex: 1 }}
          onPress={() => {
            this.setState({ showModal: false });
          }}>
          <BlurView
            blurType="dark"
            blurAmount={10}
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              right: 0,
              left: 0,
            }}
            reducedTransparencyFallbackColor="black"></BlurView>
        </TouchableHighlight>

        <View style={styles.chonNgayModal}>
          <Text style={styles.chonNgayText}>Chọn giờ</Text>
          <DatePicker
            style={{ alignSelf: 'center' }}
            mode="time"
            locale="vi"
            textColor="#000000"
            format="DD/MM/YYYY"
            androidVariant="iosClone"
            date={this.state.valueTime}
            minimumDate={this.state.type === 'fromTime' ? new Date() : moment(this.props.fromTime, 'HH:mm').add(0.5, 'hours').toDate()}
            onDateChange={(value) => {
              this.setState({ valueTime: moment(value).toDate() });
            }}
          />
          <TouchableOpacity
            onPress={() => {
              this.setState({ showModal: false });
              this.props.confirmAction(
                this.state.type,
                moment(this.state.valueTime).format('HH:mm'),
              );
            }}
            style={styles.btnXacNhan}>
            <Text allowFontScaling={false} style={styles.labelXacNhan}>
              XÁC NHẬN
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }
}

export default ChooseAppointmentTimeModal;
