import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';

import { responsiveHeight, responsiveWidth, responsiveFontSize, useResponsiveFontSize } from 'react-native-responsive-dimensions';
import LinearGradient from 'react-native-linear-gradient'

export default class PostButton extends Component {
    constructor(props) {
        super(props)
        this.state = {
            btnIndicator: false,
            disableButton:false
        }
        this.action = this.props.action
    }

    postAd = async () => {
        this.setState({ disableButton:true, btnIndicator: true })
        await this.action()
        this.setState({ disableButton:false, btnIndicator: false })
    }

    render() {
        let btnDisplay;
        if (this.state.btnIndicator)
            btnDisplay = <ActivityIndicator size={responsiveHeight(4)} color={'white'} />
        else
            btnDisplay = <Text style={styles.btnTxt}>{this.props.buttonText}</Text>
        return (
            <View style={{ flex: this.props.flexSize, alignItems: 'center', justifyContent: 'center' }}>
                <TouchableOpacity disabled={this.state.disableButton} onPress={this.postAd} style={{ flex: 1 }}>
                    <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1.3, y: 0 }} colors={['#008080', '#4c516d']} style={styles.btn}>
                        {btnDisplay}
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    btn: {
        flex: 1,
        width: responsiveWidth(80),
        height: responsiveHeight(6.2),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        paddingHorizontal: responsiveWidth(3),
        marginVertical: responsiveHeight(3)
    },
    btnTxt: {
        color: 'white',
        fontSize: responsiveFontSize(2.3),
        letterSpacing: responsiveWidth(0.2),
    },
})