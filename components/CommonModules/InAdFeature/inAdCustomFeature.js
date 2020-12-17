import React, { Component } from 'react'
import {
    Text,
    View,
    StyleSheet,
} from 'react-native';

import { responsiveFontSize, responsiveWidth, responsiveHeight } from 'react-native-responsive-dimensions';

export default class InAdCustomFeature extends Component {
    constructor(props) {
        super(props)
    }

    styles = StyleSheet.create({
        container: {
            flex: 1,
            flexDirection: 'row',
            width: responsiveWidth(90),
            justifyContent: 'center',
            alignItems: 'center',
            marginVertical: responsiveHeight(2),
        },
        txtContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        txt: {
            textAlign: 'center',
            fontSize: responsiveFontSize(2.5)
        }
    })

    render() {
        let backgroundColor=''
        if (this.props.index % 2 == 0)
            backgroundColor = '#66b2b2'
        else
            backgroundColor = 'white'
        return (
            <View style={[this.styles.container, {backgroundColor:backgroundColor}]}>
                <View style={this.styles.txtContainer}>
                    <Text style={this.styles.txt}>{this.props.title}</Text>
                </View>
                <View style={this.styles.txtContainer}>
                    <Text style={this.styles.txt}>{this.props.description}</Text>
                </View>
            </View>
        )
    }
}