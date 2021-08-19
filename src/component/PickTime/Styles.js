import { Platform, StyleSheet, Dimensions } from 'react-native';
import { scale } from '../../ultis/scale';
const { width } = Dimensions.get('window');


export const BACKGROUND_BASE_VTMAN = '#EE0033';

const styleCreateAppointment = StyleSheet.create({
  textFooter: {
    color: '#ffffff',
    fontSize: scale(14),
    lineHeight: scale(18),
    textAlign: 'center',
    alignSelf: 'center',
  },
  createButtonView: {
    alignItems: 'center',
    width: width,
    shadowColor: 'gray',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 5,
    backgroundColor: 'white',
  },
  createButton: {
    backgroundColor: BACKGROUND_BASE_VTMAN,
    height: 42,
    width: width - 24,
    marginHorizontal: 12,
    justifyContent: 'center',
    marginTop: 12,
    marginBottom: 25,
    borderRadius: 4,
  },
  titleText: {
    color: '#091E42',
    fontSize: scale(13),
  },
  ngayTiepXucView: {
    flexDirection: 'row',
    borderColor: '#D1D1D1',
    borderWidth: 1,
    marginTop: 12,
    height: 35,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  ngayTiepXucTextInput: {
    flex: 1,
    marginRight: 10,
    fontSize: scale(15),
    justifyContent: 'center',
  },
  itemViewRowContainer: {
    paddingHorizontal: 12,
    paddingTop: 12,
    flexDirection: 'row',
    backgroundColor: 'white',
  },
  itemViewColumnContainer: {
    paddingHorizontal: 12,
    paddingTop: 12,
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  createNew: {
    borderWidth: 1,
    borderStyle: 'dashed',
    height: scale(80),
    width: '100%',
    marginTop: 12,
    borderRadius: 5,
    borderColor: BACKGROUND_BASE_VTMAN,
    justifyContent: 'center',
  },
  customerCodeText: {
    color: BACKGROUND_BASE_VTMAN,
    fontSize: scale(15),
    flex: 1,
  },
  customerTextBold: {
    fontSize: scale(15),
    color: '#091E42',
    paddingHorizontal: 8,
  },
  customerTextRegular: {
    fontSize: scale(15),
    color: '#091E42',
    paddingHorizontal: 8,
  },
  btnXacNhan: {
    width: width - 32,
    height: scale(42),
    backgroundColor: '#F0F9FA',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 12,
    marginBottom: 30
  },
  labelXacNhan: {
    fontSize: scale(14),
    color: BACKGROUND_BASE_VTMAN,
  },
  chonNgayText: {
    paddingTop: 12,
    color: '#091E42',
    fontSize: scale(15),
  },
  chonNgayModal: {
    justifyContent: 'center',
    alignContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  searchCustomerTextInput: {
    padding: 0,
    borderRadius: 20,
    backgroundColor: '#EEEEEF',
    flex: 1,
    marginRight: 12,
    paddingHorizontal: (4),
    paddingVertical: (1),
    fontSize: scale(15),
    justifyContent: 'center'
  },
  customerTypeText: {
    color: '#3B7CEC',
    paddingHorizontal: 8,
    paddingVertical: 8,
    fontSize: scale(13)
  }
});

export default styleCreateAppointment;
