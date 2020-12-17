import React, { Component } from 'react';
import {
    View,
    Text,
} from 'react-native';

import { responsiveHeight, responsiveWidth, responsiveFontSize } from "react-native-responsive-dimensions";

import Entypo from 'react-native-vector-icons/Entypo'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Octicons from 'react-native-vector-icons/Octicons'

export default class UserInfoBox extends Component {
    constructor(props) {
        super(props)
        this.state = {
            iconType: {
                name: <FontAwesome5 name={'user-tie'} color={'#008080'} size={responsiveHeight(4)} />,
                phoneNumber: <FontAwesome name={'phone'} color={'#db3236'} size={responsiveHeight(4)} />,
                email:<Entypo name={'email'} color={'#4885ed'} size={responsiveHeight(4)} />
            }
        }
    }

    render() {
        let icon=this.state.iconType[this.props.type]
        return (
            <View style={{ flex: this.props.flexSize ,flexDirection:'row', marginVertical:this.props.margin }}>
                <View style={{ flex: 1, justifyContent:'center' }}>
                    {icon}
                </View>
                <View style={{ flex: 6, justifyContent:'center' }}>
                    <Text>{this.props.value}</Text>
                </View>
            </View>
        )
    }
}