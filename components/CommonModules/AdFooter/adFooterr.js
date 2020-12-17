import React, { Component } from 'react'
import {
    View,
    TouchableOpacity,
    StyleSheet,
    Linking,
    Text,
    KeyboardAvoidingView
} from 'react-native';

import { responsiveFontSize, responsiveWidth, responsiveHeight } from 'react-native-responsive-dimensions';
import AntDesign from 'react-native-vector-icons/AntDesign'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

export default class AdFooter extends Component {
    constructor(props) {
        super(props)
    }

    styles = StyleSheet.create({
        iconContainer: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
        }
    })


    render() {
    
        return (
            <KeyboardAvoidingView style={{ flex: this.props.flexSize, flexDirection: 'row' }}>
                
                <TouchableOpacity onPress={this.props.onLoginPress} style={[this.styles.iconContainer, { backgroundColor: '#008080' }]}>
                    <AntDesign name={'user'} color={'white'} size={responsiveHeight(4.5)} /><Text>BUY</Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        )
    }
}