import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';

import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import Entypo from 'react-native-vector-icons/Entypo'
import LinearGradient from 'react-native-linear-gradient'
import * as Animatable from 'react-native-animatable';

export default class NewFeatureButton extends Component {
    constructor(props) {
        super()
        this.state={
        }
    }

    onButtonPress = () => {
        this.AnimationRef.fadeInDown();
        this.props.action()
    }
    
    render() {
        return (
            <Animatable.View ref={ref => this.AnimationRef = ref} duration={1000} style={{ alignItems: 'center', flex: this.props.flexSize, marginTop:responsiveHeight(1) }}>
                <Entypo name={'dots-three-vertical'} color={'#008080'} size={responsiveHeight(2.5)} />
                <Entypo name={'dots-three-vertical'} color={'#008080'} size={responsiveHeight(2.5)} />
                <TouchableOpacity onPress={this.onButtonPress} style={styles.btnAddFeature}>
                    <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1.3, y: 0 }} colors={['#008080', '#4c516d']} style={styles.btnAddFeature}>
                        <Entypo name={'plus'} size={responsiveHeight(3)} color={'white'} />
                    </LinearGradient>
                </TouchableOpacity>
            </Animatable.View>
        )
    }
}

const styles = StyleSheet.create({
    btnAddFeature: {
        backgroundColor: '#008080',
        width: responsiveWidth(14.5),
        height: responsiveHeight(7.5),
        borderRadius: responsiveHeight(10),
        alignItems: 'center',
        justifyContent: 'center',
    },
})