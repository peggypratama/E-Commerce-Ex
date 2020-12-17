import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';

import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import InternalHeader from '../../CommonModules/InternalHeader/internalHeader'
import InternalOption from '../../CommonModules/InternalOption/internalOption'

export default class Settings extends Component {
  constructor(props) {
    super(props)
    this.state = {
      account: this.props.navigation.getParam('account')
    }
  }

  render() {
    let changePassword;
    if (this.state.account == 'local')
      changePassword = <InternalOption name={'Change Password'} action={() => this.props.navigation.navigate('ChangePassword')} />
    else
      changePassword = null
    return (
      <View style={{ flex: 1 }}>

        <InternalHeader name={'Settings'} flexSize={1} action={() => this.props.navigation.navigate('Account')} />
        <View style={{ flex: 10 }}>
          <ScrollView>
            <InternalOption name={'Notification Settings'} action={() => this.props.navigation.navigate('NotificationSettings')} />
            {changePassword}
            <InternalOption name={'Clear Cache'} />
            <InternalOption name={'Contact Us'} action={() => this.props.navigation.navigate('ContactUs')} />
          </ScrollView>
        </View>
      </View>
    );
  }
}