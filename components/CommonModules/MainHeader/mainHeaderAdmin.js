import React, { Component } from 'react';
import {
    Text,
    StyleSheet,
} from 'react-native';

import { responsiveFontSize, responsiveWidth, responsiveHeight } from 'react-native-responsive-dimensions';
import LinearGradient from 'react-native-linear-gradient'

export default class MainHeader extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    render() {
        return (
            <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1.3, y: 0 }} colors={['#008080', '#4c516d']} style={this.styles.gradient}>
                <Text style={this.styles.pageHeading}>{this.props.heading}</Text>
            </LinearGradient>
        )
    }

    styles = StyleSheet.create({
        gradient: {
            flex: this.props.flexSize,
            width: responsiveWidth(100),
            alignItems: 'center',
            justifyContent: 'center'
        },
        pageHeading: {
            color: 'white',
            fontWeight: 'bold',
            fontSize: responsiveFontSize(3),
        },
    });
}