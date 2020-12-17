import React, { Component } from 'react';
import {
    Text,
    TouchableOpacity,
} from 'react-native';

import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import ImagePicker from 'react-native-image-picker';

export default class Account extends Component {
    constructor(props) {
        super(props)
        this.state = {
            filePath:null
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
            <TouchableOpacity onPress={this.openCamera} style={{ flex: 0.5, alignItems: 'center', justifyContent: 'center', marginTop: responsiveHeight(-4) }}>
                <Text style={{ fontSize: responsiveFontSize(2), color: '#008080' }}>Change Profile Photo</Text>
            </TouchableOpacity>
        )
    }
}