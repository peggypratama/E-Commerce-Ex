import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    StyleSheet
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';

export default class InternalHeader extends Component {

    getFlexSize = () => { return this.props.flexSize }

    render() {
        return (
            <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1.3, y: 0 }} colors={['#008080', '#4c516d']} style={{ flex: this.getFlexSize(), justifyContent: 'center', flexDirection: 'row' }}>
                <View style={{ flex: 1, justifyContent: 'center', position: 'relative', zIndex: 2 }}>
                    <TouchableOpacity onPress={this.props.action} style={{ paddingHorizontal: responsiveWidth(3), flex:1, justifyContent:'center' }}>
                        <FontAwesome5 name={'arrow-left'} color={'#ffffff'} size={responsiveHeight(4)} />
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 5, justifyContent: 'center', marginLeft:responsiveWidth(18)}}>
                    <Text numberOfLines={1} ellipsizeMode={'tail'} style={styles.text}>{this.props.name}</Text>
                </View>
            </LinearGradient>
        )
    }
}

const styles = StyleSheet.create({
    text: {
        fontSize: responsiveFontSize(3),
        color: 'white'
    },
});  