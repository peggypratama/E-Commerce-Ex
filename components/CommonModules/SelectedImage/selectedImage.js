import React, { Component } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Text
} from 'react-native';

import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import Entypo from 'react-native-vector-icons/Entypo'
import * as Animatable from 'react-native-animatable'

export default class SelectedPictures extends Component {
  constructor(props) {
    super(props)
    this.state = {
      filepath: this.props.filepath,
    }
    this.resetParent = this.props.resetParent
  }

  componentDidUpdate(prevProps) {
    if (this.props.value != prevProps.value)
      this.setState({ filepath: this.props.value })
  }

  removeImage = () => {
    this.setState({ filepath: null })
    this.resetParent()
  }

  render() {
    return (
      <Animatable.View animation={'slideInLeft'} duration={1000} style={{ flex: this.props.flexSize, height:this.props.height, width:this.props.width, borderRadius:this.props.radius }}>
        <Image source={{ uri: this.state.filepath.uri, isStatic: true }} style={{ flex: 1, resizeMode: 'cover', width: this.props.width }} />
        <TouchableOpacity onPress={this.removeImage} style={{ position: 'absolute', elevation: 4, marginTop: responsiveHeight(1), marginLeft: this.props.crossWidth, alignItems: 'center', justifyContent: 'center' }}>
          <Entypo name={'cross'} size={responsiveHeight(4)} color={'black'} />
        </TouchableOpacity>
      </Animatable.View>
    )
  }
}