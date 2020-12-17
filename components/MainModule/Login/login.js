import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';

import { GoogleSignin } from '@react-native-community/google-signin';
import { responsiveFontSize, responsiveWidth, responsiveHeight } from 'react-native-responsive-dimensions';
import { login, getCurrentUid, getUserFirestoreObj } from '../../Utility/utility';

import LinearGradient from 'react-native-linear-gradient'
import DialogBox from '../../CommonModules/DialogBox/dialogBox'
import DefaultTextInput from '../../CommonModules/DefaultTextInput/defaultTextInput'
import * as firebase from 'firebase'
import 'firebase/firestore'
import { NativeViewGestureHandler } from 'react-native-gesture-handler';

export default class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '', password: '',

      errem: false, errpass: false,

      formEmptyDialog: false, formErrorDialog: false, googleLoginDialog: false,
      loginDialog: false, loginMessage: '', btnIndicator: false, btnDisabled: false,
      googleLogin: false, loading: false
    }
    this.initialState = this.state
    this.isFormEmpty = this.isFormEmpty.bind(this)
    this.isErrorFree = this.isErrorFree.bind(this)
    this.googleLogin = this.googleLogin.bind(this)
    console.disableYellowBox = true;
  }

  componentDidMount = () => {
    GoogleSignin.configure({
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
      webClientId: '563591331358-js5n0vsdrat8m07jud93k1i1dtsrgf2i.apps.googleusercontent.com',
      offlineAccess: true
    });
  }

  async googleLogin() {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const userInfo = await GoogleSignin.signIn();
      const credential = firebase.auth.GoogleAuthProvider.credential(userInfo.idToken, userInfo.accessToken)
      const firebaseUserCredential = await firebase.auth().signInWithCredential(credential);
      if (!firebaseUserCredential.user) {
        throw new Error('Something went wrong obtaining the users access token');
      }
      this.setState({ googleLogin: true })
    }
    catch (error) {
      console.log(error.message);
      this.setState({ googleLogin: false })
    }
    finally {
      if (this.state.googleLogin) {
        await getCurrentUid().then(async uid => {
          await getUserFirestoreObj().then(async user => {
            if (!user) {
              await firebase.firestore().collection('Users').add({
                'phoneNumber':'',
                'userID': uid,
                'type': 'Super User',
                'account': 'google',
              })
            }
            this.props.navigation.navigate('Main')
          }).catch(error => {
            this.setState({ loginMessage: error.message })
            this.setState({ loginDialog: true })
          })
        })
      }
      else {
        console.log('google login error');
        this.setState({ loginMessage: error.message })
        this.setState({ loginDialog: true })
      }
    }
  }

  googleSignOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      this.setState({ user: null }); // Remember to remove the user from your app's state as well
    } catch (error) {
      console.error(error);
    }
  }

  emailPasswordLogin = async () => {
    if (!this.isFormEmpty() && this.isErrorFree()) {
      this.setState({ btnIndicator: true })
      this.setState({ btnDisabled: true })
      this.setState({ loading: true })
      await login(this.state.email, this.state.password).then(async () => {
        this.setState(this.initialState)
        var user = firebase.auth().currentUser;
        if (user)
          await firebase.firestore().collection('Users').where('userID', '==', user.uid).get().then(snapshots => {  
            if (snapshots.empty)
              console.log('empty')
              snapshots.docs.forEach(doc => {
                let obj = doc.data()
                console.log(obj.type)
                if (obj.type == 'Super User')
                  if (user && user.emailVerified)
                  this.props.navigation.navigate('Dashboard')
                  else {
                  firebase.auth().signOut()
                  this.props.navigation.navigate('EmailVerification')
                  }
                else if (obj.type == 'Marketeer') {
                  console.log()
                  this.props.navigation.navigate('Dashboard')                
              }
              else {
                  this.setState({ loginMessage: "Invalid Email or Password" })
                  this.setState({ loginDialog: true })
              }
            })
          }).catch(err => { throw err })  
      }).catch(error => {
        console.log(error)
        this.setState({ loginMessage: error.message })
        this.setState({ loginDialog: true })
      }).finally(() => {
        this.setState({ btnIndicator: false })
        this.setState({ btnDisabled: false })
      })
    }
  }

  isFormEmpty = () => {
    if (this.state.email != '' && this.state.password != '')
      return false
    this.setState({ formEmptyDialog: true })
    return true
  }

  isErrorFree = () => {
    if (!this.state.errem && !this.state.errpass)
      return true
    this.setState({ formErrorDialog: true })
    return false
  }

  render() {
    let btnDisplay;
    if (this.state.btnIndicator)
      btnDisplay = <ActivityIndicator size={responsiveHeight(4)} color={'white'} />
    else
      btnDisplay = <Text style={styles.btnTxt}>LOGIN</Text>

    return (
      <View style={{ flex: 1 }}>

        <DialogBox resetState={() => this.setState({ formErrorDialog: false })} showDialog={this.state.formErrorDialog} title={'Login Failed'} description={'The form has not been filled correctly'} />
        <DialogBox resetState={() => this.setState({ formEmptyDialog: false })} showDialog={this.state.formEmptyDialog} title={'Login Failed'} description={'Please fill the form in order to continue'} />
        <DialogBox resetState={() => this.setState({ googleLoginDialog: false })} showDialog={this.state.googleLoginDialog} title={'Login Failed'} description={'Please sync your Google account first'} />
        <DialogBox resetState={() => this.setState({ loginDialog: false })} showDialog={this.state.loginDialog} title={'Login Failed'} description={this.state.loginMessage} />

        <View style={{ flex: 1 }}>
          <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1.3, y: 0 }} colors={['#008080', '#4c516d']} style={styles.gradient}>
            <View style={styles.triangleContainer}>
              <View style={styles.triangle}></View>
            </View>
          </LinearGradient>
        </View>

        <View style={{ flex: 1, alignItems: 'center', marginTop: responsiveHeight(-15), position: 'relative', zIndex: 3 }}>
          <Image style={styles.logo} source={require("../../../Images/textlogo.png")}></Image>
        </View>

        <View style={{ flex: 1, alignItems: 'center', marginTop: responsiveHeight(-5) }}>
          <DefaultTextInput marginVertical={responsiveHeight(2)} name={'Email'} value={this.state.email} errorMessage={'Invalid email address format'} setErrorState={(val) => this.setState({ errem: val })} setValueState={(val) => this.setState({ email: val })} regex={/[A-Za-z]+([A-Za-z0-9]|[.]|[_])*[@][A-Za-z]+[.]com$/} width={90} />
          <DefaultTextInput marginVertical={responsiveHeight(1)} name={'Password'} value={this.state.password} errorMessage={'Password must contain atleast 8 characters'} setErrorState={(val) => this.setState({ errpass: val })} setValueState={(val) => this.setState({ password: val })} regex={/^.{8,30}$/} width={90} secureTextEntry={true} />
        </View>

        <View style={{ flex: 0.2, alignItems: 'flex-end', justifyContent: 'flex-end' }}>
          <Text onPress={() => { this.setState(this.initialState); this.props.navigation.navigate('ForgetPassword') }} style={styles.forgetPassword}>Forgot your password?</Text>
        </View>

        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <TouchableOpacity disabled={this.state.btnDisabled} onPress={this.emailPasswordLogin}>
            <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1.3, y: 0 }} colors={['#008080', '#4c516d']} style={styles.btn}>
              {btnDisplay}
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.dontHaveAAccount} onPress={() => { this.setState(this.initialState); this.props.navigation.navigate('Signup') }}>Don't have an account? <Text style={{ color: '#008080' }}>Sign Up</Text></Text>

         
        </View>

      </View>
    )
  }
}

const styles = StyleSheet.create({
  gradient: {
    position: 'relative',
    zIndex: 1,
    flex: 1
  },
  triangleContainer: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    flex: 1,
    position: 'relative',
    zIndex: 2,
    backgroundColor: 'transparent'
  },
  triangle: {
    borderTopWidth: responsiveWidth(0),
    borderRightWidth: responsiveWidth(50),
    borderBottomWidth: responsiveWidth(25),
    borderLeftWidth: responsiveWidth(50),
    borderTopColor: 'transparent',
    borderBottomColor: 'white',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent'
  },
  logo: {
    flex: 1,
    width: responsiveWidth(60),
    height: responsiveHeight(20),
    resizeMode: 'contain'
  },
  icon: {
    height: responsiveHeight(7),
    width: responsiveWidth(7),
    resizeMode: 'contain',
  },
  txt: {
    width: responsiveWidth(85)
  },
  txtLbl: {
    color: '#4c516d',
    fontSize: responsiveFontSize(1.9)
  },
  txtInput: {
    color: '#01233f',
    fontSize: responsiveFontSize(2.5),
    fontWeight: "normal",
    paddingRight: responsiveWidth(7)
  },
  txtContainer: {
    marginVertical: responsiveHeight(1),
    paddingHorizontal: responsiveWidth(20),
    paddingVertical: responsiveHeight(0.1)
  },
  error: {
    marginTop: responsiveHeight(0.5),
    color: 'red'
  },
  btn: {
    width: responsiveWidth(86),
    height: responsiveHeight(6.7),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    paddingHorizontal: responsiveWidth(3),
  },
  btnTxt: {
    color: 'white',
    fontSize: responsiveFontSize(2.3),
    letterSpacing: responsiveWidth(0.4),
  },
  dontHaveAAccount: {
    color: '#4c516d',
    fontSize: responsiveFontSize(1.6),
    marginVertical: responsiveHeight(3)
  },
  forgetPassword: {
    color: '#4c516d',
    fontSize: responsiveFontSize(1.6),
    marginHorizontal: responsiveWidth(8)
  },
  loginBtn: {
    flexDirection: 'row',
    borderWidth: responsiveWidth(0.5),
    borderColor: '#4c516d',
  }
})