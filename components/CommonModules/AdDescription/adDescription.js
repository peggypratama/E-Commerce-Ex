import React, { Component } from 'react'
import {
    Text,
    View,
} from 'react-native';

import { responsiveFontSize, responsiveWidth, responsiveHeight } from 'react-native-responsive-dimensions';
import AdHeading from '../AdHeading/adHeading'

export default class AdDescription extends Component {
    constructor(props) {
        super(props)
        this.state = {
            lines: 2,
            read: 'Read More'
        }
    }

    onReadPress = () => {
        if (this.state.read == 'Read More')
            this.setState({ read: 'Read Less', lines: 2000000 })
        else
            this.setState({ read: 'Read More', lines: 2 })
    }

    render() {
        let readOption;
        if (this.props.description != '')
            readOption = <Text onPress={this.onReadPress} style={{ color: '#008080', fontWeight: 'bold', marginTop:responsiveHeight(0.5) }}>{this.state.read}</Text>
        else
            readOption = null
        return (
            <View>
                <View>
                    <Text numberOfLines={this.state.lines}>{this.props.description}</Text>
                    {readOption}
                </View>
            </View>
        )
    }
}