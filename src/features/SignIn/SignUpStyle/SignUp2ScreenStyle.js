import {StyleSheet} from 'react-native';

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
    marginTop: '20%',
    alignItems: 'center',
  },
  imageLogo: {
    marginLeft: 'auto',
    marginRight: 'auto',
    width: 220,
    height: 130,
  },
  textHeader: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
    backgroundColor: 'transparent',
    fontSize: 28,
    fontStyle:"normal"
  },
  textHeader2: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
    backgroundColor: 'transparent',
    fontSize: 15,
    marginTop: 20,
    fontStyle:"normal"
  },
  phoneInput:{
    borderBottomColor:'rgba(255, 255, 255, 0.54)',
    top:5,
    marginLeft:"auto",
    marginRight:"auto"
  },
  buttonSubmit:{
    elevation: 8,
    marginTop: 40,
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
    fontWeight: 'bold',
  }
});
