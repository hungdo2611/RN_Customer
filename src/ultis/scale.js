import DeviceInfo from 'react-native-device-info';
import { Dimensions, Platform } from 'react-native'
const { height, width } = Dimensions.get('window');

//iphone 8
const baseWidth = 375;
const baseHeight = 836;
export const scale = size => {
  if (Platform.OS === 'android') {
    return size
  }
  if (width > height * 0.8) {
    return wScale(size);
  }
  return ((width / baseWidth) * size) >> 0;
};

export const scaleHeight = size => {
  return height / baseHeight * size;
}
export const wScale = size => {
  if (Platform.OS === 'android') {
    return size
  }
  return ((height / baseHeight) * size * 1.1) >> 0;
}