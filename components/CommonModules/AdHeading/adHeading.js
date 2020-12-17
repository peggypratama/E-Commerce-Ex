import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';

export default class AdHeading extends Component {
    render() {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginVertical: this.props.margin }}>
                <Text style={{ color: '#008080', fontWeight: 'bold', fontSize: responsiveFontSize(this.props.fontSize) }}>{this.props.name}</Text>
            </View>
        )
    }
}