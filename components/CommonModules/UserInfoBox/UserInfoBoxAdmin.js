import React, { Component } from 'react';
import {
    View,
    Text,
} from 'react-native';

import { responsiveHeight, responsiveWidth, responsiveFontSize } from "react-native-responsive-dimensions";

import Entypo from 'react-native-vector-icons/Entypo'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

export default class UserInfoBox extends Component {
    constructor(props) {
        super(props)
        this.state = {
            iconType: {
                userID:<FontAwesome name={'id-card'} color={'#db3236'} size={responsiveHeight(4)} />,
                name: <FontAwesome5 name={'user-tie'} color={'#008080'} size={responsiveHeight(4)} />,
                phoneNumber: <FontAwesome name={'phone'} color={'black'} size={responsiveHeight(4)} />,
                email:<Entypo name={'email'} color={'#4885ed'} size={responsiveHeight(4)} />,
                account:<MaterialCommunityIcons name={'account-circle'} color={'gray'} size={responsiveHeight(4)} />,
                type:<MaterialCommunityIcons name={'account-question'} color={'#008080'} size={responsiveHeight(4)} />
            }
        }
    }

    render() {
        let icon=this.state.iconType[this.props.type]
        return (
            <View style={{ flex: this.props.flexSize, alignItems:'center', flexDirection:'row', marginVertical:this.props.margin, width:responsiveWidth(this.props.width) }}>
                <View style={{ flex: 1, justifyContent:'center', alignItems:'center' }}>
                    {icon}
                </View>
                <View style={{ flex: 2, justifyContent:'center' }}>
                    <Text>{this.props.value}</Text>
                </View>
            </View>
        )
    }
}