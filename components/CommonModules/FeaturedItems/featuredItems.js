import React, { Component } from "react";
import { Text, View, Image } from 'react-native';

import dashboardStyles from '../../CommonStyles/dashboardStyles'

export default class FeaturedItems extends Component {
    render() {
        return (
            <View style={dashboardStyles.menuBox}>
                <Image style={dashboardStyles.thumbnail} source={this.props.imageSource} />
                <Text style={dashboardStyles.info}>{this.props.name}</Text>
            </View>
        )
    }
}