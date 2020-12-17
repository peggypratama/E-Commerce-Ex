import React, { Component } from 'react'
import {
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';

import { responsiveFontSize, responsiveWidth, responsiveHeight } from 'react-native-responsive-dimensions';
import LinearGradient from 'react-native-linear-gradient';

import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

export default class AdStickyHeader extends Component {
    constructor(props) {
        super(props)
    }

    styles = StyleSheet.create({
        mainContainer: {
            justifyContent: 'center',
            flexDirection: 'row',
            height: responsiveHeight(8)
        },
        innerContainer: {
            flex: 1,
            justifyContent: 'center',
        },
        txt: {
            color: 'white',
            fontSize: responsiveFontSize(2.8)
        }
    })

    render() {
        return (
            <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1.3, y: 0 }} colors={['#008080', '#4c516d']} style={this.styles.mainContainer}>
                <TouchableOpacity onPress={this.props.action} style={[this.styles.innerContainer, { paddingLeft: responsiveWidth(3) }]}>
                    <FontAwesome5 name={'arrow-left'} color={'white'} size={responsiveHeight(4)} />
                </TouchableOpacity>
                <View style={[this.styles.innerContainer, { flex: 6 }]}>
                    <Text style={this.styles.txt}>Details</Text>
                </View>
                <TouchableOpacity onPress={this.props.scrollToTop} style={[this.styles.innerContainer, { flex: 1 }]}>
                    <Ionicons name={'ios-arrow-dropup'} color={'white'} size={responsiveHeight(4.5)} />
                </TouchableOpacity>
            </LinearGradient>
        )
    }
}