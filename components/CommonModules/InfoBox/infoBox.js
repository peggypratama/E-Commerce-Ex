import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';

export default class InfoBox extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={{ flex: 1, justifyContent:'flex-start' }}>
                    <Text style={styles.heading}>{this.props.heading}</Text>
                </View>
                <View style={{ flex: 3, justifyContent:'center' }}>
                    <Text style={styles.value}>{this.props.value}</Text>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor:'#f2f2f2',
        paddingVertical:responsiveHeight(4),
        marginHorizontal:responsiveWidth(1),
        borderRadius:responsiveWidth(3)
    },
    heading: {
        flex:1,
        fontWeight:'bold',
        color:'black',
        fontSize:responsiveFontSize(1.8),
        textAlign:'center',
    },
    value: {
        flex:1,
        fontWeight:'bold',
        color:'#008080',
        fontSize:responsiveFontSize(2.3),
        textAlign:'center'
    }
})