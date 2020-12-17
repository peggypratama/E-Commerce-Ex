import React, { Component } from 'react';
import { View, YellowBox } from 'react-native';

import AntDesign from 'react-native-vector-icons/AntDesign'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';

import MainHeader from '../../CommonModules/MainHeader/mainHeader'
import Option from '../../CommonModules/Option/option'
import ProfileCard from '../../CommonModules/ProfileCard/profileCard'
import { getCurrentUserObj, getUserFirestoreObj, logout } from '../../Utility/utility'
import * as firebase from 'firebase'

export default class Account extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '', profilePicture: '', account: null
    }
    this.initialState = this.state
    YellowBox.ignoreWarnings(['Setting a timer']);
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

  signoutUser = async () => {
    await logout().catch(err => console.log(err))
    this.props.navigation.navigate('AuthStack')
  }

  setUserInfo = async (pic, name) => {
    await this.setState({ name: name, profilePicture: pic })
  }

  render() {
    return (
      <View style={{ flex: 1 }}>

        <MainHeader flexSize={1.5} />
        <ProfileCard imageUrl={this.state.profilePicture} name={this.state.name} action={() => this.props.navigation.navigate('EditProfile', { 'account': this.state.account, 'updateParent': this.setUserInfo })} />
        <Option flexSize={1} name={'Edit Outlet'} action={() => this.props.navigation.navigate('EditOutlet')} icon={<MaterialCommunityIcons style={{ marginLeft: responsiveWidth(-1.5) }} name={'store'} color={'black'} size={responsiveHeight(5)} />} />
        <Option flexSize={1} name={'Change Password'} action={() => this.props.navigation.navigate('ChangePassword')} icon={<MaterialCommunityIcons style={{ marginLeft: responsiveWidth(-1.5) }} name={'shield-lock-outline'} color={'black'} size={responsiveHeight(5)} />} />
        <Option flexSize={1} name={'Logout'} action={this.signoutUser} icon={<AntDesign style={{ marginLeft: responsiveWidth(-0.2) }} name={'logout'} color={'black'} size={responsiveHeight(4)} />} />

        <View style={{ flex: 6.5 }}></View>
      </View>
    );
  }
}