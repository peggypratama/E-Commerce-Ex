import React, { Component } from 'react';
import { View, Text, TouchableOpacity,Button, Alert, BackHandler } from 'react-native';

import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Foundation from 'react-native-vector-icons/Foundation'
import Octicons from 'react-native-vector-icons/Octicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import { GoogleSignin } from '@react-native-community/google-signin';
import MainHeader from '../../CommonModules/MainHeader/mainHeader'
import PostButton from '../../CommonModules/PostButton/postButton'

import Option from '../../CommonModules/Option/option'
import ProfileCard from '../../CommonModules/ProfileCard/profileCard'
import { getCurrentUserObj, getUserFirestoreObj } from '../../Utility/utility'
import * as firebase from 'firebase'

export default class Account extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '', profilePicture: '', account: null
    }
    this.initialState=this.state
    console.disableYellowBox = true;
  }

  componentWillMount = async () => {
    await getCurrentUserObj().then(async userObj => {
      await this.setState({ name: userObj.displayName, profilePicture: userObj.photoURL })
    }).catch(error => console.log(error.message))
    await getUserFirestoreObj().then(user => {
      this.setState({ account: user[1].account })
    })
  }

  emailPasswordLogin = async () => {
    
        var user = firebase.auth().currentUser;
        if (user) {
          await firebase.firestore().collection('Users').where('userID', '==', user.uid).get().then(snapshots => {
            if (snapshots.empty)
              console.log('empty')
            snapshots.docs.forEach(doc => {
              let obj = doc.data()
              console.log(obj.type)
              if (obj.type == 'Marketeer'){
                this.props.navigation.navigate('Outlet')
              }
              else {
                Alert.alert(' Not Marketeer')
              }
            })
          }).catch(err => { throw err })
        }
        else {
          firebase.auth().signOut()
          this.props.navigation.navigate('EmailVerification')
        }
 
    }


  componentDidMount = async () => {
    GoogleSignin.configure({
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
      webClientId: '1046312836049-mb616nc7ktkuj9ghb34f1fbqslvinmi0.apps.googleusercontent.com',
      offlineAccess: true
    });
  }

  signoutUser = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      console.log('Google logout')
      this.props.navigation.navigate('Login');
    } catch (error) {
      await firebase.auth().signOut().then(() => {
        console.log('LogOut')
        BackHandler.exitApp();
      }).catch(error => console.log(error.message))
    }
  }

  setUserInfo = async (pic, name) => {
    await this.setState({name:name, profilePicture:pic})
  }

  render() {
    return (
      <View style={{ flex: 1, }}>

        <MainHeader flexSize={1.1} />
        <ProfileCard imageUrl={this.state.profilePicture} name={this.state.name} action={() => this.props.navigation.navigate('EditProfile', { 'account': this.state.account, 'updateParent':this.setUserInfo })} />
        <Option flexSize={1} name={'Settings'} action={() => this.props.navigation.navigate('Setings')} icon={<Ionicons style={{ marginLeft: responsiveWidth(-0.5) }} name={'md-settings'} color={'black'} size={responsiveHeight(5)} />} />
        <Option flexSize={1} name={'Orders'} action={() => this.props.navigation.navigate('Orders')} icon={<FontAwesome style={{ marginLeft: responsiveWidth(-0.5) }} name={'list-alt'} color={'black'} size={responsiveHeight(4)} />} />
        <Option flexSize={1} name={'My Ads'} action={() => this.props.navigation.navigate('MyAds')} icon={<FontAwesome style={{ marginLeft: responsiveWidth(-0.5) }} name={'list-alt'} color={'black'} size={responsiveHeight(4)} />} />
        <Option flexSize={1} name={'Logout'} action={this.signoutUser} icon={<AntDesign style={{ marginLeft: responsiveWidth(-0.2) }} name={'logout'} color={'black'} size={responsiveHeight(4)} />} />

         

          <View style={{ flex: 2.5 }}>
        </View>
      </View>
    );
  }
}