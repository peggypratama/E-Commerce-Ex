import React, { Component } from "react";
import { View, StyleSheet } from 'react-native';

import InternalHeader from '../../CommonModules/InternalHeader/internalHeader'
import Navbar from './navbar'

export default class Orders extends Component {
  constructor(props){
    super(props)
  }
  render() {
    return ( 
      <View style={{flex:1}}>
          <InternalHeader name={'Orders'} flexSize={1} action={() => this.props.navigation.navigate('Account')} />
          <View style={{flex:10}}>
              <Navbar />
          </View>
      </View>
    )
  }
}

const styles=StyleSheet.create({
})