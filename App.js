import React, {Component} from 'react';
import {createAppContainer} from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'

import Login from './components/MainModule/Login/login'
import Signup from './components/MainModule/Signup/signup'
import Tags from './components/MainModule/Tags/tags'
import Splashscreen from './components/MainModule/Splashscreen/splashscreen'
import ForgetPassword from './components/MainModule/ForgetPassword/forgetPassword'
import Main from './components/MainModule/MainStack/mainStack'
import EmailVerification from './components/MainModule/EmailVerification/emailVerification'
import MarketeerStack from './components/MainModule/MainStack/marketeerStack'

import * as firebase from 'firebase'

var firebaseConfig = {
  apiKey: "AIzaSyCvB_R-hXjBgxr4FGfEcRcaZ9u8mWO2UeE",
  authDomain: "fixx-25c1c.firebaseapp.com",
  databaseURL: "https://fixx-25c1c.firebaseio.com",
  projectId: "fixx-25c1c",
  storageBucket: "fixx-25c1c.appspot.com",
  messagingSenderId: "1046312836049",
  appId: "1:1046312836049:web:186b34ee0a4cf0cff9def0",
  measurementId: "G-EQBJ33PVS8"
};
if(!firebase.apps.length)
  firebase.initializeApp(firebaseConfig);

const RootStack= createStackNavigator( //Navigation Stack
  {
    Main:Main,
    Login:Login,
    Tags:Tags,
    MarketeerStack: MarketeerStack,
    Splashscreen:Splashscreen,
    EmailVerification:EmailVerification,
    Signup:Signup,
    ForgetPassword:ForgetPassword,
  },
  {
    defaultNavigationOptions:
    {
      header:null
    }
  }
);
const AppNavigator=createAppContainer(RootStack)

export default class App extends Component {
  render(){
    return(
      <AppNavigator/>
    )
  }
}