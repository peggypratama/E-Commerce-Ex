import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Switch
} from 'react-native';

import { responsiveHeight, responsiveWidth,responsiveFontSize } from 'react-native-responsive-dimensions';
import InternalHeader from '../../CommonModules/InternalHeader/internalHeader'

class Option extends Component {
  constructor(props) {
    super(props)
    this.state = {
      switchValue: false,
    }
  }

  onValueChange = () => {
    if(this.state.switchValue==true)
      this.setState({switchValue:false})
    else
      this.setState({switchValue:true})
  }

  getValue = () => {return this.state.switchValue}

  render () {
    return (
      <View style={[styles.box,{flexDirection:'row'}]}>
        <View style={{marginLeft:responsiveWidth(10),flex:3,justifyContent:"center"}}>
          <Text style={styles.txt}>{this.props.name}</Text>
        </View>
        <View style={{justifyContent:'center', flex:1, alignItems:'center'}}>
          <Switch onChange={this.onValueChange} value={this.state.switchValue}></Switch>
        </View>
      </View>
    )
  }
}

export default class Chat extends Component {
  render() {
    return (
      <View style={{ flex: 1}}>

        <InternalHeader name={'Notification Settings'} flexSize={0.50} action={() => this.props.navigation.navigate('Settings')} />

        <Option name={'Notification Settings'} />
        <Option name={'Clear Cache'} />
        <Option name={'Contact Us'} />

        <View style={{flex:3.5}} />

      </View>
    );
  }
}

const styles = StyleSheet.create({
  box:{
    flex: 0.5,
    backgroundColor:'white',
    borderColor:'#989898',
    borderTopWidth:1,
  },
  txt:{
    fontSize:responsiveFontSize(2.9)
  }
});  