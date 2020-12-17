import React, { Component } from "react";
import { Text, View, TextInput, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from "react-native-responsive-dimensions";

export default class CategoryRadioButtons extends Component {
  constructor(props) {
    super(props)
    this.state = {
      category: '',
      vehiclesBorderColor: '#dcdcdc',
      housesBorderColor: '#dcdcdc',
      electronicBorderColor: '#dcdcdc',
      hardwareBorderColor: '#dcdcdc',
    }
    this.updateParent = this.props.updateParent
  }

  componentDidUpdate(prevProps) {
    if (this.props.value != prevProps.value) {
      if (this.props.value == '')
        this.resetOptions()
    }
  }

  styles = StyleSheet.create({
    categoriesHeading: {
      color: '#008080',
      fontWeight: 'bold',
      fontSize: responsiveFontSize(2.5),
    },
    menuBoxCat: {
      backgroundColor: "white",
      width: responsiveWidth(20),
      height: responsiveHeight(10),
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: 'black',
      shadowOpacity: .2,
      borderRadius: responsiveHeight(10),
      shadowOffset: {
        height: 2,
        width: -2
      },
      elevation: 4,
      borderWidth: responsiveHeight(0.3)
    },
    iconCat: {
      width: responsiveWidth(6),
      height: responsiveHeight(4),
      resizeMode: 'contain'
    },
    info: {
      paddingVertical: responsiveHeight(0.5),
      fontSize: responsiveFontSize(1.5),
    },
  })

  resetOptions = () => {
    this.setState({
      category: '',
      vehiclesBorderColor: '#dcdcdc',
      housesBorderColor: '#dcdcdc',
      electronicBorderColor: '#dcdcdc',
      hardwareBorderColor: '#dcdcdc',
    })
  }

  onVehiclesPress = () => {
    this.setState({
      category: 'Vehicles',
      vehiclesBorderColor: '#008080',
      housesBorderColor: '#dcdcdc',
      electronicBorderColor: '#dcdcdc',
      hardwareBorderColor: '#dcdcdc',
    })
    this.updateParent('Vehicles')
  }

  onHousesPress = () => {
    this.setState({
      category: 'Houses',
      vehiclesBorderColor: '#dcdcdc',
      housesBorderColor: '#008080',
      electronicBorderColor: '#dcdcdc',
      hardwareBorderColor: '#dcdcdc',
    })
    this.updateParent('Houses')
  }

  onElectronicsPress = () => {
    this.setState({
      category: 'Electronics',
      vehiclesBorderColor: '#dcdcdc',
      housesBorderColor: '#dcdcdc',
      electronicBorderColor: '#008080',
      hardwareBorderColor: '#dcdcdc',
    })
    this.updateParent('Electronics')
  }

  onHardwarePress = () => {
    this.setState({
      category: 'Hardware',
      vehiclesBorderColor: '#dcdcdc',
      housesBorderColor: '#dcdcdc',
      electronicBorderColor: '#dcdcdc',
      hardwareBorderColor: '#008080',
    })
    this.updateParent('Hardware')
  }

  render() {
    return (
      <View style={{ flex: this.props.flexSize, justifyContent: 'center', marginTop: this.props.marginTop }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={this.styles.categoriesHeading}>Categories</Text>
        </View>
        <View style={{ flexDirection: 'row', flex: 2, alignItems: 'center', justifyContent: 'space-evenly' }}>
          <TouchableOpacity onPress={this.onVehiclesPress}>
            <View style={[this.styles.menuBoxCat, { borderColor: this.state.vehiclesBorderColor }]}>
              <Image style={this.styles.iconCat} source={require('../../../Images/35.png')} />
              <Text style={this.styles.info}>Vehicles</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.onHousesPress}>
            <View style={[this.styles.menuBoxCat, { borderColor: this.state.housesBorderColor }]}>
              <Image style={this.styles.iconCat} source={require('../../../Images/36.png')} />
              <Text style={this.styles.info}>Houses</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.onElectronicsPress}>
            <View style={[this.styles.menuBoxCat, { borderColor: this.state.electronicBorderColor }]}>
              <Image style={this.styles.iconCat} source={require('../../../Images/37.png')} />
              <Text style={this.styles.info}>Electronics</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.onHardwarePress}>
            <View style={[this.styles.menuBoxCat, { borderColor: this.state.hardwareBorderColor }]}>
              <Image style={this.styles.iconCat} source={require('../../../Images/38.png')} />
              <Text style={this.styles.info}>Hardware</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}