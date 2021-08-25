import React, { Component } from 'react';
import {
  Text,
  View,
  Modal,
  TouchableOpacity,
  TouchableHighlight
} from 'react-native';
import { BlurView } from '@react-native-community/blur';
import moment from 'moment';
import DatePicker from 'react-native-date-picker';
import styles from './Styles';

class ChooseAppointmentDateModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      valueDate: new Date()
    };
  }

  showModal = (currentDateString) => {
    this.setState({ showModal: true, valueDate: moment(currentDateString, 'DD/MM/YYYY').toDate() });
  }

  render() {
    let start = new Date();
    start.setHours(0, 0, 0, 0);
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
          <Text style={styles.chonNgayText}>Chọn ngày</Text>
          <DatePicker
            style={{ alignSelf: 'center' }}
            mode="date"
            locale="vi"
            textColor="#000000"
            format="DD/MM/YYYY"
            androidVariant="iosClone"
            date={this.state.valueDate}
            minimumDate={start}
            onDateChange={(value) => {
              this.setState({ valueDate: moment(value).toDate() });
            }}
          />
          <TouchableOpacity onPress={() => {
            this.setState({ showModal: false });
            this.props.confirmAction(moment(this.state.valueDate).format('DD/MM/YYYY'));
          }} style={styles.btnXacNhan}>
            <Text allowFontScaling={false} style={styles.labelXacNhan}>
              XÁC NHẬN
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }
}

export default ChooseAppointmentDateModal;
