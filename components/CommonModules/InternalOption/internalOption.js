import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';

import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';

export default class InternalOption extends Component {
  render() {
    return (
      <TouchableOpacity style={[styles.box, { flexDirection: 'row', height: responsiveHeight(7) }]} onPress={this.props.action}>
        <View style={{ marginLeft: responsiveWidth(10), flex: 3, justifyContent: "center" }}>
          <Text style={styles.txt}>{this.props.name}</Text>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
    box: {
      flex: 0.5,
      backgroundColor: 'white',
      borderColor: '#989898',
      borderTopWidth: 1,
    },
    txt: {
      fontSize: responsiveFontSize(2.9)
    }
  });  