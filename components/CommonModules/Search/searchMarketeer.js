import React, { Component } from 'react';
import {
    Text,
    TextInput,
    View,
    TouchableOpacity,
    StyleSheet,
    Image
} from 'react-native';

import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable'

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import EvilIcons from 'react-native-vector-icons/EvilIcons'

export default class InternalHeader extends Component {

    getFlexSize = () => { return this.props.flexSize }

    render() {
        return (
            <Animatable.View animation={'slideInLeft'} duration={300} style={{ flex: 1 }}>

                <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1.3, y: 0 }} colors={['#008080', '#4c516d']} style={{ flex: 1, justifyContent: 'center', flexDirection: 'row' }}>
                    <View style={{ justifyContent: 'center' }}>
                        <View style={styles.inputContainer}>
                            <View style={{ justifyContent: 'center', paddingHorizontal: responsiveWidth(1.5) }}>
                                <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{ paddingHorizontal: responsiveWidth(3), flex: 1, justifyContent: 'center' }}>
                                    <FontAwesome5 name={'arrow-left'} color={'black'} size={responsiveHeight(3)} />
                                </TouchableOpacity>
                            </View>
                            <TextInput placeholder="Search" />
                        </View>
                    </View>
                </LinearGradient>

                <View style={{ flex: 10, justifyContent: 'center', alignItems: 'center' }}>
                    <Image style={styles.image} source={require('../../../Images/search.png/')} />
                    <Text>
                        Type your desired item in search bar
                    </Text>
                </View>

            </Animatable.View>
        )
    }
}

const styles = StyleSheet.create({
    text: {
        fontSize: responsiveFontSize(3),
        color: 'white'
    },
    inputContainer: {
        borderBottomColor: '#F5FCFF',
        backgroundColor: '#FFFFFF',
        borderRadius: 30,
        borderBottomWidth: 1,
        height: responsiveHeight(6),
        width: responsiveWidth(95),
        margin: 5,
        flexDirection: 'row',
    },
    image: {
        height: responsiveHeight(12),
        width: responsiveWidth(24),
        margin: responsiveHeight(2),
        resizeMode: 'contain'
    }
});