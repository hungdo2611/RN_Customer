import { StyleSheet } from 'react-native'

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
    
    alignItems: 'center',
  },
  imageLogo: {
    marginTop: '30%',
    marginLeft: 'auto',
    marginRight: 'auto',
    width: 200,
    height: 200,
  },
  imageLogoWrong: {
    marginTop: '15%',
    marginLeft: 'auto',
    marginRight: 'auto',
    width: 180,
    height: 180,
  },
  textHeader: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
    backgroundColor: 'transparent',
    fontSize: 28,
  },
  textHeader2: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
    backgroundColor: 'transparent',
    fontSize: 15,
    marginTop: 20,
  },
  phoneInput:{
    borderBottomColor:'rgba(255, 255, 255, 0.54)',
    borderBottomWidth:1,
    top:5,
    marginLeft:"auto",
    marginRight:"auto"
  },
  buttonSubmit:{
    elevation: 8,
    marginTop:200,
    marginLeft:"10%",
    marginRight:"10%",
    backgroundColor: "white",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 12,
    width:"80%",
    
  },
  textButton:{
    fontSize: 18,
    color: "#64AFFF",
    alignSelf: "center",
    textTransform: "uppercase",
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    marginHorizontal: 20,
    borderBottomColor:'rgba(255, 255, 255, 0.54)',
    borderBottomWidth:1,
    color: '#ffffff',
  },
  inputWrapper: {
    width:"90%",
    flex: 1,
    marginTop:40
  },
});

