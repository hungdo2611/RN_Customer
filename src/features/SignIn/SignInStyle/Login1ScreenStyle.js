import { StyleSheet, Dimensions } from 'react-native';
import { scale } from '../../../ultis/scale'
const { width, height } = Dimensions.get("window");
export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  backgroundImage: {
    resizeMode: 'cover',
    flex: 1,
    justifyContent: 'center',
    height: '100%',
  },
  formStyle: {
    marginTop: 0.05 * height,
    alignItems: 'center',
  },
  imageLogo: {
    width: scale(220),
    height: scale(130),
  },
  textHeader: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
    backgroundColor: 'transparent',
    fontSize: width * 0.08,
  },
  textHeader2: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
    backgroundColor: 'transparent',
    fontSize: width * 0.04,
    marginTop: height * 0.01,
  },
  phoneInput: {
    //borderBottomColor:'rgba(255, 255, 255, 0.54)',
    //borderBottomWidth:1,
    //top:5,
    marginLeft: "auto",
    marginRight: "auto"
  },
  buttonSubmit: {
    marginTop: scale(20),
    // elevation: 8,
    //marginRight:"10%",
    backgroundColor: "white",
    borderRadius: scale(17.),
    // paddingVertical: 10,
    // paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    width: '80%',
    height: scale(40)

  },
  viewInput: {
    //marginTop:10,
    //flex:0.5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textButton: {
    fontSize: scale(18),
    color: "#64AFFF",
    alignSelf: "center",
    fontWeight: 'bold',
  },
  input: {
    fontSize: width * 0.04,
    height: height * 0.05,
    marginHorizontal: width * 0.05,
    borderBottomColor: 'white',
    borderBottomWidth: 1,
    color: '#ffffff',
  },
  inputWrapper: {
    width: "90%",
    marginTop: height * 0.05
  },
  inlineImg: {
    width: scale(20),
    height: scale(20),
    resizeMode: 'contain'
  },
  forgotPass: {
    //flex:0.2,
    flexDirection: 'row-reverse',
    marginTop: scale(5)
  },
  textForgotPass: {
    paddingRight: width * 0.1,
    fontSize: width * 0.04,
    color: 'white',
    fontWeight: '600'
  },
  anotherAccount: {
    marginTop: height * 0.03,
    alignItems: 'center'
  },
  textAnotherAccount: {
    fontSize: width * 0.048,
    color: 'white'
  },
  coverButton: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: height * 0.03
  },
  button: {
    flexDirection: 'row',

  },
  icon: {
    width: width * 0.06,

  },
  textInside: {
    marginLeft: height * 0.01,
    color: 'white',
    fontSize: width * 0.045
  },
  buttonSignUp: {

    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: scale(15)

  },
  textSignUp1: {
    fontSize: width * 0.045,
    color: '#64AFFF'
  },
  textSignUp2: {
    fontSize: width * 0.045,
    color: 'white',
    marginLeft: scale(5)
  }
});