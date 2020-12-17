import React, { Component } from "react";
import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from "react-native-responsive-dimensions";

export default class DefaultStoreCard extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      adID:this.props.adID
    }
  }
  
  styles = StyleSheet.create({
    menuBox: {
      flex: 1,
      width: responsiveWidth(65),
      height: responsiveHeight(26),
      borderRadius: responsiveHeight(3),
      marginHorizontal: responsiveWidth(2),
      paddingVertical: responsiveHeight(.5),
      paddingHorizontal: responsiveWidth(10),
      backgroundColor: 'white',
      alignItems: 'center',
      justifyContent: 'center',
      shadowOffset: {
        height: 20,
        width: -20
      },
      elevation: 5,
    },
    info: {
      fontSize: responsiveFontSize(2.3),
      alignItems: 'center',
      justifyContent: 'center',
    },
    thumbnail: {
      flex: 1,
      borderTopRightRadius:responsiveHeight(3),
      borderTopLeftRadius:responsiveHeight(3),
      width: responsiveWidth(63),
      resizeMode: 'cover',
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconCat: {
      height:responsiveHeight(6),
      width:responsiveWidth(12),
      borderRadius:responsiveHeight(2),
      paddingVertical:responsiveHeight(1),
      alignItems: 'center',
      justifyContent: 'center',
    },
  })

  render() {
    return (
      <View style={this.styles.menuBox}>
        <TouchableOpacity>
        <View style={{ flex: 7}}>
          <Image style={this.styles.thumbnail} source={this.props.cover} />
        </View>
        <View style={{ flex: 3, flexDirection: 'row', alignItems: 'center',justifyContent: 'center' }}>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center',backgroundColor:'white',paddingHorizontal:responsiveWidth(.1), paddingVertical:responsiveHeight(.1), borderRadius: responsiveHeight(2) }}>
            <Image style={this.styles.iconCat} source={this.props.logo} />
          </View>
          <View style={{ flex: 3, alignItems: 'center', justifyContent: 'center' }}>
            <Text numberOfLines={1} ellipsizeMode={'tail'} style={this.styles.info}>{this.props.name} </Text>
          </View>
        </View>
        </TouchableOpacity>
      </View>
    )
  }
}