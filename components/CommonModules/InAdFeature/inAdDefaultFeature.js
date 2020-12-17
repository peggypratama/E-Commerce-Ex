import React, { Component } from 'react'
import {
    Text,
    View,
    StyleSheet,
} from 'react-native';

import { responsiveFontSize, responsiveWidth, responsiveHeight } from 'react-native-responsive-dimensions';
import * as Animatable from 'react-native-animatable';

export default class InAdDefualtFeature extends Component {
    constructor(props) {
        super(props)
    }

    styles = StyleSheet.create({
        container: {
            paddingHorizontal: responsiveWidth(2),
            marginVertical: responsiveHeight(1),
            width: responsiveWidth(30),
            flex: this.props.flexSize,
            justifyContent: 'center',
            alignItems: 'center'
        },
        name: {
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            flex: 1,
            paddingVertical: responsiveHeight(1)
        }
    })

    render() {
        return (
            <View style={this.styles.container}>
                <Animatable.View animation={'tada'} duration={1000} iterationCount={'infinite'} style={{ flex: 1 }}>
                    {this.props.icon}
                </Animatable.View>
                <Text numberOfLines={2} style={this.styles.name}>{this.props.name}</Text>
                <Text style={{ flex: 1 }}>{this.props.value}</Text>
            </View>
        )
    }
}