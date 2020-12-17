import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import Entypo from 'react-native-vector-icons/Entypo'
import ImagePicker from 'react-native-image-picker';
import * as Animatable from 'react-native-animatable'

export default class UploadPictures extends Component {
  constructor(props) {
    super(props)
    this.state = {
      filepath: null,
    }
    this.updateParent=this.props.updateParent
  }
  openCamera = () => {
    var options = {
      title: 'Select Image',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        let source = response;
        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };
        this.updateParent(source)
        this.setState({
          filePath: source,
        });
      }
    })
  }
  
  render() {
    return (
      <Animatable.View style={{ flex: this.props.flexSize }}>
        <TouchableOpacity style={{ flex: 1 }} onPress={this.openCamera}>
          <View style={{ flex: 1, backgroundColor: '#d1d1d1', alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ flex: 1, justifyContent: 'flex-end' }}>
              <Entypo name={'camera'} color={'black'} size={responsiveHeight(5)} />
            </View>
            <View style={{ flex: 1 }}>
              <Text>Upload your pictures</Text>
            </View>
          </View>
        </TouchableOpacity>
      </Animatable.View>
    )
  }
}