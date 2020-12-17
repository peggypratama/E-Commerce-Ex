import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
} from 'react-native';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';

export default class Option extends Component {
    styles = StyleSheet.create({
        menuBox1: {
            height:this.props.height,
            flex: this.props.flexSize,
            flexDirection: 'row',
            width: responsiveWidth(100),
            borderRadius: responsiveHeight(0),
            backgroundColor: 'white',
            alignItems: 'center',
            elevation: 1,
        },
        box: {
            flex: 0.9,
            borderColor: '#989898',
            flexDirection: 'row'
        },
    });
    render() {
        return (
            <View style={this.styles.menuBox1}>
                <TouchableOpacity style={this.styles.box} onPress={this.props.action}>
                    <View style={{ alignItems: 'flex-start', flex: 0.40, justifyContent: "center", paddingHorizontal: responsiveWidth(7) }}>
                        {this.props.icon}
                    </View>
                    <View style={{ alignItems: 'flex-start', flex: 3, justifyContent: "center" }}>
                        <Text style={{ fontSize: responsiveFontSize(2.9) }}>{this.props.name}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
}