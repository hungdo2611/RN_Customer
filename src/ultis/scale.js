import DeviceInfo from 'react-native-device-info';
import { Dimensions, Platform } from 'react-native'
const { height, width } = Dimensions.get('window');

//iphone 8
const baseWidth = 375;
const baseHeight = 836;
export const scale = size => {
  if (Platform.OS == 'android') {
    return size
  }
  let isTablet = DeviceInfo.isTablet()
  if (isTablet) {
    return height / baseHeight * size;
  } else {
    return width / baseWidth * size;
  }
}
export const scaleHeight = size => {
  return height / baseHeight * size;
}